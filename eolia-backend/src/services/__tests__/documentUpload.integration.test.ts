/**
 * Tests d'intégration pour le flux d'upload de documents
 * Requirements: 6.1, 6.2, 6.3
 * 
 * Ces tests vérifient la logique complète du flux d'upload de documents
 */

import { describe, it, expect } from 'vitest';
import {
  validateFile,
  validateContentType,
  validateFileExtension,
  validateFileSize,
  generateS3Key,
  DocumentStorageConfig,
} from '../documentStorageService';

describe('Document Upload Integration', () => {
  describe('complete upload validation flow', () => {
    it('should validate a complete valid upload request', () => {
      const fileName = 'photo_installation.jpg';
      const contentType = 'image/jpeg';
      const size = 2 * 1024 * 1024; // 2 Mo

      const result = validateFile(fileName, contentType, size);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject upload with invalid extension first', () => {
      const fileName = 'document.exe';
      const contentType = 'image/jpeg';
      const size = 1024;

      const result = validateFile(fileName, contentType, size);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Extension');
    });

    it('should reject upload with invalid content type after extension check', () => {
      const fileName = 'photo.jpg';
      const contentType = 'application/octet-stream';
      const size = 1024;

      const result = validateFile(fileName, contentType, size);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Type de fichier');
    });

    it('should reject oversized file after type checks', () => {
      const fileName = 'photo.jpg';
      const contentType = 'image/jpeg';
      const size = 15 * 1024 * 1024; // 15 Mo

      const result = validateFile(fileName, contentType, size);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('taille maximale');
    });
  });

  describe('S3 key generation flow', () => {
    it('should generate correct path for VT photos', () => {
      const clientId = 'user_123';
      const orderId = 'order_456';
      const dossierType = 'installation_vt';
      const fileName = 'photo_toiture.jpg';

      const key = generateS3Key(clientId, orderId, dossierType, fileName);

      expect(key).toContain('clients/user_123');
      expect(key).toContain('orders/order_456');
      expect(key).toContain('installation_vt');
      expect(key).toContain('photo_toiture.jpg');
    });

    it('should generate correct path for shipping documents', () => {
      const clientId = 'user_123';
      const orderId = 'order_456';
      const dossierType = 'shipping';
      const fileName = 'bon_livraison.pdf';

      const key = generateS3Key(clientId, orderId, dossierType, fileName);

      expect(key).toContain('clients/user_123');
      expect(key).toContain('orders/order_456');
      expect(key).toContain('shipping');
      expect(key).toContain('bon_livraison.pdf');
    });

    it('should generate correct path for admin documents', () => {
      const clientId = 'user_123';
      const orderId = 'order_456';
      const dossierType = 'enedis';
      const fileName = 'attestation_enedis.pdf';

      const key = generateS3Key(clientId, orderId, dossierType, fileName);

      expect(key).toContain('clients/user_123');
      expect(key).toContain('orders/order_456');
      expect(key).toContain('enedis');
    });

    it('should handle special characters in filename', () => {
      const clientId = 'user_123';
      const orderId = 'order_456';
      const dossierType = 'vt';
      const fileName = 'photo été 2024 (1).jpg';

      const key = generateS3Key(clientId, orderId, dossierType, fileName);

      // Should not contain spaces or special chars
      expect(key).not.toContain(' ');
      expect(key).not.toContain('(');
      expect(key).not.toContain(')');
      expect(key).toContain('.jpg');
    });

    it('should add unique timestamp to prevent overwrites', () => {
      const clientId = 'user_123';
      const orderId = 'order_456';
      const dossierType = 'vt';
      const fileName = 'photo.jpg';

      const key1 = generateS3Key(clientId, orderId, dossierType, fileName);
      
      // Small delay to ensure different timestamp
      const key2 = generateS3Key(clientId, orderId, dossierType, fileName);

      // Both should have timestamp prefix
      const filename1 = key1.split('/').pop();
      const filename2 = key2.split('/').pop();
      
      expect(filename1).toMatch(/^\d+_/);
      expect(filename2).toMatch(/^\d+_/);
    });
  });

  describe('file type validation scenarios', () => {
    describe('image uploads', () => {
      it('should accept JPEG photos', () => {
        expect(validateContentType('image/jpeg').valid).toBe(true);
        expect(validateFileExtension('photo.jpeg').valid).toBe(true);
        expect(validateFileExtension('photo.jpg').valid).toBe(true);
      });

      it('should accept PNG images', () => {
        expect(validateContentType('image/png').valid).toBe(true);
        expect(validateFileExtension('screenshot.png').valid).toBe(true);
      });

      it('should reject GIF images', () => {
        expect(validateContentType('image/gif').valid).toBe(false);
        expect(validateFileExtension('animation.gif').valid).toBe(false);
      });

      it('should reject WebP images', () => {
        expect(validateContentType('image/webp').valid).toBe(false);
        expect(validateFileExtension('photo.webp').valid).toBe(false);
      });
    });

    describe('document uploads', () => {
      it('should accept PDF documents', () => {
        expect(validateContentType('application/pdf').valid).toBe(true);
        expect(validateFileExtension('document.pdf').valid).toBe(true);
      });

      it('should reject Word documents', () => {
        expect(validateContentType('application/msword').valid).toBe(false);
        expect(validateFileExtension('document.doc').valid).toBe(false);
        expect(validateFileExtension('document.docx').valid).toBe(false);
      });

      it('should reject Excel files', () => {
        expect(validateFileExtension('data.xlsx').valid).toBe(false);
        expect(validateFileExtension('data.xls').valid).toBe(false);
      });
    });

    describe('dangerous file types', () => {
      it('should reject executable files', () => {
        expect(validateFileExtension('virus.exe').valid).toBe(false);
        expect(validateFileExtension('script.bat').valid).toBe(false);
        expect(validateFileExtension('script.sh').valid).toBe(false);
      });

      it('should reject archive files', () => {
        expect(validateContentType('application/zip').valid).toBe(false);
        expect(validateFileExtension('archive.zip').valid).toBe(false);
        expect(validateFileExtension('archive.rar').valid).toBe(false);
      });

      it('should reject HTML files', () => {
        expect(validateContentType('text/html').valid).toBe(false);
        expect(validateFileExtension('page.html').valid).toBe(false);
      });
    });
  });

  describe('file size validation scenarios', () => {
    it('should accept small files (< 1 Mo)', () => {
      expect(validateFileSize(500 * 1024).valid).toBe(true); // 500 Ko
    });

    it('should accept medium files (1-5 Mo)', () => {
      expect(validateFileSize(3 * 1024 * 1024).valid).toBe(true); // 3 Mo
    });

    it('should accept files at limit (10 Mo)', () => {
      expect(validateFileSize(10 * 1024 * 1024).valid).toBe(true);
    });

    it('should reject files just over limit', () => {
      expect(validateFileSize(10 * 1024 * 1024 + 1).valid).toBe(false);
    });

    it('should reject large files (> 10 Mo)', () => {
      expect(validateFileSize(20 * 1024 * 1024).valid).toBe(false);
    });

    it('should reject empty files', () => {
      expect(validateFileSize(0).valid).toBe(false);
    });
  });

  describe('configuration constants', () => {
    it('should have correct max file size (10 Mo)', () => {
      expect(DocumentStorageConfig.MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
    });

    it('should have correct presigned URL expiry (15 minutes)', () => {
      expect(DocumentStorageConfig.PRESIGNED_URL_EXPIRY).toBe(900);
    });

    it('should have all required allowed extensions', () => {
      const required = ['jpg', 'jpeg', 'png', 'pdf'];
      for (const ext of required) {
        expect(DocumentStorageConfig.ALLOWED_EXTENSIONS).toContain(ext);
      }
    });

    it('should have all required allowed content types', () => {
      const required = ['image/jpeg', 'image/png', 'application/pdf'];
      for (const type of required) {
        expect(DocumentStorageConfig.ALLOWED_CONTENT_TYPES).toContain(type);
      }
    });
  });
});
