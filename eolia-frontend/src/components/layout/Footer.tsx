import { Link } from 'react-router-dom'
import { Wind, Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Wind className="h-8 w-8 text-primary-light" />
              <span className="text-2xl font-bold text-white">EOLIA</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Éoliennes verticales Tulipe pour particuliers et professionnels. 
              Une énergie propre et silencieuse.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/calculateur" className="text-gray-400 hover:text-white text-sm">
                  Calculateur
                </Link>
              </li>
              <li>
                <Link to="/produits" className="text-gray-400 hover:text-white text-sm">
                  Gamme Tulipe
                </Link>
              </li>
              <li>
                <Link to="/diagnostic" className="text-gray-400 hover:text-white text-sm">
                  Diagnostic
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Informations légales
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cgv" className="text-gray-400 hover:text-white text-sm">
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-gray-400 hover:text-white text-sm">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-cookies" className="text-gray-400 hover:text-white text-sm">
                  Politique de cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@eolia.fr" className="hover:text-white">
                  contact@eolia.fr
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <a href="tel:+33100000000" className="hover:text-white">
                  01 00 00 00 00
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>France</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EOLIA SAS. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
