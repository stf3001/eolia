import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Coins,
  Leaf,
  Wind,
  Gift,
  Users,
  Building2,
  Shield,
  CheckCircle2,
  AlertCircle,
  Phone,
  GraduationCap,
  FileText
} from 'lucide-react';

export default function Ambassador() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-4 lg:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Devenez Ambassadeur EOLIA
            </h1>
            <p className="text-base text-white/90 mb-4">
              Partagez votre conviction pour l'énergie éolienne, générez des revenus et participez à la transition énergétique
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/inscription"
                className="bg-white text-emerald-700 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                Devenir ambassadeur
              </Link>
              <Link
                to="/connexion"
                className="bg-transparent border-2 border-white text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-all"
              >
                Espace ambassadeur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi devenir ambassadeur */}
      <section className="py-8 lg:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi devenir ambassadeur ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rejoignez un mouvement qui a du sens et profitez d'avantages concrets
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Gagner des revenus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Coins className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Générez des revenus</h3>
              <p className="text-gray-600 leading-relaxed">
                Recevez des bons d'achat ou des commissions attractives pour chaque recommandation réussie.
                Financez votre propre éolienne grâce à vos parrainages !
              </p>
            </motion.div>

            {/* Transition écologique */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Leaf className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Agissez pour la planète</h3>
              <p className="text-gray-600 leading-relaxed">
                Contribuez activement à la transition énergétique en promouvant l'énergie éolienne domestique
                et en réduisant la dépendance aux énergies fossiles.
              </p>
            </motion.div>

            {/* Énergie renouvelable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Wind className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Énergie renouvelable</h3>
              <p className="text-gray-600 leading-relaxed">
                Participez à la décentralisation de la production d'énergie et aidez vos proches
                à devenir autonomes avec une éolienne Tulipe.
              </p>
            </motion.div>

            {/* Récompenses exceptionnelles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cadeaux exceptionnels</h3>
              <p className="text-gray-600 leading-relaxed">
                Obtenez votre propre éolienne Tulipe gratuitement après 10 recommandations !
                Un cadeau d'une valeur d'environ 2 500€ pour récompenser votre engagement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* B2C vs B2B */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Deux programmes adaptés à votre profil
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Que vous soyez particulier ou professionnel, nous avons le programme qui vous correspond
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Programme Particulier B2C */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8 border-2 border-emerald-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Programme Particulier</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    <strong>200€ à 300€ en bons d'achat</strong> par recommandation réussie
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    <strong>200€</strong> pour le 1er filleul, <strong>250€</strong> pour le 2ème, <strong>300€</strong> pour les suivants
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    Plafond de <strong>10 recommandations par an</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    <strong>Éolienne Tulipe offerte</strong> à la 10ème recommandation (valeur ~2 500€)
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-emerald-300">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Cadre légal</p>
                    <p className="text-sm text-gray-600">
                      En tant que particulier, vous recevez des <strong>bons d'achat</strong> et non des
                      commissions en euros. L'État français tolère cette pratique dans le cadre du parrainage
                      non professionnel.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/inscription"
                className="mt-6 block w-full bg-emerald-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Devenir ambassadeur particulier
              </Link>
            </motion.div>

            {/* Programme Professionnel B2B */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Programme Professionnel</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    <strong>Commissions de 5% à 12,5%</strong> selon le CA généré
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    <strong>Aucun plafond</strong> de recommandations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    Versement mensuel en <strong>euros</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-300">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Cadre légal</p>
                    <p className="text-sm text-gray-600">
                      Programme réservé aux <strong>apporteurs d'affaires professionnels</strong>.
                      Contrat d'apporteur obligatoire. Les commissions sont imposables et doivent être déclarées.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/ambassadeur-b2b"
                className="mt-6 block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Devenir ambassadeur professionnel
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos exigences */}
      <section className="py-8 lg:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Notre engagement : l'intégrité avant tout
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              EOLIA s'engage à respecter le droit et attend la même rigueur de ses ambassadeurs
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Carte principale */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Règles essentielles</h3>
                  <p className="text-gray-600">
                    Ces règles sont détaillées dans notre règlement et doivent être respectées par tous les ambassadeurs
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Transparence */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Transparence absolue</h4>
                    <p className="text-gray-700 mb-2">
                      <strong>Aucun mensonge, aucune exagération.</strong> Présentez nos éoliennes de manière
                      honnête et factuelle. Les performances de nos Tulipe sont déjà exceptionnelles,
                      nul besoin d'en rajouter.
                    </p>
                    <p className="text-sm text-gray-600">
                      En cas de doute sur une information technique ou commerciale, contactez-nous.
                      Nous sommes là pour vous aider à répondre correctement à vos prospects.
                    </p>
                  </div>
                </div>

                {/* Conformité légale */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Conformité légale</h4>
                    <p className="text-gray-700 mb-2">
                      EOLIA s'engage à être <strong>irréprochable</strong> dans le respect du droit français
                      et européen. Nous attendons la même rigueur de nos ambassadeurs.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Respect du RGPD dans la collecte de données</li>
                      <li>• Obtention du consentement des filleuls</li>
                      <li>• Respect des règles de démarchage</li>
                      <li>• Déclaration fiscale des revenus (B2B)</li>
                    </ul>
                  </div>
                </div>

                {/* Protection image */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Protection de notre image</h4>
                    <p className="text-gray-700">
                      Représentez EOLIA avec professionnalisme et bienveillance. Notre réputation
                      repose sur la qualité de nos éoliennes et l'intégrité de nos ambassadeurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-lg">Formation disponible</h4>
                </div>
                <p className="text-gray-700 mb-4">
                  Pour les apporteurs professionnels, EOLIA peut vous former sur nos éoliennes
                  et vous fournir des supports de présentation.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700"
                >
                  <Phone className="w-4 h-4" />
                  Nous contacter
                </Link>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-lg">Supports marketing</h4>
                </div>
                <p className="text-gray-700 mb-4">
                  Accédez à nos brochures, visuels et argumentaires pour présenter EOLIA
                  de manière professionnelle et convaincante.
                </p>
                <Link
                  to="/connexion"
                  className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  <FileText className="w-4 h-4" />
                  Accéder aux ressources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-8 lg:py-10 bg-emerald-700 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Wind className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à rejoindre l'aventure ?
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Devenez ambassadeur EOLIA dès aujourd'hui et commencez à générer des revenus
              tout en participant à la transition énergétique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/inscription"
                className="bg-white text-emerald-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg inline-block"
              >
                Créer mon compte
              </Link>
              <Link
                to="/faq"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all inline-block"
              >
                FAQ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
