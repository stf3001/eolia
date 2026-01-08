import { X, Minus, Plus, ShoppingBag, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalKwc, isOverLimit } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Votre panier
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Votre panier est vide</p>
              <Link
                to="/produits"
                onClick={onClose}
                className="inline-block mt-4 text-primary hover:underline"
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.product.productId}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.product.price)}
                    </p>
                    {item.product.powerKwc && (
                      <p className="text-xs text-primary">
                        {item.product.powerKwc} kWc
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.productId)}
                        className="ml-auto text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* kWc warning */}
            {isOverLimit && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Puissance totale : {totalKwc} kWc
                  </p>
                  <p className="text-sm text-amber-700">
                    Au-delà de 36 kWc, veuillez nous consulter pour un devis personnalisé.
                  </p>
                  <Link
                    to="/diagnostic"
                    onClick={onClose}
                    className="text-sm text-primary hover:underline mt-1 inline-block"
                  >
                    Nous consulter →
                  </Link>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Sous-total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {totalKwc > 0 && !isOverLimit && (
              <p className="text-sm text-gray-500">
                Puissance totale : {totalKwc} kWc
              </p>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {isOverLimit ? (
                <Link
                  to="/diagnostic"
                  onClick={onClose}
                  className="block w-full py-3 px-4 bg-amber-600 text-white text-center rounded-full font-medium hover:bg-amber-700 transition-colors"
                >
                  Nous consulter
                </Link>
              ) : (
                <Link
                  to="/commande"
                  onClick={onClose}
                  className="block w-full py-3 px-4 bg-primary text-white text-center rounded-full font-medium hover:bg-primary-dark transition-colors"
                >
                  Commander
                </Link>
              )}
              <Link
                to="/panier"
                onClick={onClose}
                className="block w-full py-3 px-4 border border-gray-300 text-gray-700 text-center rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Voir le panier
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
