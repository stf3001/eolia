import { Shield, Award, Zap, CheckCircle, FileText, AlertTriangle, Home, Users } from 'lucide-react';

// Constantes pour le contenu textuel
const forfaitFeatures = [
  {
    icon: Shield,
    title: 'Partenaire certifié RGE',
    description: 'Installation par un professionnel certifié RGE avec assurance décennale obligatoire.',
  },
  {
    icon: Users,
    title: 'Encadrement EOLIA',
    description: 'Nos partenaires sont formés et encadrés par EOLIA pour garantir une qualité optimale.',
  },
  {
    icon: Zap,
    title: 'Raccordement TGBT',
    description: 'Raccordement au tableau électrique dans les règles de l\'art par un électricien qualifié.',
  },
  {
    icon: CheckCircle,
    title: 'Mise en service complète',
    description: 'Configuration, tests et formation à l\'utilisation de votre installation.',
  },
];

const demarchesAdmin = [
  {
    icon: FileText,
    title: 'Raccordement Enedis',
    description: 'Nous effectuons la demande de raccordement auprès d\'Enedis pour votre installation.',
  },
  {
    icon: Award,
    title: 'Contrat revente surplus',
    description: 'Assistance pour la mise en place de votre contrat de revente du surplus d\'électricité.',
  },
  {
    icon: CheckCircle,
    title: 'Visite Consuel',
    description: 'Demande de visite de conformité Consuel pour valider votre installation.',
  },
];

export default function InstallationInfoBanner() {
  return (
    <div className="mb-8 space-y-6">
      {/* Section principale */}
      <div className="bg-emerald-50 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          🔧 Nos forfaits pose : un accompagnement complet
        </h2>

        {/* Explication des forfaits par distance */}
        <p className="text-gray-600 text-sm text-center mb-6 max-w-5xl mx-auto">
          Nos forfaits varient selon la distance entre l'éolienne et votre tableau électrique : 
          celle-ci impacte directement le dimensionnement des câbles et accessoires nécessaires. 
          EOLIA a fait le choix de forfaits clairs pour vous permettre d'évaluer facilement le coût total. 
          Après commande, vous compléterez les informations requises et notre bureau d'études validera votre projet.
        </p>

        {/* Ce que comprend le forfait */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ce que comprend votre forfait
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {forfaitFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Démarches administratives */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Démarches administratives incluses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demarchesAdmin.map((demarche, index) => {
              const Icon = demarche.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {demarche.title}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1">
                      {demarche.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Encadré mise à la terre - Style warning ambre */}
      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">
              À savoir : Vérification de la mise à la terre
            </h4>
            <div className="text-amber-900 text-sm space-y-2">
              <p>
                Le jour de l'installation, notre technicien vérifiera la qualité de votre mise à la terre. 
                Pour une mise en service immédiate, la résistance de terre doit être <strong>inférieure à 100 ohms</strong>.
              </p>
              <p>
                Si la terre n'est pas conforme, le technicien vous fournira la valeur mesurée ainsi que des 
                préconisations pour corriger le problème. La mise en service sera effectuée dès que la terre sera conforme.
              </p>
              <p className="font-medium">
                💡 La mise à la terre est une obligation de sécurité vitale pour toute installation électrique, 
                indépendamment de l'éolienne, et est requise pour l'obtention du Consuel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Encadré conseil assurance - Style info bleu */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-5">
        <div className="flex items-start gap-3">
          <Home className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">
              Conseil : Pensez à informer votre assureur
            </h4>
            <p className="text-blue-900 text-sm">
              Comme pour l'installation de panneaux solaires, nous vous recommandons d'informer votre assureur 
              habitation de l'ajout de votre éolienne. Cette démarche simple permet de garantir une couverture 
              optimale de votre nouveau matériel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
