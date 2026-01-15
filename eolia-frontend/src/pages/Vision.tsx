import { motion } from 'framer-motion';
import { Globe, Lightbulb, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Vision() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-sky-600 to-sky-800 py-4 lg:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Notre Vision
          </h1>
          <p className="text-base text-white/90 max-w-3xl mx-auto">
            Un avenir durable où chaque foyer produit sa propre énergie verte
          </p>
        </div>
      </section>

      {/* Vision Environnementale */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center mb-8"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vision Environnementale
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nous imaginons un monde où la production d'énergie ne dépend plus des combustibles fossiles. 
                Notre vision est de contribuer activement à la transition énergétique en proposant une 
                alternative écologique, durable et accessible à chaque foyer.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Transition Énergétique
                </h3>
                <p className="text-gray-600">
                  Chaque éolienne Tulipe installée contribue à réduire notre dépendance aux énergies 
                  fossiles et à accélérer la transition vers un mix énergétique 100% renouvelable.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Autonomie Énergétique
                </h3>
                <p className="text-gray-600">
                  Nous permettons aux foyers de devenir producteurs de leur propre électricité, 
                  réduisant leur facture et leur empreinte carbone simultanément.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Réduction des Émissions
                </h3>
                <p className="text-gray-600">
                  Une éolienne Tulipe permet d'éviter jusqu'à 500 kg de CO2 par an, 
                  contribuant directement à la lutte contre le changement climatique.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Économie Circulaire
                </h3>
                <p className="text-gray-600">
                  Nos éoliennes sont conçues avec des matériaux recyclables et une durée de vie 
                  de 25 ans, minimisant l'impact environnemental sur tout leur cycle de vie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Technologique */}
      <section className="py-8 lg:py-10 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center mb-8"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Innovation Technologique
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                L'innovation est au cœur de notre ADN. Nous investissons continuellement dans la 
                recherche et le développement pour améliorer nos micro-éoliennes et offrir des solutions 
                toujours plus performantes, silencieuses et adaptées à l'environnement urbain.
              </p>
            </motion.div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Technologie Verticale Avancée
                  </h3>
                  <p className="text-gray-600">
                    Nos éoliennes à axe vertical captent le vent de toutes les directions sans 
                    système d'orientation motorisé, maximisant la production même avec des vents turbulents.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Silence et Discrétion
                  </h3>
                  <p className="text-gray-600">
                    Moins de 35 dB à 5 mètres - plus silencieuses qu'un réfrigérateur. 
                    Nos éoliennes s'intègrent parfaitement dans l'environnement résidentiel.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Efficacité Optimisée
                  </h3>
                  <p className="text-gray-600">
                    Démarrage dès 2 m/s de vent grâce à notre design hélicoïdal breveté. 
                    Production optimale même dans les zones à vent modéré.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Amélioration Continue
                  </h3>
                  <p className="text-gray-600">
                    Nous écoutons nos clients et intégrons leurs retours pour améliorer continuellement 
                    nos produits et développer de nouvelles fonctionnalités.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Social */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center mb-8"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Impact Social
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Au-delà de la technologie, notre vision est de créer un impact social positif en 
                démocratisant l'accès à l'énergie verte et en construisant une communauté engagée 
                pour un avenir plus durable.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Autonomie des Foyers
                </h3>
                <p className="text-gray-600">
                  Nous donnons aux familles la possibilité de produire leur propre électricité, 
                  leur offrant autonomie et indépendance énergétique.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Communauté Engagée
                </h3>
                <p className="text-gray-600">
                  Nous fédérons une communauté d'ambassadeurs et d'utilisateurs partageant 
                  les mêmes valeurs de durabilité et de responsabilité.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Démocratisation
                </h3>
                <p className="text-gray-600">
                  Notre objectif est de rendre l'énergie éolienne accessible à tous, 
                  pas seulement aux grandes installations industrielles.
                </p>
              </div>
            </div>
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Ensemble, Construisons l'Avenir
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Notre vision ne peut se réaliser qu'avec votre participation. Chaque personne qui 
                choisit Eolia contribue à un mouvement plus large vers un avenir où l'énergie propre 
                est accessible à tous. Rejoignez-nous dans cette aventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 lg:py-10 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Découvrez comment ça fonctionne
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Explorez la technologie derrière nos éoliennes Tulipe et comprenez 
              comment nous transformons le vent en électricité propre.
            </p>
            <Link
              to="/fonctionnement"
              className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Voir comment ça fonctionne
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
