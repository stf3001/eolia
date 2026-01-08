import { Link } from 'react-router-dom';
import {
  Zap,
  Battery,
  Cpu,
  Shield,
  Award,
  ArrowRight,
  Check,
  Globe,
  Leaf,
} from 'lucide-react';

const partners = [
  {
    id: 'imeon',
    name: 'IMEON Énergie',
    logo: '/images/partners/imeon-logo.png',
    tagline: "L'intelligence artificielle au service de votre énergie",
    description:
      "IMEON Énergie est un fabricant français d'onduleurs hybrides intelligents. Leur technologie brevetée intègre une intelligence artificielle qui optimise en temps réel la gestion de votre production et consommation d'énergie.",
    country: 'France',
    founded: '2014',
    features: [
      {
        icon: Cpu,
        title: 'IA Intégrée',
        description:
          "L'onduleur apprend vos habitudes de consommation et optimise automatiquement l'utilisation de votre production.",
      },
      {
        icon: Battery,
        title: 'Batteries 20 ans',
        description:
          'Compatible avec des batteries lithium garanties 20 ans pour une autonomie maximale.',
      },
      {
        icon: Shield,
        title: 'Garantie 10 ans',
        description:
          'Tous les onduleurs IMEON sont garantis 10 ans, extensible à 20 ans.',
      },
      {
        icon: Leaf,
        title: 'Made in France',
        description:
          'Conception et assemblage en France pour une qualité et un SAV de proximité.',
      },
    ],
    products: [
      {
        name: 'IMEON 3.6',
        power: '3.6 kW',
        type: 'Monophasé',
        price: '2 890 €',
        productId: 'imeon-3.6',
      },
      {
        name: 'IMEON 9.12',
        power: '9.12 kW',
        type: 'Triphasé',
        price: '4 990 €',
        productId: 'imeon-9.12',
      },
    ],
    color: 'blue',
  },
  {
    id: 'fronius',
    name: 'Fronius',
    logo: '/images/partners/fronius-logo.png',
    tagline: 'La qualité autrichienne depuis 1945',
    description:
      "Fronius est un leader mondial dans le domaine des onduleurs photovoltaïques. Avec plus de 75 ans d'expérience, la marque autrichienne est synonyme de fiabilité, d'innovation et de performance.",
    country: 'Autriche',
    founded: '1945',
    features: [
      {
        icon: Award,
        title: 'Leader mondial',
        description:
          "Plus de 3 millions d'onduleurs installés dans le monde, une référence du secteur.",
      },
      {
        icon: Globe,
        title: 'Monitoring Solar.web',
        description:
          'Plateforme de monitoring gratuite pour suivre votre production en temps réel.',
      },
      {
        icon: Shield,
        title: 'Garantie 10 ans',
        description:
          'Garantie fabricant de 10 ans sur tous les onduleurs de la gamme.',
      },
      {
        icon: Zap,
        title: 'Rendement 98%+',
        description:
          'Les meilleurs rendements du marché pour maximiser votre production.',
      },
    ],
    products: [
      {
        name: 'Fronius Primo 3.0',
        power: '3.0 kW',
        type: 'Monophasé',
        price: '1 890 €',
        productId: 'fronius-primo-3.0',
      },
      {
        name: 'Fronius Symo 10.0',
        power: '10.0 kW',
        type: 'Triphasé',
        price: '3 490 €',
        productId: 'fronius-symo-10.0',
      },
    ],
    color: 'red',
  },
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Partenaires Onduleurs
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              EOLIA a sélectionné les meilleurs fabricants d'onduleurs pour
              garantir la performance et la durabilité de votre installation
              éolienne.
            </p>
          </div>
        </div>
      </section>

      {/* Why Partners Matter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Conversion optimale
              </h3>
              <p className="text-gray-600 text-sm">
                L'onduleur convertit le courant continu de votre éolienne en
                courant alternatif utilisable.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Battery className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Stockage intelligent
              </h3>
              <p className="text-gray-600 text-sm">
                Les onduleurs hybrides permettent de stocker l'énergie dans des
                batteries pour une autonomie maximale.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Protection garantie
              </h3>
              <p className="text-gray-600 text-sm">
                Nos partenaires offrent des garanties longues et un SAV réactif
                pour votre tranquillité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Detail */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              id={partner.id}
              className={`scroll-mt-24 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div
                  className={`p-8 ${
                    partner.color === 'blue'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                      : 'bg-gradient-to-r from-red-600 to-red-500'
                  } text-white`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">{partner.name}</h2>
                          <p className="text-white/80">{partner.tagline}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="bg-white/20 rounded-lg px-4 py-2">
                        <span className="block text-white/70">Pays</span>
                        <span className="font-semibold">{partner.country}</span>
                      </div>
                      <div className="bg-white/20 rounded-lg px-4 py-2">
                        <span className="block text-white/70">Fondé en</span>
                        <span className="font-semibold">{partner.founded}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {partner.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {partner.features.map((feature) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div
                          key={feature.title}
                          className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                        >
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              partner.color === 'blue'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            <FeatureIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Products */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Produits disponibles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {partner.products.map((product) => (
                        <Link
                          key={product.productId}
                          to={`/produits/${product.productId}`}
                          className="group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                        >
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex gap-3 text-sm text-gray-500 mt-1">
                              <span>{product.power}</span>
                              <span>•</span>
                              <span>{product.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-emerald-600">
                              {product.price}
                            </span>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Our Partners */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi ces partenaires ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              EOLIA a sélectionné IMEON et Fronius pour leur excellence technique
              et leur engagement qualité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Compatibilité garantie',
                description:
                  'Tous nos onduleurs sont testés et validés avec les éoliennes Tulipe.',
              },
              {
                title: 'SAV réactif',
                description:
                  'Un réseau de techniciens formés pour une intervention rapide.',
              },
              {
                title: 'Garanties longues',
                description:
                  'Minimum 10 ans de garantie sur tous les onduleurs partenaires.',
              },
              {
                title: 'Évolutivité',
                description:
                  'Possibilité d\'ajouter des batteries ou d\'étendre votre installation.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Besoin de conseils ?
          </h2>
          <p className="text-gray-600 mb-8">
            Notre équipe vous aide à choisir l'onduleur adapté à votre
            installation et à vos besoins énergétiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/produits?category=inverter"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
            >
              Voir tous les onduleurs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/diagnostic"
              className="inline-flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
            >
              Faire un diagnostic
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
