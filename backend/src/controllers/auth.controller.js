import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import { prisma } from '../index.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if any AdminUser exists in the database
    let adminUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: username.trim().toLowerCase() }
        ]
      }
    });

    if (!adminUser) {
      const count = await prisma.adminUser.count();
      // If table is empty, allow initial login with env / default credentials and seed the admin
      if (count === 0 && (username === defaultUsername || username === 'admin') && (password === defaultPassword || password === 'admin123')) {
        const hashedPassword = await bcrypt.hash(password, 10);
        adminUser = await prisma.adminUser.create({
          data: {
            username: defaultUsername,
            email: 'admin@portfolio.local',
            password: hashedPassword,
          }
        });
        const token = generateToken(adminUser.id);
        return res.json({ token, message: 'Login successful', username: adminUser.username });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(adminUser.id);
    return res.json({ 
      token, 
      message: 'Login successful', 
      user: { id: adminUser.id, username: adminUser.username, email: adminUser.email } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

export const getAdminCredentials = async (req, res) => {
  try {
    let adminUser = await prisma.adminUser.findFirst();
    if (!adminUser) {
      return res.json({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: 'admin@portfolio.local'
      });
    }
    return res.json({
      username: adminUser.username,
      email: adminUser.email || '',
    });
  } catch (error) {
    console.error('getAdminCredentials error:', error);
    return res.status(500).json({ message: 'Failed to fetch credentials' });
  }
};

export const changeCredentials = async (req, res) => {
  try {
    const { current_password, new_password, confirm_password, username, email } = req.body;

    if (!current_password) {
      return res.status(400).json({ message: 'Current password is required to make security changes' });
    }

    let adminUser = await prisma.adminUser.findFirst();

    // If no record exists yet, initialize it
    if (!adminUser) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      if (current_password !== defaultPassword) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
      const initialHashed = await bcrypt.hash(defaultPassword, 10);
      adminUser = await prisma.adminUser.create({
        data: {
          username: process.env.ADMIN_USERNAME || 'admin',
          email: 'admin@portfolio.local',
          password: initialHashed,
        }
      });
    } else {
      const isMatch = await bcrypt.compare(current_password, adminUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password does not match' });
      }
    }

    const updateData = {};

    if (username && username.trim() !== adminUser.username) {
      const existing = await prisma.adminUser.findFirst({
        where: { username: username.trim(), NOT: { id: adminUser.id } }
      });
      if (existing) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      updateData.username = username.trim();
    }

    if (email !== undefined) {
      updateData.email = email.trim() || null;
    }

    if (new_password) {
      if (new_password.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
      }
      if (new_password !== confirm_password) {
        return res.status(400).json({ message: 'New password and confirm password do not match' });
      }
      updateData.password = await bcrypt.hash(new_password, 10);
    }

    const updated = await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: updateData,
    });

    const newToken = generateToken(updated.id);

    return res.json({
      message: 'Account credentials successfully updated!',
      token: newToken,
      user: {
        username: updated.username,
        email: updated.email
      }
    });
  } catch (error) {
    console.error('changeCredentials error:', error);
    return res.status(500).json({ message: 'Failed to update credentials' });
  }
};
