/**
 * Service S3 pour la gestion des documents clients
 * Requirements: 6.2, 6.4, 6.5
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.REGION || 'eu-west-1',
});

const BUCKET_NAME = process.env.CLIENT_DOCUMENTS_BUCKET || '';

// Types de fichiers autorisés
const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];

// Extensions autorisées
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf'];

// Taille maximale en octets (10 Mo)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Durée de validité des URLs pré-signées (15 minutes)
const PRESIGNED_URL_EXPIRY = 15 * 60;

export interface UploadUrlResult {
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
}

export interface DownloadUrlResult {
  downloadUrl: string;
  expiresIn: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valide le type de fichier (content-type)
 */
export function validateContentType(contentType: string): ValidationResult {
  if (!ALLOWED_CONTENT_TYPES.includes(contentType.toLowerCase())) {
    return {
      valid: false,
      error: `Type de fichier non supporté. Types autorisés: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }
  return { valid: true };
}

/**
 * Valide l'extension du fichier
 */
export function validateFileExtension(fileName: string): ValidationResult {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Extension de fichier non supportée. Extensions autorisées: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }
  return { valid: true };
}

/**
 * Valide la taille du fichier
 */
export function validateFileSize(size: number): ValidationResult {
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Le fichier dépasse la taille maximale de ${MAX_FILE_SIZE / (1024 * 1024)} Mo`,
    };
  }
  if (size <= 0) {
    return {
      valid: false,
      error: 'La taille du fichier doit être supérieure à 0',
    };
  }
  return { valid: true };
}


/**
 * Valide un fichier complet (type, extension, taille)
 */
export function validateFile(
  fileName: string,
  contentType: string,
  size: number
): ValidationResult {
  const extensionResult = validateFileExtension(fileName);
  if (!extensionResult.valid) return extensionResult;

  const contentTypeResult = validateContentType(contentType);
  if (!contentTypeResult.valid) return contentTypeResult;

  const sizeResult = validateFileSize(size);
  if (!sizeResult.valid) return sizeResult;

  return { valid: true };
}

/**
 * Génère le chemin S3 pour un document
 * Structure: clients/{clientId}/orders/{orderId}/{dossierType}/{fileName}
 */
export function generateS3Key(
  clientId: string,
  orderId: string,
  dossierType: string,
  fileName: string
): string {
  // Nettoyer le nom de fichier
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}_${sanitizedFileName}`;

  return `clients/${clientId}/orders/${orderId}/${dossierType}/${uniqueFileName}`;
}

/**
 * Génère une URL pré-signée pour l'upload (PUT)
 */
export async function generateUploadUrl(
  clientId: string,
  orderId: string,
  dossierType: string,
  fileName: string,
  contentType: string,
  size: number
): Promise<UploadUrlResult> {
  // Valider le fichier
  const validation = validateFile(fileName, contentType, size);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const s3Key = generateS3Key(clientId, orderId, dossierType, fileName);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    ContentType: contentType,
    ContentLength: size,
    Metadata: {
      'original-filename': fileName,
      'client-id': clientId,
      'order-id': orderId,
      'dossier-type': dossierType,
    },
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY,
  });

  return {
    uploadUrl,
    s3Key,
    expiresIn: PRESIGNED_URL_EXPIRY,
  };
}

/**
 * Génère une URL pré-signée pour le téléchargement (GET)
 */
export async function generateDownloadUrl(
  s3Key: string
): Promise<DownloadUrlResult> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  const downloadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY,
  });

  return {
    downloadUrl,
    expiresIn: PRESIGNED_URL_EXPIRY,
  };
}

/**
 * Supprime un fichier du bucket S3
 */
export async function deleteFile(s3Key: string): Promise<boolean> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  await s3Client.send(command);
  return true;
}

/**
 * Retourne les constantes de configuration
 */
export const DocumentStorageConfig = {
  ALLOWED_CONTENT_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB: MAX_FILE_SIZE / (1024 * 1024),
  PRESIGNED_URL_EXPIRY,
  BUCKET_NAME,
};
