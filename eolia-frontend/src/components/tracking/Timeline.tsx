import { Check, Clock, AlertCircle, FileText, Send, Settings } from 'lucide-react';
import type { EventType } from '../../types/dossier';

export interface TimelineEvent {
  id: string;
  timestamp: number;
  status?: string;
  label: string;
  description?: string;
  eventType?: EventType;
}

interface TimelineProps {
  events: TimelineEvent[];
  currentStatus?: string;
  className?: string;
}

const eventTypeIcons: Record<EventType, typeof Check> = {
  status_changed: Settings,
  document_added: FileText,
  document_removed: FileText,
  vt_submitted: Check,
  vt_sent_to_be: Send,
  metadata_updated: Settings,
};

const getEventIcon = (event: TimelineEvent, isLatest: boolean) => {
  if (event.eventType && eventTypeIcons[event.eventType]) {
    const Icon = eventTypeIcons[event.eventType];
    return <Icon className="w-4 h-4" />;
  }
  
  if (isLatest) {
    return <Clock className="w-4 h-4" />;
  }
  
  return <Check className="w-4 h-4" />;
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Timeline({ events, className = '' }: TimelineProps) {
  // Sort events by timestamp descending (most recent first)
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  if (sortedEvents.length === 0) {
    return (
      <div className={`flex items-center justify-center py-8 text-gray-500 ${className}`}>
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>Aucun événement pour le moment</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {sortedEvents.map((event, index) => {
          const isLatest = index === 0;
          
          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon circle */}
              <div
                className={`
                  relative z-10 flex items-center justify-center w-8 h-8 rounded-full
                  ${isLatest 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                  }
                `}
              >
                {getEventIcon(event, isLatest)}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className={`font-medium ${isLatest ? 'text-gray-900' : 'text-gray-700'}`}>
                    {event.label}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(event.timestamp)}</span>
                    <span>•</span>
                    <span>{formatTime(event.timestamp)}</span>
                  </div>
                </div>
                
                {event.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
