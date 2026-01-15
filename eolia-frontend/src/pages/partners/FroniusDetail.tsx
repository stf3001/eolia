import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  Award,
  Globe,
  Shield,
  CheckCircle,
  Wind,
  Calculator,
  MessageCircle,
  ExternalLink,
  Clock,
  Wrench,
  TrendingUp,
} from 'lucide-react';

/**
 * Page détaillée du partenaire Fronius
 * Présente l'entreprise, ses avantages pour l'éolien, la gamme et les garanties
 * Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 8.1, 8.2, 8.3, 8.4, 8.5
 */
export default function FroniusDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Gradient rouge/orange Fronius */}
      <section className="relative bg-gradient-to-br from-sky-600 to-sky-500 text-white py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Bouton retour */}
          <Link
            to="/partenaires"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux partenaires
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Onduleurs de référence mondiale
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Fronius</h1>
              <p className="text-xl text-sky-100 mb-6">
                La robustesse autrichienne depuis 1945
              </p>
              <p className="text-sky-100 leading-relaxed">
                Leader mondial des onduleurs photovoltaïques et éoliens, Fronius 
                est synonyme de fiabilité, d'innovation et de performance. Avec plus 
                de 75 ans d'expertise et plus de 3 millions d'onduleurs installés 
                dans le monde, Fronius est le choix de confiance pour votre installation éolienne.
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">75+</p>
                <p className="text-sky-100 text-sm">Années d'expertise</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">3M+</p>
                <p className="text-sky-100 text-sm">Onduleurs installés</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">60+</p>
                <p className="text-sky-100 text-sm">Pays de présence</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">6000+</p>
                <p className="text-sky-100 text-sm">Employés</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section Présentation */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Une entreprise familiale devenue leader mondial
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fondée en <span className="font-semibold text-gray-900">1945 à Pettenbach en Autriche</span>, 
                  Fronius est une entreprise familiale qui a su se hisser au rang de leader mondial 
                  dans le domaine des onduleurs et de la technologie de soudage.
                </p>
                <p>
                  Avec plus de <span className="font-semibold text-gray-900">6 000 employés</span> répartis 
                  dans plus de <span className="font-semibold text-gray-900">60 pays</span>, Fronius 
                  continue d'innover et de repousser les limites de la technologie énergétique.
                </p>
                <p>
                  Leur philosophie : concevoir des produits qui durent, avec une qualité de fabrication 
                  irréprochable et un service après-vente exemplaire.
                </p>
              </div>
            </div>

            {/* Caractéristiques clés */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Leader mondial</h3>
                <p className="text-sm text-gray-600">
                  N°1 des onduleurs en Europe
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Présence mondiale</h3>
                <p className="text-sm text-gray-600">
                  60+ pays, 30 filiales
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Innovation</h3>
                <p className="text-sm text-gray-600">
                  10% du CA en R&D
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Qualité</h3>
                <p className="text-sm text-gray-600">
                  Made in Austria
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Pourquoi Fronius pour l'éolien */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Fronius pour l'éolien ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Les onduleurs Fronius sont particulièrement adaptés aux installations éoliennes 
              grâce à leur gestion exceptionnelle des variations de puissance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">MPPT Avancé</h3>
              <p className="text-sm text-gray-600">
                Algorithme de suivi du point de puissance maximale optimisé pour 
                les variations rapides du vent.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Robustesse éprouvée</h3>
              <p className="text-sm text-gray-600">
                Conçu pour fonctionner 20+ ans, même dans des conditions 
                de charge variables et exigeantes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rendement 98.1%</h3>
              <p className="text-sm text-gray-600">
                Parmi les meilleurs rendements du marché pour maximiser 
                votre production éolienne.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Plage de tension large</h3>
              <p className="text-sm text-gray-600">
                Plage de tension d'entrée étendue, parfaitement adaptée 
                aux variations de l'éolien.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Section Gamme recommandée */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gamme recommandée pour l'éolien
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              EOLIA a sélectionné les modèles Fronius les plus adaptés 
              aux installations éoliennes domestiques et professionnelles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Fronius Primo */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-4">
                Monophasé
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fronius Primo</h3>
              <p className="text-sky-600 font-semibold mb-4">3 - 8.2 kW</p>
              <p className="text-gray-600 text-sm mb-4">
                Idéal pour les installations résidentielles. Compact, silencieux 
                et facile à installer.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  Rendement jusqu'à 98.1%
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  2 trackers MPPT
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  WiFi & Ethernet intégrés
                </li>
              </ul>
            </div>

            {/* Fronius Symo */}
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-sky-400 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-sky-600 text-white rounded-full text-sm font-medium">
                Recommandé
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-4 mt-2">
                Triphasé
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fronius Symo</h3>
              <p className="text-sky-600 font-semibold mb-4">3 - 20 kW</p>
              <p className="text-gray-600 text-sm mb-4">
                Le choix optimal pour les éoliennes Tulipe. Puissance et 
                polyvalence pour toutes les configurations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  Rendement jusqu'à 98%
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  2 trackers MPPT indépendants
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  Compatible stockage
                </li>
              </ul>
            </div>

            {/* Fronius GEN24 Plus */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
                Hybride
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fronius GEN24 Plus</h3>
              <p className="text-sky-600 font-semibold mb-4">3 - 12 kW</p>
              <p className="text-gray-600 text-sm mb-4">
                Solution tout-en-un avec gestion de batterie intégrée. 
                Parfait pour l'autoconsommation maximale.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  Stockage batterie intégré
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  Backup en cas de coupure
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  Dernière génération
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Section Garanties & SAV */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Garanties & Service Après-Vente
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Fronius s'engage sur la durée avec des garanties étendues et un 
                service après-vente de qualité. Votre tranquillité d'esprit est 
                notre priorité.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Garantie 5 ans, extensible à 10 ans
                    </h3>
                    <p className="text-sm text-gray-600">
                      Garantie fabricant standard de 5 ans, extensible jusqu'à 10 ans 
                      pour une protection maximale de votre investissement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Réseau de techniciens certifiés
                    </h3>
                    <p className="text-sm text-gray-600">
                      Un réseau de techniciens formés et certifiés Fronius 
                      partout en France pour une intervention rapide.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Monitoring Solar.web gratuit
                    </h3>
                    <p className="text-sm text-gray-600">
                      Plateforme de monitoring en ligne gratuite pour suivre 
                      votre production en temps réel depuis n'importe où.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Pièces détachées 15 ans
                    </h3>
                    <p className="text-sm text-gray-600">
                      Disponibilité garantie des pièces détachées pendant 
                      15 ans après l'achat de votre onduleur.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Certifications & Normes
              </h3>
              <p className="text-gray-600 mb-6">
                Les onduleurs Fronius sont certifiés selon les normes les plus 
                strictes, garantissant qualité et sécurité.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="font-bold text-gray-900 text-lg">VDE</p>
                  <p className="text-xs text-gray-500">Certification allemande</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="font-bold text-gray-900 text-lg">TÜV</p>
                  <p className="text-xs text-gray-500">Sécurité technique</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="font-bold text-gray-900 text-lg">CE</p>
                  <p className="text-xs text-gray-500">Conformité européenne</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="font-bold text-gray-900 text-lg">NF C 15-100</p>
                  <p className="text-xs text-gray-500">Norme française</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <a
                  href="https://www.fronius.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visiter le site officiel Fronius
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section CTA */}
      <section className="py-12 lg:py-16 bg-sky-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Intéressé par un onduleur Fronius ?
          </h2>
          <p className="text-lg text-sky-100 mb-8 max-w-2xl mx-auto">
            Nos experts vous accompagnent dans le choix de l'onduleur adapté 
            à votre installation éolienne et à vos besoins énergétiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculateur"
              className="inline-flex items-center justify-center gap-2 bg-white text-sky-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Calculer ma production
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
