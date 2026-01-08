import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Search, Wind, Zap, ShoppingCart, Wrench, FileText, ArrowRight } from 'lucide-react'

type Category = 'all' | 'product' | 'installation' | 'order' | 'maintenance' | 'admin'

interface FAQItem {
  question: string
  answer: string
  category: Category
}

const faqData: FAQItem[] = [
  // Produit
  {
    category: 'product',
    question: "Quelle est la différence entre une éolienne verticale et horizontale ?",
    answer: "L'éolienne verticale (comme notre Tulipe) capte le vent de toutes les directions sans système d'orientation, fonctionne mieux avec des vents turbulents, est plus silencieuse (< 35 dB) et plus sécuritaire. L'éolienne horizontale classique nécessite un vent laminaire et un système d'orientation motorisé."
  },
  {
    category: 'product',
    question: "Quelle puissance choisir pour ma maison ?",
    answer: "Pour une maison individuelle standard, une éolienne de 1 à 3 kWc suffit généralement. Pour une consommation plus importante ou une autonomie accrue, optez pour 5 à 10 kWc. Notre calculateur vous aide à estimer la production selon votre localisation."
  },
  {
    category: 'product',
    question: "Quelle est la durée de vie d'une éolienne Tulipe ?",
    answer: "Nos éoliennes sont conçues pour une durée de vie minimale de 25 ans. Les pales et composants mécaniques sont garantis 5 ans, l'alternateur 10 ans. Un entretien régulier permet d'optimiser cette durée."
  },
  {
    category: 'product',
    question: "L'éolienne fait-elle du bruit ?",
    answer: "L'éolienne Tulipe produit moins de 35 dB à 5 mètres, soit moins qu'un réfrigérateur. Sa conception verticale et ses pales hélicoïdales minimisent les vibrations et le bruit aérodynamique."
  },
  // Installation
  {
    category: 'installation',
    question: "Puis-je installer l'éolienne moi-même ?",
    answer: "L'installation mécanique peut être réalisée par un bricoleur averti. Cependant, le raccordement électrique doit obligatoirement être effectué par un électricien qualifié pour obtenir l'attestation Consuel."
  },
  {
    category: 'installation',
    question: "Quelle hauteur de mât est recommandée ?",
    answer: "La hauteur optimale dépend de votre environnement. En zone dégagée, 6 à 10 mètres suffisent. En zone avec obstacles (arbres, bâtiments), privilégiez 10 à 12 mètres pour capter un vent moins turbulent."
  },
  {
    category: 'installation',
    question: "Faut-il un permis de construire ?",
    answer: "Pour les éoliennes de moins de 12 mètres de hauteur, une simple déclaration préalable de travaux en mairie suffit. Au-delà de 12 mètres, un permis de construire est nécessaire."
  },
  {
    category: 'installation',
    question: "Quel type de fondation est nécessaire ?",
    answer: "Une dalle béton de 1m x 1m x 0.5m minimum est recommandée pour les mâts jusqu'à 10m. Pour les mâts haubanés, des plots d'ancrage suffisent. Nos forfaits pose incluent l'étude de sol."
  },
  // Commande
  {
    category: 'order',
    question: "Quels sont les délais de livraison ?",
    answer: "Les éoliennes en stock sont expédiées sous 5 à 10 jours ouvrés. Pour les modèles sur commande ou les configurations spéciales, comptez 4 à 6 semaines. Vous recevez un suivi par email à chaque étape."
  },
  {
    category: 'order',
    question: "Proposez-vous le paiement en plusieurs fois ?",
    answer: "Oui, nous proposons le paiement en 3x ou 4x sans frais via notre partenaire Stripe pour les commandes supérieures à 500€. Des solutions de financement longue durée sont également disponibles sur demande."
  },
  {
    category: 'order',
    question: "Puis-je annuler ma commande ?",
    answer: "Vous disposez d'un délai de rétractation de 14 jours après réception. Pour les produits sur mesure ou déjà expédiés, contactez notre service client pour étudier les options possibles."
  },
  {
    category: 'order',
    question: "Comment fonctionne le prêt d'anémomètre ?",
    answer: "Nous vous prêtons un anémomètre pendant 1 mois contre une caution de 100€. Vous mesurez le vent sur votre site, puis nous renvoyez l'appareil avec le bon de retour prépayé. La caution est remboursée à réception."
  },
  // Maintenance
  {
    category: 'maintenance',
    question: "Quel entretien est nécessaire ?",
    answer: "Un contrôle visuel annuel (pales, fixations, câbles) et une vérification des connexions électriques tous les 2 ans suffisent. Aucune lubrification n'est nécessaire grâce aux roulements étanches."
  },
  {
    category: 'maintenance',
    question: "Que faire en cas de panne ?",
    answer: "Contactez notre support technique. La plupart des problèmes peuvent être diagnostiqués à distance. Si une intervention est nécessaire, nous vous mettons en relation avec un technicien agréé de votre région."
  },
  {
    category: 'maintenance',
    question: "Les pièces détachées sont-elles disponibles ?",
    answer: "Oui, toutes les pièces détachées (pales, roulements, câbles, etc.) sont disponibles dans notre boutique. Nous garantissons leur disponibilité pendant 15 ans minimum après l'achat."
  },
  // Administratif
  {
    category: 'admin',
    question: "Qu'est-ce que le Consuel ?",
    answer: "Le Consuel (Comité National pour la Sécurité des Usagers de l'Électricité) délivre l'attestation de conformité électrique obligatoire pour le raccordement au réseau. Le formulaire jaune concerne les installations de production."
  },
  {
    category: 'admin',
    question: "Puis-je revendre mon électricité ?",
    answer: "Oui, via un contrat d'obligation d'achat (OA) avec EDF. Le tarif de rachat est fixé par arrêté. Vous pouvez aussi opter pour l'autoconsommation avec vente du surplus, souvent plus avantageux."
  },
  {
    category: 'admin',
    question: "Y a-t-il des aides financières ?",
    answer: "Les aides varient selon les régions et évoluent régulièrement. Certaines collectivités proposent des subventions. La TVA réduite à 10% s'applique pour les installations sur des logements de plus de 2 ans."
  }
]

const categories = [
  { id: 'all' as Category, label: 'Toutes', icon: Search },
  { id: 'product' as Category, label: 'Produit', icon: Wind },
  { id: 'installation' as Category, label: 'Installation', icon: Zap },
  { id: 'order' as Category, label: 'Commande', icon: ShoppingCart },
  { id: 'maintenance' as Category, label: 'Maintenance', icon: Wrench },
  { id: 'admin' as Category, label: 'Administratif', icon: FileText }
]


export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<number[]>([])

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Questions <span className="text-primary">fréquentes</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Trouvez rapidement les réponses à vos questions sur nos éoliennes, 
              l'installation, les commandes et les démarches administratives.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ List */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune question ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQ.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                        openItems.includes(index) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openItems.includes(index) && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-gray-600 mb-8">
            Notre équipe est disponible pour répondre à toutes vos questions 
            et vous accompagner dans votre projet éolien.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/diagnostic"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Faire un diagnostic gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="mailto:contact@eolia.fr"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
