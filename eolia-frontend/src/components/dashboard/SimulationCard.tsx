import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Trash2, MapPin, Zap, Euro, Calendar } from 'lucide-react';
import type { SavedSimulation } from '../../types/simulation';

interface SimulationCardProps {
  simulation: SavedSimulation;
  onDelete: (simulationId: string) => void;
  isDeleting?: boolean;
  compact?: boolean;
}

export default function SimulationCard({ simulation, onDelete, isDeleting, compact }: SimulationCardProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(value));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleCardClick = () => {
    // Build query params for calculator
    const params = new URLSearchParams({
      dept: simulation.inputs.departmentCode,
      power: simulation.inputs.powerKwc.toString(),
      count: simulation.inputs.turbineCount.toString(),
    });
    
    if (simulation.inputs.anemometerSpeed) {
      params.set('anemoSpeed', simulation.inputs.anemometerSpeed.toString());
    }
    if (simulation.inputs.anemometerMonth) {
      params.set('anemoMonth', simulation.inputs.anemometerMonth.toString());
    }
    
    navigate(`/calculateur?${params.toString()}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(simulation.simulationId);
    setShowConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  // Compact mode for dashboard
  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className="bg-white rounded-lg p-3 hover:bg-gray-50 transition-all cursor-pointer border border-gray-200 hover:border-amber-400 group relative"
      >
        {showConfirm && (
          <div className="absolute inset-0 bg-white/95 rounded-lg flex items-center justify-center z-10 gap-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleConfirmDelete} disabled={isDeleting} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-600 disabled:opacity-50">
              {isDeleting ? '...' : 'Supprimer'}
            </button>
            <button onClick={handleCancelDelete} disabled={isDeleting} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-300">
              Annuler
            </button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Wind className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-semibold text-gray-900 text-sm truncate group-hover:text-amber-700">{simulation.name}</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-emerald-700 font-bold text-sm">{formatNumber(simulation.results.annualProduction)} kWh/an</span>
            <button onClick={handleDeleteClick} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <span>{simulation.inputs.departmentName}</span>
          <span>•</span>
          <span>{simulation.inputs.powerKwc} kWc</span>
          <span>•</span>
          <span>{formatDate(simulation.createdAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-emerald-300 group relative"
    >
      {/* Delete confirmation overlay */}
      {showConfirm && (
        <div 
          className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center z-10 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-gray-700 text-center mb-4 font-medium">
            Supprimer cette simulation ?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={isDeleting}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Wind className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {simulation.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {formatDate(simulation.createdAt)}
            </div>
          </div>
        </div>
        <button
          onClick={handleDeleteClick}
          className="text-gray-400 hover:text-red-500 p-1 transition-colors opacity-0 group-hover:opacity-100"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{simulation.inputs.departmentName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>{simulation.inputs.powerKwc} kWc</span>
        </div>
      </div>

      {/* Results */}
      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-gray-500">Production/an</p>
          <p className="font-bold text-emerald-700">{formatNumber(simulation.results.annualProduction)} kWh</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Économies/an</p>
          <p className="font-bold text-emerald-700 flex items-center gap-1">
            <Euro className="w-3.5 h-3.5" />
            {formatCurrency(simulation.results.annualSavings)}
          </p>
        </div>
      </div>
    </div>
  );
}
