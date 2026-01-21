/**
 * AdminDocumentUpload - Upload de documents avec drag & drop pour admin
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, AlertCircle, CheckCircle, FileText, Image } from 'lucide-react';
import type { DossierType } from '../../types/dossier';

// Types de fichiers acceptés
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = '.pdf,.jpg,.jpeg,.png,.webp';
// Taille max: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const ADMIN_TOKEN_KEY = 'admin_token';

interface AdminDocumentUploadProps {
  orderId: string;
  dossierId: string;
  dossierType: DossierType;
  onUploaded?: () => void;
}

interface UploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function AdminDocumentUpload({
  orderId,
  dossierId,
  dossierType,
  onUploaded,
}: AdminDocumentUploadProps) {
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Valider un fichier
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Format non supporté. Formats acceptés: PDF, JPG, PNG, WEBP',
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Fichier trop volumineux (max ${MAX_FILE_SIZE / (1024 * 1024)} Mo)`,
      };
    }

    return { valid: true };
  };

  // Upload un fichier
  const uploadFile = async (file: File, index: number) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    try {
      // Mettre à jour le statut
      setUploads((prev) =>
        prev.map((u, i) => (i === index ? { ...u, status: 'uploading' as const } : u))
      );

      // 1. Obtenir l'URL pré-signée
      const urlResponse = await fetch(`${API_URL}/orders/${orderId}/documents/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          dossierType,
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!urlResponse.ok) {
        const error = await urlResponse.json();
        throw new Error(error.message || 'Erreur lors de la génération de l\'URL');
      }

      const { uploadUrl, documentId } = await urlResponse.json();

      // 2. Upload vers S3 avec suivi de progression
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploads((prev) =>
              prev.map((u, i) => (i === index ? { ...u, progress } : u))
            );
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

      // 3. Confirmer l'upload (ajouter le document au dossier)
      const addResponse = await fetch(`${API_URL}/orders/${orderId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          documentId,
          dossierId,
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!addResponse.ok) {
        const error = await addResponse.json();
        throw new Error(error.message || 'Erreur lors de l\'enregistrement');
      }

      // Succès
      setUploads((prev) =>
        prev.map((u, i) =>
          i === index ? { ...u, status: 'success' as const, progress: 100 } : u
        )
      );

      onUploaded?.();
    } catch (err) {
      setUploads((prev) =>
        prev.map((u, i) =>
          i === index
            ? {
                ...u,
                status: 'error' as const,
                error: err instanceof Error ? err.message : 'Erreur inconnue',
              }
            : u
        )
      );
    }
  };

  // Traiter les fichiers sélectionnés
  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploads: UploadState[] = [];

    fileArray.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        newUploads.push({
          file,
          progress: 0,
          status: 'pending',
        });
      } else {
        newUploads.push({
          file,
          progress: 0,
          status: 'error',
          error: validation.error,
        });
      }
    });

    setUploads((prev) => [...prev, ...newUploads]);

    // Démarrer les uploads valides
    const startIndex = uploads.length;
    newUploads.forEach((upload, i) => {
      if (upload.status === 'pending') {
        uploadFile(upload.file, startIndex + i);
      }
    });
  }, [uploads.length, orderId, dossierId, dossierType]);

  // Gestionnaires drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Gestionnaire input file
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      // Reset input pour permettre de re-sélectionner le même fichier
      e.target.value = '';
    }
  };

  // Supprimer un upload de la liste
  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  // Icône selon le type de fichier
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragging ? 'text-emerald-500' : 'text-gray-400'}`} />
        <p className="text-sm text-gray-600">
          <span className="font-medium text-emerald-600">Cliquez pour sélectionner</span>
          {' '}ou glissez-déposez vos fichiers
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PDF, JPG, PNG, WEBP • Max 10 Mo par fichier
        </p>
      </div>

      {/* Liste des uploads */}
      {uploads.length > 0 && (
        <ul className="space-y-2">
          {uploads.map((upload, index) => (
            <li
              key={`${upload.file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {/* Icône fichier */}
              {getFileIcon(upload.file)}

              {/* Infos fichier */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {upload.file.name}
                </p>
                <div className="flex items-center gap-2">
                  {upload.status === 'uploading' && (
                    <>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{upload.progress}%</span>
                    </>
                  )}
                  {upload.status === 'success' && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Uploadé
                    </span>
                  )}
                  {upload.status === 'error' && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {upload.error}
                    </span>
                  )}
                  {upload.status === 'pending' && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      En attente...
                    </span>
                  )}
                </div>
              </div>

              {/* Bouton supprimer */}
              {(upload.status === 'success' || upload.status === 'error') && (
                <button
                  onClick={() => removeUpload(index)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
