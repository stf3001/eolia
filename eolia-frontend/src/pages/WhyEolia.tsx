import { motion } from 'framer-motion';
import { Award, Euro, Leaf, MapPin, Headphones, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WhyEolia() {
  const reasons = [
    {
      icon: Award,
      title: 'Qualité Supérieure',
      description: 'Nos éoliennes utilisent une technologie de pointe avec des matériaux premium pour garantir performance et durabilité sur 25 ans.'
    },
    {
      icon: Euro,
      title: 'Économies Durables',
      description: 'Réduisez votre facture d\'électricité jusqu\'à 30% tout en bénéficiant d\'une source d\'énergie gratuite et illimitée.'
    },
    {
      icon: Leaf,
      title: 'Écologique',
      description: 'Produisez une énergie 100% verte et réduisez votre empreinte carbone de manière significative.'
    },
    {
      icon: MapPin,
      title: 'Made in France',
      description: 'Conception et assemblage français, avec un savoir-faire reconnu et un engagement local fort.'
    },
    {
      icon: Headphones,
      title: 'Support Dédié',
      description: 'Une équipe d\'experts à votre écoute pour l\'installation, la maintenance et toutes vos questions.'
    }
  ];

  const certifications = [
    'Certification CE pour la conformité européenne',
    'Norme IEC 61400-2 pour les petites éoliennes',
    'Certification IP65 pour la résistance aux intempéries',
    'Conformité aux normes acoustiques françaises'
  ];

  const guarantees = [
    'Garantie constructeur 5 ans sur tous nos produits',
    'Extension de garantie disponible jusqu\'à 10 ans',
    'Service après-vente réactif sous 48h',
    'Pièces de rechange disponibles pendant 15 ans',
    'Satisfaction client garantie ou remboursé sous 30 jours'
  ];

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
              Pourquoi Eolia
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              L'excellence française au service de votre autonomie énergétique
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5 Raisons Principales */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              5 Raisons de Choisir Eolia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez ce qui fait d'Eolia le leader français des micro-éoliennes domestiques
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Certifications et Conformité
              </h2>
              <p className="text-lg text-gray-600">
                Nos produits répondent aux normes les plus strictes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4 bg-white p-6 rounded-xl"
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-medium">{cert}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos Garanties
              </h2>
              <p className="text-lg text-gray-600">
                Votre tranquillité d'esprit est notre priorité
              </p>
            </div>

            <div className="space-y-4">
              {guarantees.map((guarantee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl"
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-medium text-lg">{guarantee}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-sky-600 to-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à Passer à l'Énergie Éolienne ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Estimez votre production potentielle ou découvrez notre gamme d'éoliennes Tulipe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/calculateur"
                className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Calculer ma production
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/produits"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Voir nos produits
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
