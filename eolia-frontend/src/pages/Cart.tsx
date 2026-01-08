import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalKwc, isOverLimit } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-gray-500 mb-8">
            Découvrez notre gamme d'éoliennes Tulipe et commencez votre transition énergétique.
          </p>
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuer mes achats
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Votre panier</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Vider le panier
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.productId}
              className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl"
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/produits/${item.product.productId}`}
                      className="font-semibold text-gray-900 hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.powerKwc && (
                      <p className="text-sm text-primary mt-1">
                        Puissance : {item.product.powerKwc} kWc
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {item.product.category === 'turbine' && 'Éolienne'}
                      {item.product.category === 'inverter' && 'Onduleur'}
                      {item.product.category === 'accessory' && 'Accessoire'}
                      {item.product.category === 'installation' && 'Forfait pose'}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.productId)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {totalKwc > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Puissance totale</span>
                  <span className="text-primary font-medium">{totalKwc} kWc</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>À calculer</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* kWc Warning */}
            {isOverLimit && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Puissance supérieure à 36 kWc
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Pour les installations de plus de 36 kWc, veuillez nous contacter pour un devis personnalisé.
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            {isOverLimit ? (
              <Link
                to="/diagnostic"
                className="block w-full py-3 px-4 bg-amber-600 text-white text-center rounded-full font-medium hover:bg-amber-700 transition-colors"
              >
                Nous consulter
              </Link>
            ) : (
              <Link
                to="/commande"
                className="block w-full py-3 px-4 bg-primary text-white text-center rounded-full font-medium hover:bg-primary-dark transition-colors"
              >
                Passer commande
              </Link>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              Paiement sécurisé par Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
