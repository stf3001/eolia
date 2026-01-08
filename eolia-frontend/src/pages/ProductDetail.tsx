import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Wind,
  Zap,
  Package,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import productsData from '../data/products.json';
import type { Product } from '../types/product';

const categoryIcons = {
  turbine: Wind,
  inverter: Zap,
  accessory: Package,
  installation: Package,
};

const categoryLabels = {
  turbine: 'Éolienne',
  inverter: 'Onduleur',
  accessory: 'Accessoire',
  installation: 'Installation',
};

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const products = productsData.products as unknown as Product[];
  const product = useMemo(
    () => products.find((p) => p.productId === productId),
    [products, productId]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Produit non trouvé
          </h2>
          <p className="text-gray-500 mb-6">
            Le produit que vous recherchez n'existe pas ou a été retiré.
          </p>
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.imageUrl];
  const Icon = categoryIcons[product.category];
  const categoryLabel = categoryLabels[product.category];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock)));
  };

  const handleAddToCart = () => {
    // TODO: Implement cart context integration
    console.log('Add to cart:', product.name, 'x', quantity);
    alert(`${quantity}x ${product.name} ajouté au panier !`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter(
      (p) => p.category === product.category && p.productId !== product.productId
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-emerald-600">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <Link to="/produits" className="text-gray-500 hover:text-emerald-600">
              Catalogue
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-product.jpg';
                }}
              />
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              {/* Category badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700">
                <Icon className="w-4 h-4 text-emerald-600" />
                {categoryLabel}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-emerald-600 ring-2 ring-emerald-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-product.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.powerKwc && (
                <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {product.powerKwc} kWc
                </span>
              )}
              <div className="flex items-baseline gap-3">
                {product.price > 0 ? (
                  <span className="text-3xl font-bold text-emerald-600">
                    {formatPrice(product.price)}
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-emerald-600">
                    Gratuit*
                  </span>
                )}
                {product.warranty && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    Garantie {product.warranty}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Includes (for installation packages) */}
            {product.includes && product.includes.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Ce forfait inclut :
                </h3>
                <ul className="space-y-2">
                  {product.includes.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Caractéristiques techniques
              </h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], index) => (
                      <tr
                        key={key}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-4 py-3 text-gray-600 font-medium">
                          {key}
                        </td>
                        <td className="px-4 py-3 text-gray-900 text-right">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              {/* Stock info */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Disponibilité</span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    En stock ({product.stock} disponibles)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-600 font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Rupture de stock
                  </span>
                )}
              </div>

              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Quantité</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              {product.price > 0 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              )}

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-full font-semibold text-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </button>

              {/* Note for anemometer */}
              {product.subcategory === 'anemometre' && (
                <p className="text-sm text-gray-500 text-center">
                  * Prêt gratuit avec caution de 100€ remboursée au retour
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.productId}
                  to={`/produits/${relatedProduct.productId}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <span className="text-lg font-bold text-emerald-600">
                      {relatedProduct.price > 0
                        ? formatPrice(relatedProduct.price)
                        : 'Gratuit*'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
