import { FileText } from 'lucide-react';
import { B2B_COMMISSION_TIERS } from '../../types/affiliate';

interface ContractPreviewProps {
  companyName: string;
  siret: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalAddress?: string;
  ambassadorCode: string;
  currentDate: string;
  userIp: string;
  userAgent: string;
}

export default function ContractPreview({
  companyName,
  siret,
  professionalEmail,
  professionalPhone,
  professionalAddress,
  ambassadorCode,
  currentDate,
  userIp,
  userAgent,
}: ContractPreviewProps) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-xl p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-emerald-600 pb-6">
        <div className="flex items-center justify-center mb-4">
          <FileText className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contrat d'Apporteur d'Affaires
        </h1>
        <p className="text-lg text-gray-600">Programme Ambassadeur Professionnel EOLIA</p>
      </div>

      {/* Company information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de l'entreprise</h2>
        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nom de l'entreprise</p>
              <p className="font-semibold text-gray-900">{companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">SIRET</p>
              <p className="font-semibold text-gray-900">{siret}</p>
            </div>
          </div>
          
          {professionalEmail && (
            <div>
              <p className="text-sm text-gray-600">Email professionnel</p>
              <p className="font-semibold text-gray-900">{professionalEmail}</p>
            </div>
          )}
          
          {professionalPhone && (
            <div>
              <p className="text-sm text-gray-600">Téléphone professionnel</p>
              <p className="font-semibold text-gray-900">{professionalPhone}</p>
            </div>
          )}
          
          {professionalAddress && (
            <div>
              <p className="text-sm text-gray-600">Adresse professionnelle</p>
              <p className="font-semibold text-gray-900">{professionalAddress}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-600">Code ambassadeur</p>
            <p className="font-semibold text-emerald-600 text-lg">{ambassadorCode}</p>
          </div>
        </div>
      </div>

      {/* Commission tiers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Grille des commissions</h2>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-4">
            Les commissions sont calculées en fonction du chiffre d'affaires cumulé généré par vos apports :
          </p>
          <div className="space-y-3">
            {B2B_COMMISSION_TIERS.map((tier) => (
              <div key={tier.rate} className="flex justify-between items-center bg-white rounded p-3">
                <span className="text-gray-700">
                  {tier.threshold === 0 
                    ? `CA de 0€ à ${tier.max.toLocaleString('fr-FR')}€`
                    : tier.max === Infinity
                    ? `CA supérieur ou égal à ${tier.threshold.toLocaleString('fr-FR')}€`
                    : `CA de ${tier.threshold.toLocaleString('fr-FR')}€ à ${tier.max.toLocaleString('fr-FR')}€`
                  }
                </span>
                <span className="font-bold text-emerald-600 text-lg">{tier.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* General conditions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Conditions générales</h2>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900">Article 1 - Objet du contrat</h3>
          <p>
            Le présent contrat a pour objet de définir les conditions dans lesquelles l'Apporteur d'Affaires 
            s'engage à recommander les produits et services EOLIA à des clients potentiels, en contrepartie 
            du versement de commissions calculées selon la grille tarifaire ci-dessus.
          </p>

          <h3 className="font-semibold text-gray-900">Article 2 - Obligations de l'Apporteur d'Affaires</h3>
          <p>L'Apporteur d'Affaires s'engage à :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Promouvoir les produits et services EOLIA de manière loyale et conforme à l'image de la marque</li>
            <li>Obtenir le consentement explicite des prospects avant de transmettre leurs coordonnées (RGPD)</li>
            <li>Ne pas utiliser de pratiques commerciales trompeuses ou déloyales</li>
            <li>Respecter la confidentialité des informations commerciales d'EOLIA</li>
          </ul>

          <h3 className="font-semibold text-gray-900">Article 3 - Calcul et versement des commissions</h3>
          <p>
            Les commissions sont calculées sur le montant HT des ventes réalisées par les clients apportés. 
            Le taux de commission applicable est déterminé en fonction du chiffre d'affaires cumulé généré 
            par l'Apporteur d'Affaires depuis le début de sa collaboration avec EOLIA.
          </p>
          <p>
            Les commissions sont versées mensuellement, sous réserve de validation des ventes par EOLIA. 
            Un délai de 30 jours après la livraison et l'encaissement du paiement client est appliqué.
          </p>

          <h3 className="font-semibold text-gray-900">Article 4 - Durée et résiliation</h3>
          <p>
            Le présent contrat est conclu pour une durée indéterminée. Chaque partie peut y mettre fin à tout 
            moment moyennant un préavis de 30 jours par lettre recommandée avec accusé de réception ou email.
          </p>

          <h3 className="font-semibold text-gray-900">Article 5 - Protection des données personnelles</h3>
          <p>
            L'Apporteur d'Affaires s'engage à respecter la réglementation en vigueur relative à la protection 
            des données personnelles (RGPD). Il garantit avoir obtenu le consentement des prospects avant de 
            transmettre leurs coordonnées à EOLIA.
          </p>

          <h3 className="font-semibold text-gray-900">Article 6 - Loi applicable</h3>
          <p>
            Le présent contrat est soumis au droit français. Tout litige relatif à son interprétation ou à 
            son exécution relève de la compétence exclusive des tribunaux français.
          </p>
        </div>
      </div>

      {/* Electronic signature */}
      <div className="border-t-2 border-gray-300 pt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Signature électronique</h2>
        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
          <div>
            <p className="text-sm text-gray-600">Date de signature</p>
            <p className="font-semibold text-gray-900">{currentDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Adresse IP</p>
            <p className="font-mono text-sm text-gray-900">{userIp}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Navigateur</p>
            <p className="font-mono text-xs text-gray-700 break-all">{userAgent}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-600 italic">
              La validation de ce contrat par signature électronique a la même valeur juridique qu'une 
              signature manuscrite conformément à l'article 1367 du Code civil français.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
