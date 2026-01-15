import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Wind, User, ShoppingCart, ChevronDown } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import CartSidebar from '../shop/CartSidebar'

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/calculateur', label: 'Calculateur' },
  { to: '/produits', label: 'Gamme Tulipe' },
  { to: '/faq', label: 'FAQ' },
  { to: '/partenaires', label: 'Nos Partenaires' },
  { to: '/ambassadeur', label: 'Ambassadeur' },
  { to: '/espace-client', label: 'Espace Client' },
]

const aboutLinks = [
  { to: '/a-propos/qui-sommes-nous', label: 'Qui sommes-nous' },
  { to: '/a-propos/vision', label: 'Notre vision' },
  { to: '/a-propos/pourquoi-eolia', label: 'Pourquoi Eolia' },
  { to: '/a-propos/contact', label: 'Nous contacter' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const location = useLocation()
  const { totalItems } = useCart()

  const isActive = (path: string) => location.pathname === path
  const isAboutActive = () => location.pathname.startsWith('/a-propos')

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Wind className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EOLIA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* À propos Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isAboutActive()
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              >
                À propos
                <ChevronDown className={`h-4 w-4 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    {aboutLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setAboutDropdownOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive(link.to)
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Ouvrir le panier"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <Link
              to="/connexion"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-600 text-sm font-medium hover:bg-sky-700 transition-colors"
              style={{ color: 'white' }}
            >
              <User className="h-4 w-4" />
              Connexion
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Ouvrir le panier"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* À propos Mobile Section */}
              <div>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isAboutActive()
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  À propos
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileAboutOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {aboutLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setMobileAboutOpen(false)
                        }}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActive(link.to)
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link
                to="/connexion"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-sky-600 text-white text-sm font-medium"
              >
                <User className="h-4 w-4" />
                Connexion
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
