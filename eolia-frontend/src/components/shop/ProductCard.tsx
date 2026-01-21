import { useState } from 'react';
import { ShoppingCart, Wind, Zap, Package, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const categoryIcons = {
  turbine: Wind,
  inverter: Zap,
  accessory: Package,
  installation: Package,
  administrative: FileText,
};

const categoryLabels = {
  turbine: 'Éolienne',
  inverter: 'Onduleur',
  accessory: 'Accessoire',
  installation: 'Installation',
  administrative: 'Administratif',
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const Icon = categoryIcons[product.category];
  const categoryLabel = categoryLabels[product.category];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get main specs to display (max 3)
  const mainSpecs = Object.entries(product.specs).slice(0, 3);

  return (
    <Link
      to={`/produits/${product.productId}`}
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Icon className="w-16 h-16 text-primary/40 mb-2" />
            <span className="text-sm text-gray-400">{product.name}</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
          <Icon className="w-3.5 h-3.5 text-primary" />
          {categoryLabel}
        </div>
        {/* Power badge for turbines */}
        {product.powerKwc && (
          <div className="absolute top-3 right-3 bg-primary text-white px-2.5 py-1 rounded-full text-xs font-bold">
            {product.powerKwc} kWc
          </div>
        )}
        {/* Warranty badge */}
        {product.warranty && (
          <div className="absolute bottom-3 left-3 bg-gray-900/80 text-white px-2 py-0.5 rounded text-xs">
            Garantie {product.warranty}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Specs preview */}
        <div className="space-y-1 mb-4 flex-grow">
          {mainSpecs.map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-gray-500">{key}</span>
              <span className="text-gray-700 font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            {product.price > 0 ? (
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            ) : (
              <span className="text-lg font-semibold text-primary">
                Gratuit*
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
