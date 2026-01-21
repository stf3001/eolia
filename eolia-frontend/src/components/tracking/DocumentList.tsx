import { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  Eye,
  AlertCircle,
  Loader2 
} from 'lucide-react';
import type { DossierDocument } from '../../types/dossier';
import { documentService } from '../../services/documentService';

interface DocumentListProps {
  documents: DossierDocument[];
  orderId: string;
  onDelete?: (documentId: string) => void;
  allowDelete?: boolean;
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const isImageFile = (contentType: string): boolean => {
  return contentType.startsWith('image/');
};

const getFileIcon = (contentType: string) => {
  if (isImageFile(contentType)) {
    return ImageIcon;
  }
  return FileText;
};

export default function DocumentList({ 
  documents, 
  orderId,
  onDelete,
  allowDelete = false,
  className = '' 
}: DocumentListProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = (doc: DossierDocument) => {
    if (doc.downloadUrl && isImageFile(doc.contentType)) {
      setPreviewUrl(doc.downloadUrl);
    }
  };

  const handleDownload = (doc: DossierDocument) => {
    documentService.downloadDocument(doc);
  };

  const handleDelete = async (documentId: string) => {
    if (!onDelete) return;
    
    setDeletingId(documentId);
    setError(null);
    
    try {
      await documentService.deleteDocument(orderId, documentId);
      onDelete(documentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className={`flex items-center justify-center py-8 text-gray-500 ${className}`}>
        <FileText className="w-5 h-5 mr-2" />
        <span>Aucun document</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {documents.map((doc) => {
          const FileIcon = getFileIcon(doc.contentType);
          const isDeleting = deletingId === doc.documentId;
          const canPreview = isImageFile(doc.contentType) && doc.downloadUrl;

          return (
            <li 
              key={doc.documentId} 
              className="py-3 flex items-center gap-3 group"
            >
              {/* Thumbnail or icon */}
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {canPreview ? (
                  <img 
                    src={doc.downloadUrl} 
                    alt={doc.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileIcon className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {canPreview && (
                  <button
                    onClick={() => handlePreview(doc)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Aperçu"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                
                {doc.downloadUrl && (
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}

                {allowDelete && onDelete && (
                  <button
                    onClick={() => handleDelete(doc.documentId)}
                    disabled={isDeleting}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Supprimer"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Image preview modal */}
      {previewUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={previewUrl} 
              alt="Aperçu"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
