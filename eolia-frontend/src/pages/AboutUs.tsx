import { motion } from 'framer-motion';
import { Target, Heart, Leaf, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-sky-600 to-sky-800" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Qui sommes-nous
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              L'énergie éolienne domestique accessible à tous, une mission qui nous anime chaque jour
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Chez Eolia, nous croyons que l'accès à une énergie propre et renouvelable est un droit fondamental. 
                Notre mission est de démocratiser l'énergie éolienne domestique en proposant des micro-éoliennes 
                innovantes, silencieuses et accessibles à tous les foyers français.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Innovation Technologique
                </h3>
                <p className="text-gray-600">
                  Nous développons des éoliennes verticales de pointe qui captent le vent de toutes 
                  les directions, fonctionnant même avec des vents faibles et turbulents.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Accessibilité Universelle
                </h3>
                <p className="text-gray-600">
                  Notre objectif est de rendre l'énergie éolienne accessible au plus grand nombre, 
                  des particuliers aux entreprises, avec des solutions adaptées à chaque besoin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Nos Valeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  Nous repoussons les limites de la technologie éolienne pour créer des solutions 
                  toujours plus performantes et adaptées à l'environnement urbain.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Écologie
                </h3>
                <p className="text-gray-600">
                  La protection de l'environnement est au cœur de notre démarche. Chaque éolienne 
                  contribue à réduire les émissions de CO2 et à préserver notre planète.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Accessibilité
                </h3>
                <p className="text-gray-600">
                  Nous construisons une communauté engagée autour de valeurs communes : 
                  autonomie énergétique, durabilité et responsabilité environnementale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Engagement */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Engagement
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Eolia s'engage à fournir des produits de la plus haute qualité, conçus avec 
                soin et respect de l'environnement. Nous garantissons un service client exceptionnel 
                et un accompagnement personnalisé à chaque étape de votre projet.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Qualité Garantie
                  </h3>
                  <p className="text-gray-600">
                    Tous nos produits sont testés et certifiés pour garantir performance et durabilité.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Support Dédié
                  </h3>
                  <p className="text-gray-600">
                    Notre équipe est à votre écoute pour répondre à toutes vos questions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Made in France
                  </h3>
                  <p className="text-gray-600">
                    Conception et assemblage français pour une qualité irréprochable.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Durabilité
                  </h3>
                  <p className="text-gray-600">
                    Des éoliennes conçues pour durer 25 ans et minimiser l'impact environnemental.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Prêt à découvrir nos solutions ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explorez notre gamme d'éoliennes Tulipe et trouvez celle qui correspond à vos besoins.
          </p>
          <Link
            to="/produits"
            className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Découvrir nos produits
          </Link>
        </div>
      </section>
    </div>
  );
}
