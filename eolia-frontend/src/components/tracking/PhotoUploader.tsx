import { useState, useRef, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import type { DossierDocument, DossierType } from '../../types/dossier';
import { documentService, validateFile, compressImage, type UploadProgress } from '../../services/documentService';

interface PhotoUploaderProps {
  orderId: string;
  dossierType: DossierType | 'installation_vt' | 'installation_reports';
  maxPhotos: number;
  minPhotos?: number;
  onUploadComplete: (photoIds: string[]) => void;
  existingPhotos?: DossierDocument[];
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'compressing' | 'success' | 'error';
  error?: string;
  documentId?: string;
}

export default function PhotoUploader({
  orderId,
  dossierType,
  maxPhotos,
  minPhotos = 0,
  onUploadComplete,
  existingPhotos = [],
  className = '',
}: PhotoUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const totalPhotos = existingPhotos.length + uploadingFiles.filter(f => f.status === 'success').length;
  const canAddMore = totalPhotos < maxPhotos;
  const hasMinPhotos = totalPhotos >= minPhotos;

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const remainingSlots = maxPhotos - totalPhotos;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    if (filesToProcess.length < files.length) {
      setError(`Vous ne pouvez ajouter que ${remainingSlots} photo(s) supplémentaire(s)`);
    }

    // Create upload entries
    const newFiles: UploadingFile[] = filesToProcess.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const,
    }));

    setUploadingFiles((prev) => [...prev, ...newFiles]);

    // Process each file
    for (const uploadFile of newFiles) {
      await processFile(uploadFile);
    }
  }, [maxPhotos, totalPhotos]);

  const processFile = async (uploadFile: UploadingFile) => {
    // Validate
    const validation = validateFile(uploadFile.file);
    if (!validation.valid) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', error: validation.error }
            : f
        )
      );
      return;
    }

    try {
      // Compress if needed
      let fileToUpload = uploadFile.file;
      if (uploadFile.file.type.startsWith('image/') && uploadFile.file.size > 2 * 1024 * 1024) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: 'compressing' } : f
          )
        );
        fileToUpload = await compressImage(uploadFile.file);
      }

      // Upload
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
        )
      );

      const handleProgress = (progress: UploadProgress) => {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: progress.percentage } : f
          )
        );
      };

      const { documentId } = await documentService.uploadDocument(
        orderId,
        dossierType,
        fileToUpload,
        handleProgress
      );

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'success', progress: 100, documentId }
            : f
        )
      );

      // Notify parent of all successful uploads
      setUploadingFiles((prev) => {
        const successIds = prev
          .filter((f) => f.status === 'success' && f.documentId)
          .map((f) => f.documentId!);
        onUploadComplete(successIds);
        return prev;
      });
    } catch (err) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Erreur' }
            : f
        )
      );
    }
  };

  const handleRemove = (id: string) => {
    setUploadingFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      const updated = prev.filter((f) => f.id !== id);
      
      // Notify parent of remaining successful uploads
      const successIds = updated
        .filter((f) => f.status === 'success' && f.documentId)
        .map((f) => f.documentId!);
      onUploadComplete(successIds);
      
      return updated;
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className={className}>
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Min photos warning */}
      {minPhotos > 0 && !hasMinPhotos && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Minimum {minPhotos} photo(s) requise(s). Actuellement : {totalPhotos}
        </div>
      )}

      {/* Upload zone */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
        >
          <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            Glissez vos photos ici ou
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* File upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Parcourir
            </button>

            {/* Camera capture button (mobile) */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors sm:hidden"
            >
              <Camera className="w-4 h-4" />
              Prendre une photo
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            JPG, PNG ou PDF • Max 10 Mo par fichier • {totalPhotos}/{maxPhotos} photos
          </p>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* Existing photos */}
      {existingPhotos.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Photos existantes</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {existingPhotos.map((doc) => (
              <div
                key={doc.documentId}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                {doc.downloadUrl ? (
                  <img
                    src={doc.downloadUrl}
                    alt={doc.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploading files */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Nouvelles photos</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {uploadingFiles.map((file) => (
              <div
                key={file.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
              >
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />

                {/* Status overlay */}
                {file.status !== 'success' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    {file.status === 'compressing' && (
                      <div className="text-center text-white">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        <span className="text-xs mt-1 block">Compression...</span>
                      </div>
                    )}
                    {file.status === 'uploading' && (
                      <div className="text-center text-white">
                        <div className="w-12 h-12 relative">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              fill="none"
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="4"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              fill="none"
                              stroke="white"
                              strokeWidth="4"
                              strokeDasharray={`${file.progress * 1.26} 126`}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs">
                            {file.progress}%
                          </span>
                        </div>
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="text-center text-white p-2">
                        <AlertCircle className="w-6 h-6 mx-auto text-red-400" />
                        <span className="text-xs mt-1 block line-clamp-2">{file.error}</span>
                      </div>
                    )}
                    {file.status === 'pending' && (
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    )}
                  </div>
                )}

                {/* Success indicator */}
                {file.status === 'success' && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(file.id)}
                  className="absolute top-1 left-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
