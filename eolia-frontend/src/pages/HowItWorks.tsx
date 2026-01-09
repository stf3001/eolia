import { Link } from 'react-router-dom'
import { 
  Wind, Zap, Volume2, Leaf, ArrowRight, CheckCircle, 
  RotateCcw, Sun, CloudRain, Compass, Shield, Settings
} from 'lucide-react'

export default function HowItWorks() {
  const advantages = [
    {
      icon: Wind,
      title: 'Omnidirectionnel',
      description: 'Capte le vent de toutes les directions sans orientation motorisée'
    },
    {
      icon: Volume2,
      title: 'Silencieux',
      description: 'Moins de 35 dB à 5m - plus silencieux qu\'un réfrigérateur'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Pas de pales dangereuses, sans risque pour les oiseaux'
    },
    {
      icon: Leaf,
      title: 'Écologique',
      description: 'Matériaux recyclables, empreinte carbone minimale'
    },
    {
      icon: Settings,
      title: 'Faible maintenance',
      description: 'Conception robuste, peu de pièces mobiles'
    },
    {
      icon: Zap,
      title: 'Efficace',
      description: 'Fonctionne dès 2 m/s de vent, optimisé pour les vents turbulents'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Le vent fait tourner les pales',
      description: 'Les pales hélicoïdales captent l\'énergie cinétique du vent quelle que soit sa direction. La forme Savonius optimisée maximise le couple de démarrage.'
    },
    {
      number: '02',
      title: 'L\'alternateur génère du courant',
      description: 'La rotation entraîne un alternateur à aimants permanents qui convertit l\'énergie mécanique en électricité (courant alternatif triphasé).'
    },
    {
      number: '03',
      title: 'L\'onduleur convertit l\'énergie',
      description: 'L\'onduleur hybride (IMEON ou Fronius) transforme le courant en 230V compatible avec votre installation et gère le stockage batterie.'
    },
    {
      number: '04',
      title: 'Vous consommez ou revendez',
      description: 'L\'électricité produite alimente votre maison en priorité. Le surplus peut être stocké en batterie ou revendu au réseau.'
    }
  ]

  const conditions = [
    { icon: Compass, label: 'Vent moyen', value: '> 4 m/s annuel' },
    { icon: Sun, label: 'Exposition', value: 'Zone dégagée' },
    { icon: CloudRain, label: 'Résistance', value: 'IP65, -20°C à +50°C' },
    { icon: RotateCcw, label: 'Durée de vie', value: '25 ans minimum' }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La technologie éolienne <span className="text-primary">verticale</span>
            </h1>
            <p className="text-lg text-gray-600">
              Découvrez comment nos éoliennes Tulipe transforment le vent en électricité 
              propre, silencieusement et efficacement.
            </p>
          </div>
        </div>
      </section>


      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Les avantages de l'éolienne verticale
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <advantage.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{advantage.title}</h3>
                  <p className="text-gray-600 text-sm">{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Comment ça fonctionne ?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            De la captation du vent à l'utilisation de l'électricité, voici les 4 étapes 
            de la production d'énergie avec une éolienne Tulipe.
          </p>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-6 bg-white p-6 rounded-xl shadow-sm">
                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Conditions optimales */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Conditions et caractéristiques
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {conditions.map((condition, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <condition.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-1">{condition.label}</p>
                <p className="font-semibold text-gray-900">{condition.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparaison */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Verticale vs Horizontale
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                Éolienne verticale (Tulipe)
              </h3>
              <ul className="space-y-3">
                {[
                  'Fonctionne avec des vents turbulents',
                  'Silencieuse (< 35 dB)',
                  'Pas d\'orientation nécessaire',
                  'Installation simplifiée',
                  'Esthétique moderne',
                  'Sécuritaire pour la faune'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-500 mb-6">
                Éolienne horizontale classique
              </h3>
              <ul className="space-y-3 text-gray-500">
                {[
                  'Nécessite un vent laminaire',
                  'Bruit important (> 50 dB)',
                  'Système d\'orientation motorisé',
                  'Installation complexe',
                  'Impact visuel important',
                  'Danger pour les oiseaux'
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-5 h-5 mr-3 flex-shrink-0 text-center">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à passer à l'énergie éolienne ?
          </h2>
          <p className="text-gray-600 mb-8">
            Estimez votre production potentielle avec notre calculateur gratuit 
            ou découvrez notre gamme d'éoliennes Tulipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculateur"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Calculer ma production
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/produits"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
            >
              Voir la gamme Tulipe
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
