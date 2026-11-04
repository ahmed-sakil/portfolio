/**
 * Validates raw buffer signatures (magic bytes) to ensure uploaded files
 * are genuine images, preventing MIME-spoofing and stored SVG XSS attacks.
 */

export interface ImageValidationResult {
  isValid: boolean;
  format?: 'jpeg' | 'png' | 'gif' | 'webp' | 'svg';
  error?: string;
}

export function validateImageBuffer(buffer: Buffer): ImageValidationResult {
  if (!buffer || buffer.length < 4) {
    return { isValid: false, error: 'File buffer is empty or too small.' };
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, format: 'jpeg' };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, format: 'png' };
  }

  // 3. GIF: GIF87a or GIF89a (47 49 46 38)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { isValid: true, format: 'gif' };
  }

  // 4. WebP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46 && // F
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50 // P
  ) {
    return { isValid: true, format: 'webp' };
  }

  // 5. SVG check: ASCII / UTF-8 XML containing <svg
  const textSample = buffer.slice(0, 1024).toString('utf-8').trim().toLowerCase();
  if (textSample.includes('<svg') || textSample.includes('<?xml')) {
    // Check entire SVG string for dangerous XSS payloads
    const fullText = buffer.toString('utf-8').toLowerCase();
    if (
      fullText.includes('<script') ||
      fullText.includes('javascript:') ||
      fullText.includes('onload=') ||
      fullText.includes('onerror=') ||
      fullText.includes('onclick=')
    ) {
      return {
        isValid: false,
        error: 'SVG file contains prohibited embedded executable scripts or event handlers.',
      };
    }
    return { isValid: true, format: 'svg' };
  }

  return {
    isValid: false,
    error: 'Unrecognized image file format. Only JPEG, PNG, GIF, WebP, and safe SVG images are allowed.',
  };
}
