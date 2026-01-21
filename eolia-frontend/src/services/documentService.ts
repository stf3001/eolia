import { fetchAuthSession } from 'aws-amplify/auth';
import type { DossierDocument, DossierType } from '../types/dossier';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Taille max avant compression (2 Mo)
const MAX_SIZE_BEFORE_COMPRESSION = 2 * 1024 * 1024;
// Taille max upload (10 Mo)
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
// Types de fichiers acceptés
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

const getAuthHeaders = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString() || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export interface UploadUrlRequest {
  dossierType: DossierType | 'installation_vt' | 'installation_reports';
  fileName: string;
  contentType: string;
  size: number;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  documentId: string;
  expiresIn: number;
}

export interface GetDocumentsResponse {
  documents: DossierDocument[];
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Compresse une image côté client si elle dépasse la taille max
 */
export async function compressImage(
  file: File,
  maxSizeBytes: number = MAX_SIZE_BEFORE_COMPRESSION,
  quality: number = 0.8
): Promise<File> {
  // Ne pas compresser les PDFs
  if (file.type === 'application/pdf') {
    return file;
  }

  // Si le fichier est déjà assez petit, pas besoin de compresser
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculer les nouvelles dimensions en gardant le ratio
      let { width, height } = img;
      const maxDimension = 2048;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Impossible de créer le contexte canvas'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Échec de la compression'));
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Échec du chargement de l\'image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Valide un fichier avant upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format de fichier non supporté. Formats acceptés : JPG, PNG, PDF',
    };
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return {
      valid: false,
      error: `Le fichier dépasse la taille maximale de ${MAX_UPLOAD_SIZE / (1024 * 1024)} Mo`,
    };
  }

  return { valid: true };
}

export const documentService = {
  /**
   * Récupère l'URL pré-signée pour upload
   */
  async getUploadUrl(orderId: string, request: UploadUrlRequest): Promise<UploadUrlResponse> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}/documents/upload-url`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la génération de l\'URL d\'upload');
    }

    return response.json();
  },

  /**
   * Upload un fichier vers S3 via URL pré-signée
   */
  async uploadToS3(
    uploadUrl: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Échec de l'upload: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Erreur réseau lors de l\'upload'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  },

  /**
   * Upload complet d'un document (compression + URL pré-signée + upload S3)
   */
  async uploadDocument(
    orderId: string,
    dossierType: UploadUrlRequest['dossierType'],
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ documentId: string }> {
    // Valider le fichier
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Compresser si nécessaire (images uniquement)
    let fileToUpload = file;
    if (file.type.startsWith('image/') && file.size > MAX_SIZE_BEFORE_COMPRESSION) {
      fileToUpload = await compressImage(file);
    }

    // Obtenir l'URL pré-signée
    const { uploadUrl, documentId } = await this.getUploadUrl(orderId, {
      dossierType,
      fileName: file.name,
      contentType: fileToUpload.type,
      size: fileToUpload.size,
    });

    // Upload vers S3
    await this.uploadToS3(uploadUrl, fileToUpload, onProgress);

    return { documentId };
  },

  /**
   * Récupère la liste des documents d'une commande
   */
  async getDocuments(orderId: string, dossierType?: string): Promise<DossierDocument[]> {
    const headers = await getAuthHeaders();
    const url = new URL(`${API_URL}/orders/${orderId}/documents`);
    if (dossierType) {
      url.searchParams.set('dossierType', dossierType);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des documents');
    }

    const data: GetDocumentsResponse = await response.json();
    return data.documents;
  },

  /**
   * Supprime un document
   */
  async deleteDocument(orderId: string, documentId: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}/documents/${documentId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la suppression du document');
    }
  },

  /**
   * Télécharge un document (ouvre dans un nouvel onglet)
   */
  downloadDocument(document: DossierDocument): void {
    if (document.downloadUrl) {
      window.open(document.downloadUrl, '_blank');
    }
  },
};
