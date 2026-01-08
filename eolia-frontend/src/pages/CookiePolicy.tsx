import { Link } from 'react-router-dom'

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Politique de Cookies
      </h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-gray-500 mb-8">
          Dernière mise à jour : Janvier 2026
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Qu'est-ce qu'un cookie ?</h2>
          <p className="text-gray-600 mb-4">
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, 
            smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des 
            informations sur votre visite, comme vos préférences de langue ou vos identifiants 
            de connexion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Les cookies que nous utilisons</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Cookies strictement nécessaires</h3>
          <p className="text-gray-600 mb-4">
            Ces cookies sont indispensables au fonctionnement du site. Ils permettent notamment :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
            <li>La gestion de votre session et de votre authentification</li>
            <li>La mémorisation de votre panier d'achat</li>
            <li>La sécurisation des transactions</li>
          </ul>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Nom</th>
                  <th className="pb-2">Finalité</th>
                  <th className="pb-2">Durée</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-1">eolia_session</td>
                  <td>Session utilisateur</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td className="py-1">eolia_cart</td>
                  <td>Panier d'achat</td>
                  <td>30 jours</td>
                </tr>
                <tr>
                  <td className="py-1">eolia_consent</td>
                  <td>Choix cookies</td>
                  <td>12 mois</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Cookies analytiques</h3>
          <p className="text-gray-600 mb-4">
            Ces cookies nous permettent de mesurer l'audience du site et d'analyser la navigation 
            pour améliorer nos services. Ils sont déposés uniquement avec votre consentement.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Nom</th>
                  <th className="pb-2">Finalité</th>
                  <th className="pb-2">Durée</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-1">_ga</td>
                  <td>Google Analytics</td>
                  <td>13 mois</td>
                </tr>
                <tr>
                  <td className="py-1">_gid</td>
                  <td>Google Analytics</td>
                  <td>24 heures</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Cookies marketing</h3>
          <p className="text-gray-600 mb-4">
            Ces cookies permettent d'afficher des publicités personnalisées. Ils sont déposés 
            uniquement avec votre consentement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gérer vos préférences</h2>
          <p className="text-gray-600 mb-4">
            Vous pouvez à tout moment modifier vos choix concernant les cookies :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>En cliquant sur le lien "Gérer les cookies" en bas de page</li>
            <li>En configurant les paramètres de votre navigateur</li>
            <li>En utilisant des outils de gestion des cookies tiers</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Note : le refus de certains cookies peut affecter votre expérience de navigation 
            et limiter l'accès à certaines fonctionnalités du site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vos droits</h2>
          <p className="text-gray-600 mb-4">
            Conformément au RGPD, vous disposez des droits suivants concernant vos données :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Pour exercer ces droits, contactez-nous à : dpo@eolia.fr
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
          <p className="text-gray-600">
            Pour toute question relative à cette politique de cookies, vous pouvez nous contacter :<br />
            Email : dpo@eolia.fr<br />
            Adresse : [ADRESSE_EOLIA]
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
