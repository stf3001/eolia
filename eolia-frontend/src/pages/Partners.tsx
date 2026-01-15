import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Wind,
  Sun,
  Droplets,
  Calculator,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';
import PartnerCard from '../components/partners/PartnerCard';
import { partners } from '../data/partners';

export default function Partners() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Task 4.1 */}
      <section className="relative bg-gradient-to-br from-sky-600 to-sky-500 text-white py-4 lg:py-5 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Nos Partenaires
            </h1>
            <p className="text-base text-sky-100 max-w-3xl mx-auto">
              Un écosystème de confiance sélectionné par EOLIA pour accompagner 
              votre installation éolienne avec des équipements adaptés et des 
              professionnels qualifiés.
            </p>
          </div>
        </div>
      </section>

      {/* Section éducative sur l'intermittence - Task 4.2 */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              L'éolien, une énergie qui demande des équipements adaptés
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Contrairement au solaire ou à l'hydraulique, le vent est une source 
              d'énergie particulièrement variable. Cette intermittence nécessite 
              des équipements spécifiquement conçus pour gérer ces fluctuations.
            </p>
          </motion.div>

          {/* Comparaison visuelle vent/soleil/eau */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Vent */}
            <div className="bg-sky-50 rounded-2xl p-6 border-2 border-sky-200">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-center mb-2">Vent</h3>
              <div className="flex justify-center gap-1 mb-3">
                <span className="text-sky-600 text-2xl">+++</span>
              </div>
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium text-sky-700">Très variable</span> — 
                Rafales, accalmies, changements de direction. Nécessite des onduleurs 
                robustes capables de gérer les pics de puissance.
              </p>
            </div>

            {/* Soleil */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-center mb-2">Soleil</h3>
              <div className="flex justify-center gap-1 mb-3">
                <span className="text-amber-600 text-2xl">++</span>
              </div>
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium text-amber-700">Prévisible</span> — 
                Cycle jour/nuit régulier, variations saisonnières connues. 
                Production plus stable et anticipable.
              </p>
            </div>

            {/* Eau */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-center mb-2">Eau</h3>
              <div className="flex justify-center gap-1 mb-3">
                <span className="text-emerald-600 text-2xl">+</span>
              </div>
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium text-emerald-700">Constant</span> — 
                Débit régulier, production stable. L'énergie hydraulique est 
                la plus prévisible des énergies renouvelables.
              </p>
            </div>
          </div>

          {/* Texte explicatif */}
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Pourquoi des équipements spécifiques pour l'éolien ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Une éolienne peut passer de 0 à 100% de sa puissance en quelques 
                  secondes lors d'une rafale. Cette caractéristique impose des 
                  contraintes techniques importantes : l'onduleur doit absorber ces 
                  variations sans surchauffe, le système de stockage doit pouvoir 
                  encaisser des cycles de charge/décharge fréquents, et l'installation 
                  doit être réalisée par des professionnels formés à ces spécificités.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  C'est pourquoi EOLIA a sélectionné des partenaires dont les produits 
                  sont <span className="font-medium text-gray-900">spécifiquement adaptés 
                  à l'énergie éolienne</span>, garantissant performance et durabilité 
                  de votre installation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grille des 4 cartes partenaires - Task 4.3 */}
      <section className="py-8 lg:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos partenaires de confiance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des équipements et services sélectionnés pour leur excellence 
              et leur adaptation aux spécificités de l'énergie éolienne.
            </p>
          </motion.div>

          {/* Grille responsive : 1 col mobile, 2 col tablette, 4 col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA - Task 4.4 */}
      <section className="py-8 lg:py-10 bg-sky-600">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Besoin de conseils pour votre installation ?
            </h2>
            <p className="text-lg text-sky-100 mb-6 max-w-2xl mx-auto">
              Notre équipe vous accompagne dans le choix des équipements adaptés 
              à votre projet et à vos besoins énergétiques.
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}
