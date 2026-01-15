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
  {
    category: 'product',
    question: "Puis-je ajouter une batterie pour stocker l'électricité ?",
    answer: "Absolument ! Notre système est 100% compatible avec les batteries de stockage domestiques (Tesla Powerwall, BYD, Huawei, etc.). Vous pouvez ainsi stocker l'énergie produite la nuit ou par vent fort pour l'utiliser quand vous en avez besoin. C'est la solution idéale pour maximiser votre autonomie. Nous pouvons vous conseiller sur le dimensionnement adapté à votre consommation."
  },
  {
    category: 'product',
    question: "Est-ce dangereux d'avoir une éolienne chez soi ?",
    answer: "Soyez rassuré : nos éoliennes Tulipe sont conçues pour une sécurité maximale. Elles fonctionnent en basse tension (48V), ce qui élimine tout risque d'électrocution. Le système de freinage automatique arrête les pales en cas de vent trop fort. Les pales en composite sont légères et ne peuvent pas blesser en cas de contact accidentel. Toutes nos installations sont certifiées conformes aux normes électriques françaises (Consuel)."
  },
  {
    category: 'product',
    question: "Que se passe-t-il en cas de tempête ?",
    answer: "Pas d'inquiétude ! L'éolienne Tulipe est équipée d'un système de freinage automatique qui ralentit puis stoppe les pales lorsque le vent dépasse 25 m/s (90 km/h). Elle est conçue pour résister à des vents de 180 km/h en position arrêtée. En 10 ans, nous n'avons jamais eu de dommage lié aux tempêtes sur nos installations."
  },
  {
    category: 'product',
    question: "L'éolienne peut-elle gêner mes voisins ?",
    answer: "La Tulipe est l'une des éoliennes les plus silencieuses du marché : moins de 35 dB à 5 mètres, soit moins qu'une conversation à voix basse. Son design vertical élimine l'effet stroboscopique (ombres portées) qui peut gêner avec les éoliennes horizontales. La plupart de nos clients nous disent que leurs voisins ne remarquent même pas qu'elle tourne !"
  },
  {
    category: 'product',
    question: "L'éolienne fonctionne-t-elle la nuit ?",
    answer: "Bien sûr ! Contrairement aux panneaux solaires, l'éolienne produit de l'électricité 24h/24 tant qu'il y a du vent. C'est d'ailleurs souvent la nuit que le vent est le plus régulier. Combinée à une batterie, vous pouvez ainsi couvrir vos besoins même pendant les heures creuses."
  },
  {
    category: 'product',
    question: "Quelle est la production réelle d'une éolienne domestique ?",
    answer: "La production dépend principalement du vent sur votre site. En moyenne, une Tulipe 3kW produit entre 3000 et 6000 kWh par an selon l'exposition. C'est l'équivalent de 30 à 60% de la consommation d'un foyer moyen. Notre calculateur en ligne vous donne une estimation personnalisée basée sur les données météo de votre commune. N'hésitez pas à nous contacter pour affiner cette estimation."
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
  {
    category: 'installation',
    question: "Comment connecter ma Tulipe à mon installation électrique ?",
    answer: "Rassurez-vous, c'est plus simple qu'il n'y paraît ! L'éolienne se raccorde via un onduleur qui convertit le courant continu en courant alternatif compatible avec votre installation. L'onduleur se connecte ensuite à votre tableau électrique. Un électricien qualifié réalise cette opération en quelques heures. Notre équipe vous accompagne pour trouver un installateur près de chez vous si besoin."
  },
  {
    category: 'installation',
    question: "L'installation nécessite-t-elle de gros travaux ?",
    answer: "Bonne nouvelle : l'installation d'une Tulipe ne nécessite pas de travaux lourds ! Il faut prévoir une fondation béton pour le mât (environ 1m²), le passage d'un câble jusqu'à votre tableau électrique, et c'est tout. Pas besoin de modifier votre toiture ou votre façade. La plupart des installations sont terminées en 1 à 2 jours."
  },
  {
    category: 'installation',
    question: "Puis-je installer l'éolienne sur mon toit ?",
    answer: "Nous déconseillons l'installation sur toiture pour plusieurs raisons : les vibrations peuvent se transmettre à la structure, le vent y est souvent plus turbulent, et l'accès pour la maintenance est compliqué. Un mât au sol ou sur un poteau dédié offre de bien meilleures performances et une durée de vie optimale. Contactez-nous pour étudier ensemble la meilleure implantation sur votre terrain."
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
  {
    category: 'order',
    question: "Quel est le retour sur investissement ?",
    answer: "En moyenne, nos clients amortissent leur installation en 8 à 12 ans, selon leur consommation et le potentiel éolien de leur site. Avec la hausse continue des prix de l'électricité, ce délai tend à se réduire. Et surtout, une fois amorti, vous produisez de l'électricité gratuite pendant encore 15 ans minimum ! Nous pouvons vous faire une simulation personnalisée."
  },
  {
    category: 'order',
    question: "Proposez-vous un service d'installation ?",
    answer: "Oui ! Nous travaillons avec un réseau d'installateurs partenaires formés à nos produits dans toute la France. Vous pouvez aussi choisir votre propre électricien : nous lui fournissons toute la documentation technique nécessaire. Dans tous les cas, notre équipe technique reste joignable pour accompagner l'installation."
  },
  {
    category: 'order',
    question: "Que comprend la garantie ?",
    answer: "Notre garantie est l'une des plus complètes du marché : 5 ans sur les pales et composants mécaniques, 10 ans sur l'alternateur, 2 ans sur l'onduleur. En cas de problème, nous intervenons rapidement. Les pièces détachées sont garanties disponibles pendant 15 ans. Vous êtes entre de bonnes mains !"
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
  {
    category: 'maintenance',
    question: "L'éolienne nécessite-t-elle beaucoup d'entretien ?",
    answer: "Très peu ! Un simple contrôle visuel annuel (état des pales, fixations, câbles) suffit. Pas de lubrification nécessaire grâce aux roulements étanches. Comptez 30 minutes par an. Si vous préférez déléguer, nous proposons des contrats de maintenance à partir de 150€/an."
  },
  {
    category: 'maintenance',
    question: "Que faire si l'éolienne s'arrête de tourner ?",
    answer: "Pas de panique ! Vérifiez d'abord le disjoncteur dédié et l'onduleur. Si tout semble normal, contactez notre support technique : nous pouvons diagnostiquer la plupart des problèmes à distance. En cas de besoin, nous organisons une intervention rapide. Notre taux de panne est inférieur à 2% par an."
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
  },
  {
    category: 'admin',
    question: "Quelles sont les démarches administratives à effectuer ?",
    answer: "On vous accompagne à chaque étape ! Les démarches sont simples : 1) Déclaration préalable en mairie (formulaire Cerfa, nous vous aidons à le remplir), 2) Attestation Consuel après installation (votre électricien s'en charge), 3) Demande de raccordement si vous souhaitez revendre le surplus. Comptez 2 à 3 mois au total. Notre équipe reste disponible pour répondre à vos questions tout au long du processus."
  },
  {
    category: 'admin',
    question: "Faut-il prévenir mes voisins avant d'installer une éolienne ?",
    answer: "Ce n'est pas obligatoire légalement, mais nous vous conseillons d'en discuter avec eux par courtoisie. La plupart des voisins sont curieux et enthousiastes ! Vous pouvez leur montrer notre documentation sur le niveau sonore et l'esthétique. En cas de questions, n'hésitez pas à nous mettre en contact avec eux, nous serons ravis de les rassurer."
  },
  {
    category: 'admin',
    question: "Mon terrain est-il adapté à une éolienne ?",
    answer: "Chaque terrain est unique ! Les critères importants sont : une exposition au vent dominant (généralement ouest/sud-ouest en France), peu d'obstacles à proximité (arbres, bâtiments), et un espace suffisant pour le mât. Notre service de prêt d'anémomètre vous permet de mesurer le vent réel sur votre terrain pendant 1 mois. C'est gratuit et sans engagement. Contactez-nous pour en bénéficier !"
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
      <section className="bg-primary py-4 lg:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Questions fréquentes
            </h1>
            <p className="text-base text-white/90 mb-4">
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
                className="w-full pl-12 pr-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 lg:py-3 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
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
      <section className="py-8 lg:py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune question ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="space-y-3 lg:space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {filteredFAQ.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-4 lg:p-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4 text-sm lg:text-sm">{item.question}</span>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${
                        openItems.includes(index) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openItems.includes(index) && (
                    <div className="px-4 pb-4 lg:px-3 lg:pb-3">
                      <p className="text-gray-600 leading-relaxed text-sm">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 lg:py-6 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3 lg:mb-2">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-gray-600 mb-5 lg:mb-4 text-sm">
            Notre équipe est disponible pour répondre à toutes vos questions 
            et vous accompagner dans votre projet éolien.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/diagnostic"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              Faire un diagnostic gratuit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a
              href="mailto:contact@eolia.fr"
              className="inline-flex items-center justify-center px-5 py-2.5 border-2 border-sky-600 text-sky-600 font-medium rounded-lg hover:bg-sky-50 transition-colors text-sm"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
