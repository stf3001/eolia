import { useState, useMemo } from 'react';
import { Wind, Zap, Package, Wrench, Filter, Search } from 'lucide-react';
import ProductCard from '../components/shop/ProductCard';
import InstallationInfoBanner from '../components/shop/InstallationInfoBanner';
import productsData from '../data/products.json';
import type { Product, CategoryFilter } from '../types/product';

const categories: { id: CategoryFilter; label: string; icon: typeof Wind }[] = [
  { id: 'all', label: 'Tous les produits', icon: Filter },
  { id: 'turbine', label: 'Éoliennes Tulipe', icon: Wind },
  { id: 'inverter', label: 'Onduleurs', icon: Zap },
  { id: 'accessory', label: 'Accessoires', icon: Package },
  { id: 'installation', label: 'Forfaits Pose', icon: Wrench },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const products = productsData.products as unknown as Product[];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;

      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart context integration
    console.log('Add to cart:', product.name);
    alert(`${product.name} ajouté au panier !`);
  };

  const getCategoryCount = (categoryId: CategoryFilter) => {
    if (categoryId === 'all') return products.length;
    return products.filter((p) => p.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-600 text-white py-4 lg:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Notre Catalogue
            </h1>
            <p className="text-base text-emerald-100 max-w-2xl mx-auto">
              Découvrez notre gamme complète d'éoliennes verticales Tulipe,
              onduleurs partenaires et accessoires pour votre installation.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              const count = getCategoryCount(category.id);

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
                      isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} produit
            {filteredProducts.length > 1 ? 's' : ''} trouvé
            {filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Installation Info Banner - Affichage conditionnel */}
        {activeCategory === 'installation' && <InstallationInfoBanner />}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-4 ${
            activeCategory === 'installation' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-emerald-50 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Wind className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Besoin d'aide pour choisir ?
              </h3>
              <p className="text-gray-600 mb-4">
                Notre équipe est disponible pour vous conseiller sur le choix de
                votre éolienne et dimensionner votre installation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a
                  href="/calculateur"
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
                >
                  Calculer ma production
                </a>
                <a
                  href="/diagnostic"
                  className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-full font-medium hover:bg-emerald-50 transition-colors"
                >
                  Faire un diagnostic
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
