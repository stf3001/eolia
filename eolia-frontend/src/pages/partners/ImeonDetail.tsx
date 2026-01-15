import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Cpu,
  Award,
  MapPin,
  Shield,
  CheckCircle,
  Brain,
  Calculator,
  MessageCircle,
  ExternalLink,
  Smartphone,
  TrendingUp,
  Battery,
  Zap,
  Factory,
} from 'lucide-react';

/**
 * Page détaillée du partenaire IMEON
 * Présente l'entreprise bretonne, son IA intégrée, les avantages pour l'éolien et les garanties
 * Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 8.1, 8.2, 8.3, 8.4, 8.5
 */
export default function ImeonDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Gradient bleu/vert IMEON */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-500 text-white py-16 lg:py-20 overflow-hidden">
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
                <Cpu className="w-4 h-4" />
                Onduleurs hybrides intelligents
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">IMEON</h1>
              <p className="text-xl text-emerald-100 mb-6">
                L'intelligence artificielle bretonne
              </p>
              <p className="text-emerald-100 leading-relaxed">
                Pionnier de l'onduleur hybride intelligent, IMEON conçoit et fabrique 
                en Bretagne des onduleurs dotés d'une intelligence artificielle unique. 
                Fondée en 2013 et cotée en bourse, IMEON révolutionne la gestion 
                énergétique domestique grâce à des algorithmes d'apprentissage avancés.
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">2013</p>
                <p className="text-emerald-100 text-sm">Fondation en Bretagne</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">IA</p>
                <p className="text-emerald-100 text-sm">Intelligence intégrée</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">20</p>
                <p className="text-emerald-100 text-sm">Ans de garantie max</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">100%</p>
                <p className="text-emerald-100 text-sm">Made in France</p>
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
                Une entreprise française innovante
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fondée en <span className="font-semibold text-gray-900">2013 à Brest, en Bretagne</span>, 
                  IMEON est une entreprise française pionnière dans le domaine des onduleurs 
                  hybrides intelligents. Cotée sur <span className="font-semibold text-gray-900">Euronext Growth</span>, 
                  elle incarne l'excellence technologique française.
                </p>
                <p>
                  IMEON a été la première entreprise à intégrer une véritable 
                  <span className="font-semibold text-gray-900"> intelligence artificielle</span> dans 
                  ses onduleurs, permettant une gestion énergétique optimisée et autonome.
                </p>
                <p>
                  Avec une conception et un assemblage <span className="font-semibold text-gray-900">100% français</span>, 
                  IMEON garantit qualité, proximité et réactivité pour tous ses clients.
                </p>
              </div>
            </div>

            {/* Caractéristiques clés */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Made in Bretagne</h3>
                <p className="text-sm text-gray-600">
                  Conçu et assemblé à Brest
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Coté en bourse</h3>
                <p className="text-sm text-gray-600">
                  Euronext Growth Paris
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">IA propriétaire</h3>
                <p className="text-sm text-gray-600">
                  Algorithme d'apprentissage unique
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Pionnier</h3>
                <p className="text-sm text-gray-600">
                  1er onduleur hybride IA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Intelligence Artificielle */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              L'Intelligence Artificielle IMEON
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              L'IA intégrée aux onduleurs IMEON apprend vos habitudes de consommation 
              et optimise automatiquement la gestion de votre énergie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Apprentissage automatique</h3>
              <p className="text-sm text-gray-600">
                L'IA analyse vos habitudes de consommation et s'adapte 
                automatiquement pour maximiser l'autoconsommation.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prédiction météo</h3>
              <p className="text-sm text-gray-600">
                Intégration des prévisions météorologiques pour anticiper 
                la production et optimiser le stockage.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Battery className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestion intelligente</h3>
              <p className="text-sm text-gray-600">
                Décision automatique : autoconsommation, stockage batterie 
                ou revente au réseau selon le contexte.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Optimisation continue</h3>
              <p className="text-sm text-gray-600">
                L'algorithme s'améliore en permanence pour atteindre 
                jusqu'à 100% d'autoconsommation.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Section Avantages pour l'éolien */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Avantages spécifiques pour l'éolien
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Les onduleurs IMEON sont particulièrement adaptés aux installations 
                éoliennes grâce à leur gestion intelligente de l'intermittence et 
                leur compatibilité avec les batteries longue durée.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Gestion de l'intermittence
                    </h3>
                    <p className="text-sm text-gray-600">
                      L'IA anticipe les variations du vent et adapte en temps réel 
                      la stratégie de stockage et de consommation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Battery className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Compatibilité batteries 20 ans
                    </h3>
                    <p className="text-sm text-gray-600">
                      Compatible avec les batteries lithium haute durée de vie 
                      pour un système pérenne et rentable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Mode backup automatique
                    </h3>
                    <p className="text-sm text-gray-600">
                      En cas de coupure réseau, l'onduleur bascule automatiquement 
                      sur les batteries pour maintenir l'alimentation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Monitoring temps réel
                    </h3>
                    <p className="text-sm text-gray-600">
                      Application mobile dédiée pour suivre votre production 
                      et consommation où que vous soyez.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustration avantages */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Comment l'IA optimise votre éolienne
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    L'IA analyse la production éolienne en temps réel
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Elle prédit vos besoins selon vos habitudes
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Décision automatique : consommer, stocker ou revendre
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <p className="text-sm text-gray-700">
                    Résultat : jusqu'à 100% d'autoconsommation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section Gamme */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gamme d'onduleurs IMEON
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              EOLIA a sélectionné les modèles IMEON les plus adaptés 
              aux installations éoliennes domestiques.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* IMEON 3.6 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                Monophasé
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">IMEON 3.6</h3>
              <p className="text-emerald-600 font-semibold mb-4">3.6 kW</p>
              <p className="text-gray-600 text-sm mb-4">
                Idéal pour les petites installations résidentielles. 
                Compact et performant avec IA intégrée.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  IA d'apprentissage intégrée
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Compatible batteries lithium
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Mode backup intégré
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Monitoring via app mobile
                </li>
              </ul>
            </div>

            {/* IMEON 9.12 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-400 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white rounded-full text-sm font-medium">
                Recommandé
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4 mt-2">
                Triphasé
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">IMEON 9.12</h3>
              <p className="text-emerald-600 font-semibold mb-4">9.12 kW</p>
              <p className="text-gray-600 text-sm mb-4">
                Le choix optimal pour les éoliennes Tulipe. Puissance 
                et intelligence pour une gestion énergétique complète.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  IA avancée multi-sources
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Gestion triphasée équilibrée
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Capacité batterie étendue
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Idéal éolien + solaire
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Section Garanties & SAV */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Garanties & Service Après-Vente
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                IMEON s'engage sur la durée avec des garanties parmi les plus 
                longues du marché et un SAV de proximité basé en France.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Garantie 10 ans, extensible à 20 ans
                    </h3>
                    <p className="text-sm text-gray-600">
                      Garantie fabricant standard de 10 ans, avec possibilité 
                      d'extension jusqu'à 20 ans pour une tranquillité totale.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      SAV basé en France
                    </h3>
                    <p className="text-sm text-gray-600">
                      Service après-vente situé à Brest, en Bretagne. 
                      Proximité et réactivité garanties.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Hotline technique dédiée
                    </h3>
                    <p className="text-sm text-gray-600">
                      Équipe technique française disponible pour répondre 
                      à toutes vos questions et résoudre les problèmes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Mises à jour IA gratuites
                    </h3>
                    <p className="text-sm text-gray-600">
                      L'intelligence artificielle de votre onduleur bénéficie 
                      de mises à jour régulières et gratuites.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Made in France */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-sm border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <Factory className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  100% Made in France
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                IMEON est fier de concevoir et assembler tous ses onduleurs 
                en Bretagne, garantissant qualité et traçabilité.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Conception à Brest</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Assemblage en Bretagne</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">R&D française</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Support technique local</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-100">
                <a
                  href="https://www.imeon-energy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visiter le site officiel IMEON
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-12 lg:py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Intéressé par un onduleur IMEON ?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Nos experts vous accompagnent dans le choix de l'onduleur intelligent 
            adapté à votre installation éolienne et à vos besoins énergétiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculateur"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
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
