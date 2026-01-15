import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Battery,
  Award,
  Leaf,
  Shield,
  CheckCircle,
  Calculator,
  MessageCircle,
  ExternalLink,
  Zap,
  Wind,
  Thermometer,
  RotateCcw,
  MapPin,
  Heart,
  Factory,
  Recycle,
} from 'lucide-react';

/**
 * Page détaillée du partenaire Energiestro
 * Présente la technologie VOSS (volant d'inertie), ses avantages écologiques et la garantie à vie
 * Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 8.1, 8.2, 8.3, 8.4, 8.5
 */
export default function EnergiestroDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Gradient ambre/orange Energiestro */}
      <section className="relative bg-gradient-to-br from-amber-600 to-amber-500 text-white py-16 lg:py-20 overflow-hidden">
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
                <Battery className="w-4 h-4" />
                Stockage révolutionnaire par inertie
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Energiestro</h1>
              <p className="text-xl text-amber-100 mb-6">
                Le volant d'inertie en béton, garanti à vie
              </p>
              <p className="text-amber-100 leading-relaxed">
                Energiestro révolutionne le stockage d'énergie avec sa technologie VOSS 
                (Volant de Stockage Solide). Un cylindre de béton armé enterré qui stocke 
                l'énergie par rotation : écologique, sans usure, et garanti à vie. 
                L'alternative durable aux batteries chimiques, conçue et fabriquée en Alsace.
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">10</p>
                <p className="text-amber-100 text-sm">kWh de capacité</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">∞</p>
                <p className="text-amber-100 text-sm">Cycles illimités</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">À vie</p>
                <p className="text-amber-100 text-sm">Garantie</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">0</p>
                <p className="text-amber-100 text-sm">Risque incendie</p>
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
                Une startup française qui révolutionne le stockage
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fondée en <span className="font-semibold text-gray-900">2014 en Alsace</span>, 
                  Energiestro est une startup française innovante qui a développé une technologie 
                  de stockage d'énergie révolutionnaire : le <span className="font-semibold text-gray-900">volant d'inertie en béton</span>.
                </p>
                <p>
                  Contrairement aux batteries lithium qui s'usent et perdent leur capacité au fil 
                  du temps, le système VOSS (Volant de Stockage Solide) utilise un principe 
                  physique simple et éprouvé : <span className="font-semibold text-gray-900">l'énergie cinétique de rotation</span>.
                </p>
                <p>
                  Cette technologie brevetée offre une alternative écologique et durable, 
                  sans les inconvénients des batteries chimiques : pas de dégradation, 
                  pas de risque d'incendie, et des matériaux 100% recyclables.
                </p>
              </div>
            </div>

            {/* Caractéristiques clés */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Made in Alsace</h3>
                <p className="text-sm text-gray-600">
                  Conçu et fabriqué en France
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Garanti à vie</h3>
                <p className="text-sm text-gray-600">
                  Aucune usure mécanique
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <Leaf className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">100% Écologique</h3>
                <p className="text-sm text-gray-600">
                  Béton recyclable, zéro lithium
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Technologie brevetée</h3>
                <p className="text-sm text-gray-600">
                  Innovation française unique
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment fonctionne le volant d'inertie ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un principe physique simple et éprouvé : stocker l'énergie sous forme 
              de mouvement rotatif dans un cylindre de béton armé enterré.
            </p>
          </div>

          {/* Étapes de fonctionnement */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Surplus d'énergie</h3>
              <p className="text-sm text-gray-600">
                Votre éolienne produit plus que vous ne consommez ? 
                L'excédent est envoyé au volant.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accélération</h3>
              <p className="text-sm text-gray-600">
                Le cylindre de béton accélère jusqu'à 10 000 tr/min 
                dans une enceinte sous vide.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Battery className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Stockage</h3>
              <p className="text-sm text-gray-600">
                L'énergie est stockée sous forme cinétique. 
                Le volant maintient sa rotation pendant des heures.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Restitution</h3>
              <p className="text-sm text-gray-600">
                Besoin d'énergie ? Le volant ralentit et génère 
                du courant électrique instantanément.
              </p>
            </div>
          </div>

          {/* Schéma simplifié */}
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Le système VOSS en détail
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Factory className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Cylindre en béton</h4>
                <p className="text-sm text-gray-600">
                  Béton armé haute résistance, matériau durable et recyclable
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Enceinte sous vide</h4>
                <p className="text-sm text-gray-600">
                  Élimine les frottements de l'air pour une efficacité maximale
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Enterré dans le jardin</h4>
                <p className="text-sm text-gray-600">
                  Invisible, silencieux, intégré naturellement à votre terrain
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section Avantages uniques */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Avantages uniques du volant d'inertie
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une technologie qui surpasse les batteries chimiques sur tous les critères 
              de durabilité, sécurité et respect de l'environnement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Garanti à vie</h3>
              <p className="text-sm text-gray-600">
                Contrairement aux batteries qui perdent 20% de capacité après 5 ans, 
                le volant d'inertie ne s'use pas. Aucune dégradation chimique, 
                performance constante pendant des décennies.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">100% Écologique</h3>
              <p className="text-sm text-gray-600">
                Béton recyclable, pas de lithium, pas de cobalt, pas de terres rares. 
                Matériaux durables et respectueux de l'environnement. 
                Empreinte carbone minimale.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sécurité totale</h3>
              <p className="text-sm text-gray-600">
                Aucun risque d'incendie ou d'explosion. Pas de réactions chimiques 
                dangereuses. Le système est enterré et totalement sécurisé, 
                même en cas de défaillance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cycles illimités</h3>
              <p className="text-sm text-gray-600">
                Les batteries lithium supportent 5 000 à 10 000 cycles. 
                Le volant d'inertie ? Illimité. Chargez et déchargez 
                autant que vous voulez, sans aucune usure.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Réponse instantanée</h3>
              <p className="text-sm text-gray-600">
                Temps de réponse quasi-instantané pour absorber les pics 
                de production éolienne ou répondre aux pics de consommation. 
                Idéal pour l'intermittence du vent.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mb-4">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tous climats</h3>
              <p className="text-sm text-gray-600">
                Fonctionne de -20°C à +50°C sans perte de performance. 
                Enterré, le système est naturellement protégé des 
                variations de température extrêmes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Idéal pour l'éolien */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Idéal pour les installations éoliennes
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Le volant d'inertie Energiestro est particulièrement adapté aux 
                installations éoliennes grâce à sa capacité à absorber les variations 
                rapides de production et à restituer l'énergie instantanément.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wind className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Absorbe les pics de production
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quand le vent souffle fort, le surplus est immédiatement 
                      stocké dans le volant sans aucune perte.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Cycles illimités
                    </h3>
                    <p className="text-sm text-gray-600">
                      L'éolien génère de nombreux cycles charge/décharge quotidiens. 
                      Le volant les supporte sans aucune usure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Restitution instantanée
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quand le vent tombe, l'énergie stockée est disponible 
                      immédiatement pour couvrir vos besoins.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Recycle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Compatible solaire
                    </h3>
                    <p className="text-sm text-gray-600">
                      Le système fonctionne aussi bien avec l'éolien qu'avec 
                      le solaire, ou les deux combinés.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparaison avec batteries */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Volant d'inertie vs Batteries lithium
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium text-gray-500 pb-2 border-b">
                  <div>Critère</div>
                  <div className="text-amber-600">VOSS</div>
                  <div className="text-gray-400">Lithium</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm py-2">
                  <div className="text-gray-700 text-left">Durée de vie</div>
                  <div className="text-amber-600 font-semibold">À vie</div>
                  <div className="text-gray-500">10-15 ans</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm py-2 bg-gray-50 rounded">
                  <div className="text-gray-700 text-left">Cycles</div>
                  <div className="text-amber-600 font-semibold">Illimités</div>
                  <div className="text-gray-500">5 000-10 000</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm py-2">
                  <div className="text-gray-700 text-left">Dégradation</div>
                  <div className="text-amber-600 font-semibold">0%</div>
                  <div className="text-gray-500">20% en 5 ans</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm py-2 bg-gray-50 rounded">
                  <div className="text-gray-700 text-left">Risque incendie</div>
                  <div className="text-amber-600 font-semibold">Aucun</div>
                  <div className="text-gray-500">Possible</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm py-2">
                  <div className="text-gray-700 text-left">Recyclabilité</div>
                  <div className="text-amber-600 font-semibold">100%</div>
                  <div className="text-gray-500">Partielle</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm py-2 bg-gray-50 rounded">
                  <div className="text-gray-700 text-left">Métaux rares</div>
                  <div className="text-amber-600 font-semibold">Aucun</div>
                  <div className="text-gray-500">Lithium, cobalt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section Installation */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Installation simple et discrète
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Le système VOSS s'intègre naturellement dans votre jardin. 
              Une fois enterré, il est totalement invisible et silencieux.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Excavation</h3>
              <p className="text-sm text-gray-600">
                Une excavation simple de 2m x 2m x 2m dans votre jardin. 
                Travaux réalisés en une journée.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Installation</h3>
              <p className="text-sm text-gray-600">
                Le système VOSS est posé et raccordé électriquement 
                à votre installation existante.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mise en service</h3>
              <p className="text-sm text-gray-600">
                Le terrain est remblayé. Le système est invisible, 
                silencieux et prêt à fonctionner.
              </p>
            </div>
          </div>

          <div className="mt-10 bg-amber-50 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Aucune maintenance requise
                </h3>
                <p className="text-sm text-gray-600">
                  Une fois installé, le système VOSS ne nécessite aucune maintenance. 
                  Pas de remplacement de pièces, pas d'entretien périodique. 
                  Il fonctionne de manière autonome pendant toute sa durée de vie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Caractéristiques techniques */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Caractéristiques techniques
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Le système VOSS est conçu pour offrir des performances optimales 
                avec une capacité de stockage adaptée aux besoins résidentiels.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Capacité de stockage</span>
                  <span className="font-semibold text-gray-900">10 kWh</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Puissance nominale</span>
                  <span className="font-semibold text-gray-900">3 kW</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Vitesse de rotation max</span>
                  <span className="font-semibold text-gray-900">10 000 tr/min</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Rendement</span>
                  <span className="font-semibold text-gray-900">90%</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Plage de température</span>
                  <span className="font-semibold text-gray-900">-20°C à +50°C</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Dimensions (enterré)</span>
                  <span className="font-semibold text-gray-900">2m x 2m x 2m</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">Garantie</span>
                  <span className="font-semibold text-amber-600">À vie</span>
                </div>
              </div>
            </div>

            {/* Made in France */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-sm border border-amber-100">
              <div className="flex items-center gap-3 mb-6">
                <Factory className="w-8 h-8 text-amber-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Made in Alsace
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Energiestro est fier de concevoir et fabriquer ses systèmes VOSS 
                en Alsace, garantissant qualité et traçabilité françaises.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-gray-700">Conception française</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-gray-700">Fabrication en Alsace</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-gray-700">Technologie brevetée</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-gray-700">Support technique local</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-amber-100">
                <a
                  href="https://energiestro.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visiter le site officiel Energiestro
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-12 lg:py-16 bg-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Intéressé par le stockage Energiestro ?
          </h2>
          <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
            Nos experts vous accompagnent dans le choix de la solution de stockage 
            adaptée à votre installation éolienne. Découvrez comment le volant 
            d'inertie peut révolutionner votre autonomie énergétique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculateur"
              className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
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
