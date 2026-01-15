import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FileText, CheckCircle, Clock, AlertCircle, ArrowRight,
  Building2, Zap, ClipboardCheck, Send, Phone
} from 'lucide-react'

export default function ConsuelProcess() {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: 'Déclaration préalable',
      description: 'Déposez une déclaration préalable de travaux en mairie pour les installations < 12m de hauteur.',
      duration: '1 à 2 mois',
      details: [
        'Formulaire Cerfa n°13703*08',
        'Plan de situation et plan de masse',
        'Photos du terrain et des façades',
        'Notice descriptive du projet'
      ]
    },
    {
      number: 2,
      icon: Building2,
      title: 'Demande de raccordement Enedis',
      description: 'Faites votre demande de raccordement au réseau via le portail Enedis Connect.',
      duration: '2 à 6 semaines',
      details: [
        'Créer un compte sur Enedis Connect',
        'Remplir le formulaire de raccordement',
        'Joindre l\'autorisation d\'urbanisme',
        'Recevoir la proposition technique et financière'
      ]
    },
    {
      number: 3,
      icon: Zap,
      title: 'Installation de l\'éolienne',
      description: 'Notre équipe ou votre installateur procède à l\'installation complète.',
      duration: '1 à 3 jours',
      details: [
        'Pose du mât et de l\'éolienne',
        'Installation de l\'onduleur',
        'Câblage et raccordement électrique',
        'Mise en service et tests'
      ]
    },
    {
      number: 4,
      icon: ClipboardCheck,
      title: 'Attestation de conformité',
      description: 'Obtenez l\'attestation de conformité électrique (Consuel).',
      duration: '1 à 2 semaines',
      details: [
        'Remplir le formulaire Consuel (jaune pour production)',
        'Joindre le schéma électrique unifilaire',
        'Payer les frais de dossier (~180€)',
        'Visite de contrôle si nécessaire'
      ]
    },
    {
      number: 5,
      icon: Send,
      title: 'Mise en service',
      description: 'Enedis procède à la mise en service et au raccordement définitif.',
      duration: '2 à 4 semaines',
      details: [
        'Envoi du Consuel à Enedis',
        'Intervention du technicien Enedis',
        'Pose du compteur de production',
        'Activation de l\'injection réseau'
      ]
    }
  ]

  const documents = [
    { name: 'Déclaration préalable de travaux', type: 'Mairie' },
    { name: 'Proposition de raccordement Enedis', type: 'Enedis' },
    { name: 'Attestation de conformité Consuel', type: 'Consuel' },
    { name: 'Contrat d\'achat (si revente)', type: 'EDF OA' },
    { name: 'Attestation d\'assurance', type: 'Assureur' }
  ]


  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-primary/10 py-4 lg:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Raccordement <span className="text-primary">Enedis & Consuel</span>
            </h1>
            <p className="text-base text-gray-600">
              Guide complet des démarches administratives pour raccorder votre éolienne 
              au réseau électrique et obtenir votre attestation de conformité.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les 5 étapes du raccordement
            </h2>
            <p className="text-gray-600">
              Délai total estimé : 3 à 6 mois selon votre situation
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-6">
                  {/* Numéro */}
                  <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center z-10">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.number}. {step.title}
                      </h3>
                      <span className="flex items-center text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4 mr-1" />
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Documents nécessaires */}
      <section className="py-8 lg:py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-gray-900 mb-8"
          >
            Documents à rassembler
          </motion.h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Document</th>
                  <th className="px-6 py-4 text-left font-semibold">Organisme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{doc.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        {doc.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Info importante */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-6"
          >
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  Bon à savoir
                </h3>
                <ul className="space-y-2 text-amber-800 text-sm">
                  <li>• Pour les installations ≤ 3 kWc en autoconsommation totale, le Consuel n'est pas obligatoire</li>
                  <li>• La revente du surplus nécessite un contrat avec EDF OA (Obligation d'Achat)</li>
                  <li>• Les éoliennes de moins de 12m ne nécessitent pas de permis de construire</li>
                  <li>• Certaines zones (ABF, sites classés) peuvent nécessiter des autorisations supplémentaires</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 lg:py-10 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Besoin d'accompagnement ?
            </h2>
            <p className="text-gray-600 mb-6">
              Notre équipe peut vous accompagner dans vos démarches administratives 
              et vous mettre en relation avec des installateurs certifiés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/diagnostic"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Faire un diagnostic
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href="tel:+33123456789"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                Nous contacter
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
