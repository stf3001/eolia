/**
 * AdminNotes - Gestion des notes administrateur
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import { useState } from 'react';
import { MessageSquare, Send, Loader2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { AdminNote } from '../../services/adminService';

interface AdminNotesProps {
  orderId: string;
  notes: AdminNote[];
  dossierId?: string;
  onNoteAdded?: (note: AdminNote) => void;
}

export default function AdminNotes({
  orderId,
  notes,
  dossierId,
  onNoteAdded,
}: AdminNotesProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtrer les notes par dossierId si spécifié
  const filteredNotes = dossierId
    ? notes.filter((note) => note.dossierId === dossierId)
    : notes.filter((note) => !note.dossierId);

  // Trier par date décroissante
  const sortedNotes = [...filteredNotes].sort((a, b) => b.createdAt - a.createdAt);

  // Soumettre une note
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const note = await adminService.addNote(orderId, content.trim(), dossierId);
      setContent('');
      onNoteAdded?.(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de la note');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formater la date
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-emerald-600" />
        Notes internes
        {sortedNotes.length > 0 && (
          <span className="text-sm font-normal text-gray-500">
            ({sortedNotes.length})
          </span>
        )}
      </h3>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ajouter une note..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            disabled={isSubmitting}
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Ajouter la note
              </>
            )}
          </button>
        </div>
      </form>

      {/* Liste des notes */}
      {sortedNotes.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Aucune note pour le moment
        </p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedNotes.map((note) => (
            <div
              key={note.noteId}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {note.content}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDate(note.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
