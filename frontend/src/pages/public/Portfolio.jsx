import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import JourneySection from './components/JourneySection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import ProblemSolvingSection from './components/ProblemSolvingSection';
import GithubContributionSection from './components/GithubContributionSection';
import BlogsSection from './components/BlogsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import SmoothScroll from '../../components/SmoothScroll';
import ScrollReveal from '../../components/ScrollReveal';
import { updatePageMeta } from '../../utils/pageMeta';

const DEFAULT_PORTFOLIO = {
  profile: {
    full_name: 'Sakil Ahmed',
    role: 'Full Stack Developer',
    title: 'Full Stack Developer',
    bio: 'Building scalable, modern and performant web applications.'
  },
  skills: [],
  experiences: [],
  projects: [],
  blogs: [],
  socialLinks: []
};

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioRes = await api.get('/portfolio').catch((err) => {
          console.warn('Could not fetch portfolio API, using defaults:', err.message);
          return { data: DEFAULT_PORTFOLIO };
        });

        const currentProfile = portfolioRes.data?.profile || DEFAULT_PORTFOLIO.profile;
        updatePageMeta({
          title: `${currentProfile.full_name || 'Sakil Ahmed'} — ${currentProfile.role || currentProfile.title || 'Full Stack Developer'}`,
          faviconUrl: currentProfile.favicon_url || currentProfile.icon_image_url || '/favicon.svg'
        });

        const gh = currentProfile.github_username || 'protik0939';
        const lc = currentProfile.leetcode_username || 'sakil';
        const cf = currentProfile.codeforces_username || 'sakil';

        const statsRes = await api
          .get(`/stats?github_username=${gh}&leetcode_username=${lc}&codeforces_username=${cf}`)
          .catch(() => ({ data: null }));

        setData(portfolioRes.data || DEFAULT_PORTFOLIO);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setData(DEFAULT_PORTFOLIO);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-teal-400/20 border-t-teal-400 rounded-full animate-spin mb-4" />
        <span className="text-xl font-medium tracking-wide text-teal-400">Loading Portfolio...</span>
      </div>
    );
  }

  const currentData = data || DEFAULT_PORTFOLIO;
  const profile = currentData.profile || DEFAULT_PORTFOLIO.profile;
  const skills = currentData.skills || [];
  const experiences = currentData.experiences || [];
  const projects = currentData.projects || [];
  const blogs = currentData.blogs || [];
  const allProjects = currentData.allProjects || projects;
  const allBlogs = currentData.allBlogs || blogs;
  const socialLinks = currentData.socialLinks || [];
  const services = currentData.services || [];

  // Filter social links based on placement settings
  const heroSocialLinks = socialLinks.filter((s) => s.show_in_hero !== false);
  const footerSocialLinks = socialLinks.filter((s) => s.show_in_footer !== false);

  return (
    <div className="min-h-screen font-sans relative" style={{ color: 'var(--text-primary)', zIndex: 1 }}>
      {/* Inertial Smooth Scrolling */}
      <SmoothScroll />

      {/* Floating Glass Navbar */}
      <Navbar profile={profile} />

      {/* Hero Section — 90% wide, unobstructed grid view with glowing hover cards */}
      <HeroSection
        profile={profile}
        projects={projects}
        skills={skills}
        stats={stats}
        socialLinks={heroSocialLinks}
        blogs={allBlogs || blogs}
      />

      {/* Extra spacing */}
      <div className="h-6 md:h-10" />

      {/* About / Journey Section (Uniform Glass Panel with Smooth Bottom-Up Viewport Reveal) */}
      <ScrollReveal>
        <JourneySection profile={profile} projects={projects} />
      </ScrollReveal>

      {/* Skills Section (Progress Bar Viewport Animation) */}
      <ScrollReveal>
        <SkillsSection skills={skills} />
      </ScrollReveal>

      {/* Projects Section */}
      <ScrollReveal>
        <ProjectsSection projects={projects} allProjects={allProjects} skills={skills} />
      </ScrollReveal>

      {/* Career Timeline: Education & Experience */}
      <ScrollReveal>
        <ExperienceSection experiences={experiences} />
      </ScrollReveal>

      {/* Problem Solving Skill (Competitive Programming) */}
      <ScrollReveal>
        <ProblemSolvingSection profile={profile} stats={stats} />
      </ScrollReveal>

      {/* GitHub Contribution (Open Source Heatmap & Top Repos) */}
      <ScrollReveal>
        <GithubContributionSection profile={profile} stats={stats} />
      </ScrollReveal>

      {/* Blogs Section */}
      <ScrollReveal>
        <BlogsSection blogs={blogs} allBlogs={allBlogs} />
      </ScrollReveal>

      {/* Contact Section */}
      <ScrollReveal>
        <ContactSection profile={profile} services={services} socialLinks={socialLinks} />
      </ScrollReveal>

      {/* Footer (Social Titles, Contact Email/Phone, Uniform Glass Panel) */}
      <ScrollReveal>
        <Footer profile={profile} socialLinks={footerSocialLinks} />
      </ScrollReveal>
    </div>
  );
};

export default Portfolio;
