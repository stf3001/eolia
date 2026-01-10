import { Link } from 'react-router-dom'
import { Wind, Calculator, Zap, Shield, Leaf, ArrowRight, CheckCircle, Star, Users, Settings, FileCheck } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-primary/10 py-20 lg:py-28 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Leaf className="h-4 w-4" />
                Énergie verte made in France
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Éoliennes Verticales{' '}
                <span className="text-primary">Tulipe</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Produisez votre propre électricité verte avec nos éoliennes silencieuses 
                et esthétiques, conçues pour les particuliers et professionnels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/produits"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-sky-600 font-medium hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/25"
                  style={{ color: 'white' }}
                >
                  Découvrir
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/calculateur"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-sky-600 text-sky-600 font-medium hover:bg-sky-50 transition-colors"
                >
                  <Calculator className="h-5 w-5" />
                  Calculer ma production
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Garantie 5 ans</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Installation clé en main</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>SAV France</span>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 lg:p-12">
                {/* Video showcase */}
                <div className="aspect-square bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/images/eolienne-tulipe-poster.jpg"
                  >
                    <source src={`${import.meta.env.VITE_MEDIA_URL || 'https://eolia-backend-media-dev.s3.eu-west-1.amazonaws.com'}/videos/eolienne-tulipe.mp4`} type="video/mp4" />
                    {/* Fallback si la vidéo ne charge pas */}
                    <div className="text-center p-8">
                      <Wind className="h-32 w-32 text-primary mx-auto mb-6 animate-pulse" />
                      <p className="text-gray-500 text-sm">Éolienne Tulipe</p>
                      <p className="text-2xl font-bold text-primary mt-2">1 à 10 kWc</p>
                    </div>
                  </video>
                </div>
                
                {/* Floating stats cards */}
                <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
                  <p className="text-2xl font-bold text-primary">-70%</p>
                  <p className="text-xs text-gray-500">sur votre facture</p>
                </div>
                <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
                  <p className="text-2xl font-bold text-primary">35 dB</p>
                  <p className="text-xs text-gray-500">ultra silencieuse</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir EOLIA ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des éoliennes verticales innovantes, pensées pour s'intégrer parfaitement 
              à votre environnement tout en maximisant votre production d'énergie.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Haute Performance</h3>
              <p className="text-gray-600">
                Technologie verticale optimisée pour capter le vent de toutes directions, même par vent faible.
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Garantie 5 ans</h3>
              <p className="text-gray-600">
                Qualité française avec une garantie complète sur tous nos produits et pièces détachées disponibles.
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Écologique</h3>
              <p className="text-gray-600">
                Silencieuse (35 dB) et respectueuse de la faune, notre éolienne Tulipe s'intègre harmonieusement.
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Calculator className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clé en Main</h3>
              <p className="text-gray-600">
                De la commande à la mise en service : DP mairie, Enedis, Consuel, nous gérons tout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un parcours simple et accompagné pour votre projet d'éolienne domestique.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-primary/25">
                  1
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimez</h3>
                <p className="text-gray-600 text-sm">
                  Utilisez notre calculateur pour estimer votre production selon votre localisation.
                </p>
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20" />
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-primary/25">
                  2
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurez</h3>
                <p className="text-gray-600 text-sm">
                  Choisissez votre modèle Tulipe et les options adaptées à vos besoins.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20" />
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-primary/25">
                  3
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Validez</h3>
                <p className="text-gray-600 text-sm">
                  Nous gérons les démarches administratives : mairie, Enedis, Consuel.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20" />
            </div>
            
            {/* Step 4 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-primary/25">
                  4
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Produisez</h3>
                <p className="text-gray-600 text-sm">
                  Installation par nos équipes et mise en service. Vous produisez votre électricité !
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/comment-ca-marche"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              En savoir plus sur le processus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les retours d'expérience de nos clients satisfaits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Installation impeccable et équipe très professionnelle. Mon éolienne Tulipe 3kWc 
                couvre maintenant 60% de ma consommation électrique. Je recommande !"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Jean-Pierre M.</p>
                  <p className="text-sm text-gray-500">Bretagne - Tulipe 3kWc</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Très satisfaite du suivi client. Les démarches administratives ont été gérées 
                de A à Z. L'éolienne est silencieuse, mes voisins ne l'entendent même pas."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marie-Claire D.</p>
                  <p className="text-sm text-gray-500">Normandie - Tulipe 5kWc</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "En tant que professionnel, j'ai équipé mon exploitation de 2 éoliennes en grappe. 
                Le bonus de production est réel et l'investissement rentabilisé en 5 ans."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">François L.</p>
                  <p className="text-sm text-gray-500">Occitanie - 2x Tulipe 10kWc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sky-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à produire votre propre énergie ?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Commencez par estimer votre production potentielle avec notre calculateur gratuit, 
            ou découvrez notre gamme d'éoliennes Tulipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculateur"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-sky-600 font-medium hover:bg-gray-100 transition-colors"
            >
              <Calculator className="h-5 w-5" />
              Calculer ma production
            </Link>
            <Link
              to="/diagnostic"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
            >
              Faire un diagnostic
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Anémomètre CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Wind className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Mesurez le potentiel éolien de votre site
              </h3>
              <p className="text-gray-600">
                Empruntez gratuitement un anémomètre pendant 1 mois (caution 100€ remboursable) 
                et obtenez des données précises pour votre projet.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/anemometre"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors"
              >
                Commander un anémomètre
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
