/**
 * Tests unitaires pour le service de stockage de documents
 * Requirements: 6.2, 6.4, 6.5
 */

import { describe, it, expect } from 'vitest';
import {
  validateContentType,
  validateFileExtension,
  validateFileSize,
  validateFile,
  generateS3Key,
  DocumentStorageConfig,
} from '../documentStorageService';

describe('documentStorageService', () => {
  describe('validateContentType', () => {
    it('should accept image/jpeg', () => {
      const result = validateContentType('image/jpeg');
      expect(result.valid).toBe(true);
    });

    it('should accept image/png', () => {
      const result = validateContentType('image/png');
      expect(result.valid).toBe(true);
    });

    it('should accept application/pdf', () => {
      const result = validateContentType('application/pdf');
      expect(result.valid).toBe(true);
    });

    it('should reject text/plain', () => {
      const result = validateContentType('text/plain');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Type de fichier non supporté');
    });

    it('should reject application/zip', () => {
      const result = validateContentType('application/zip');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateFileExtension', () => {
    it('should accept .jpg extension', () => {
      const result = validateFileExtension('photo.jpg');
      expect(result.valid).toBe(true);
    });

    it('should accept .jpeg extension', () => {
      const result = validateFileExtension('photo.jpeg');
      expect(result.valid).toBe(true);
    });

    it('should accept .png extension', () => {
      const result = validateFileExtension('image.png');
      expect(result.valid).toBe(true);
    });

    it('should accept .pdf extension', () => {
      const result = validateFileExtension('document.pdf');
      expect(result.valid).toBe(true);
    });

    it('should accept uppercase extensions', () => {
      const result = validateFileExtension('photo.JPG');
      expect(result.valid).toBe(true);
    });

    it('should reject .exe extension', () => {
      const result = validateFileExtension('virus.exe');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Extension de fichier non supportée');
    });

    it('should reject .txt extension', () => {
      const result = validateFileExtension('notes.txt');
      expect(result.valid).toBe(false);
    });

    it('should reject files without extension', () => {
      const result = validateFileExtension('noextension');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should accept file under 10 Mo', () => {
      const result = validateFileSize(5 * 1024 * 1024); // 5 Mo
      expect(result.valid).toBe(true);
    });

    it('should accept file exactly 10 Mo', () => {
      const result = validateFileSize(10 * 1024 * 1024); // 10 Mo
      expect(result.valid).toBe(true);
    });

    it('should reject file over 10 Mo', () => {
      const result = validateFileSize(11 * 1024 * 1024); // 11 Mo
      expect(result.valid).toBe(false);
      expect(result.error).toContain('taille maximale');
    });

    it('should reject zero size file', () => {
      const result = validateFileSize(0);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('supérieure à 0');
    });

    it('should reject negative size', () => {
      const result = validateFileSize(-100);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('should accept valid jpeg file', () => {
      const result = validateFile('photo.jpg', 'image/jpeg', 2 * 1024 * 1024);
      expect(result.valid).toBe(true);
    });

    it('should accept valid pdf file', () => {
      const result = validateFile('document.pdf', 'application/pdf', 5 * 1024 * 1024);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid extension', () => {
      const result = validateFile('file.exe', 'image/jpeg', 1024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Extension');
    });

    it('should reject invalid content type', () => {
      const result = validateFile('file.jpg', 'text/plain', 1024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Type de fichier');
    });

    it('should reject oversized file', () => {
      const result = validateFile('photo.jpg', 'image/jpeg', 15 * 1024 * 1024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('taille maximale');
    });
  });

  describe('generateS3Key', () => {
    it('should generate correct path structure', () => {
      const key = generateS3Key('client123', 'order456', 'shipping', 'photo.jpg');
      expect(key).toContain('clients/client123/orders/order456/shipping/');
      expect(key).toContain('photo.jpg');
    });

    it('should sanitize special characters in filename', () => {
      const key = generateS3Key('client123', 'order456', 'vt', 'photo with spaces!.jpg');
      expect(key).not.toContain(' ');
      expect(key).not.toContain('!');
    });

    it('should add timestamp to filename', () => {
      const key = generateS3Key('client123', 'order456', 'vt', 'photo.jpg');
      // Should contain a timestamp (numeric prefix)
      const filename = key.split('/').pop();
      expect(filename).toMatch(/^\d+_/);
    });
  });

  describe('DocumentStorageConfig', () => {
    it('should have correct max file size', () => {
      expect(DocumentStorageConfig.MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
      expect(DocumentStorageConfig.MAX_FILE_SIZE_MB).toBe(10);
    });

    it('should have correct presigned URL expiry', () => {
      expect(DocumentStorageConfig.PRESIGNED_URL_EXPIRY).toBe(15 * 60); // 15 minutes
    });

    it('should have correct allowed extensions', () => {
      expect(DocumentStorageConfig.ALLOWED_EXTENSIONS).toContain('jpg');
      expect(DocumentStorageConfig.ALLOWED_EXTENSIONS).toContain('jpeg');
      expect(DocumentStorageConfig.ALLOWED_EXTENSIONS).toContain('png');
      expect(DocumentStorageConfig.ALLOWED_EXTENSIONS).toContain('pdf');
    });
  });
});
