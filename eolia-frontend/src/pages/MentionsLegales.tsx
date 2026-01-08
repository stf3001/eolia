import { Link } from 'react-router-dom'

export default function MentionsLegales() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mentions Légales
      </h1>
      
      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Éditeur du site</h2>
          <p className="text-gray-600 mb-2">
            <strong>EOLIA SAS</strong><br />
            Société par Actions Simplifiée au capital de [CAPITAL] €<br />
            RCS [VILLE] [NUMERO_RCS]<br />
            SIRET : [NUMERO_SIRET]<br />
            N° TVA intracommunautaire : FR [NUMERO_TVA]
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Siège social :</strong><br />
            [ADRESSE]<br />
            [CODE_POSTAL] [VILLE]<br />
            France
          </p>
          <p className="text-gray-600">
            <strong>Contact :</strong><br />
            Téléphone : [TELEPHONE]<br />
            Email : contact@eolia.fr
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Directeur de la publication</h2>
          <p className="text-gray-600">
            [NOM_DIRECTEUR], en qualité de [FONCTION]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hébergement</h2>
          <p className="text-gray-600">
            Le site eolia.fr est hébergé par :<br />
            Amazon Web Services (AWS)<br />
            38 Avenue John F. Kennedy<br />
            L-1855 Luxembourg
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Propriété intellectuelle</h2>
          <p className="text-gray-600 mb-4">
            L'ensemble du contenu du site eolia.fr (textes, images, vidéos, logos, marques, etc.) 
            est protégé par le droit de la propriété intellectuelle. Toute reproduction, 
            représentation, modification ou exploitation non autorisée est interdite.
          </p>
          <p className="text-gray-600">
            La marque EOLIA et le logo Tulipe sont des marques déposées. Leur utilisation sans 
            autorisation préalable est prohibée.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Données personnelles</h2>
          <p className="text-gray-600 mb-4">
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
            Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, 
            d'effacement et de portabilité de vos données personnelles.
          </p>
          <p className="text-gray-600 mb-4">
            Pour exercer ces droits, contactez notre Délégué à la Protection des Données :<br />
            Email : dpo@eolia.fr
          </p>
          <p className="text-gray-600">
            Pour plus d'informations, consultez notre{' '}
            <Link to="/politique-cookies" className="text-primary hover:underline">
              Politique de cookies
            </Link>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies</h2>
          <p className="text-gray-600">
            Le site utilise des cookies pour améliorer l'expérience utilisateur et réaliser 
            des statistiques de visite. Vous pouvez gérer vos préférences à tout moment via 
            le bandeau cookies ou les paramètres de votre navigateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Crédits</h2>
          <p className="text-gray-600">
            Conception et développement : EOLIA SAS<br />
            Icônes : Lucide Icons<br />
            Photos : [CREDITS_PHOTOS]
          </p>
        </section>

        <div className="mt-12 pt-8 border-t">
          <Link to="/" className="text-primary hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
