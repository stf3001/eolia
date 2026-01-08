import { Link } from 'react-router-dom'

export default function CGV() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Conditions Générales de Vente
      </h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-gray-500 mb-8">
          Dernière mise à jour : Janvier 2026
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 1 - Objet</h2>
          <p className="text-gray-600 mb-4">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles 
            entre la société EOLIA SAS et ses clients, dans le cadre de la vente d'éoliennes domestiques, 
            d'accessoires et de services associés via le site eolia.fr.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 2 - Produits et services</h2>
          <p className="text-gray-600 mb-4">
            EOLIA propose à la vente :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Des éoliennes verticales de la gamme Tulipe (1 à 10 kWc)</li>
            <li>Des onduleurs hybrides compatibles (IMEON, Fronius)</li>
            <li>Des accessoires et pièces détachées</li>
            <li>Des forfaits d'installation</li>
            <li>Un service de prêt d'anémomètre</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 3 - Prix</h2>
          <p className="text-gray-600 mb-4">
            Les prix sont indiqués en euros TTC. EOLIA se réserve le droit de modifier ses prix 
            à tout moment, les produits étant facturés sur la base des tarifs en vigueur au moment 
            de la validation de la commande.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 4 - Commande</h2>
          <p className="text-gray-600 mb-4">
            La validation de la commande implique l'acceptation des présentes CGV. Un email de 
            confirmation est envoyé au client récapitulant les détails de sa commande.
          </p>
          <p className="text-gray-600 mb-4">
            Pour les installations dépassant 36 kWc cumulés, une étude personnalisée est requise. 
            Le client est invité à contacter notre service commercial.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 5 - Paiement</h2>
          <p className="text-gray-600 mb-4">
            Le paiement s'effectue par carte bancaire via notre prestataire sécurisé Stripe. 
            Le paiement en plusieurs fois (3x ou 4x sans frais) est disponible pour les commandes 
            supérieures à 500€.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 6 - Livraison</h2>
          <p className="text-gray-600 mb-4">
            Les délais de livraison sont donnés à titre indicatif. Les produits en stock sont 
            expédiés sous 5 à 10 jours ouvrés. Les produits sur commande nécessitent 4 à 6 semaines.
          </p>
          <p className="text-gray-600 mb-4">
            La livraison s'effectue à l'adresse indiquée lors de la commande. Le client doit 
            vérifier l'état des colis à réception et émettre des réserves si nécessaire.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 7 - Droit de rétractation</h2>
          <p className="text-gray-600 mb-4">
            Conformément à l'article L221-18 du Code de la consommation, le client dispose d'un 
            délai de 14 jours à compter de la réception des produits pour exercer son droit de 
            rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
          <p className="text-gray-600 mb-4">
            Les produits sur mesure ou personnalisés sont exclus du droit de rétractation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 8 - Garanties</h2>
          <p className="text-gray-600 mb-4">
            Nos produits bénéficient des garanties suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Garantie légale de conformité (2 ans)</li>
            <li>Garantie constructeur pales et mécanique (5 ans)</li>
            <li>Garantie alternateur (10 ans)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 9 - Conditions suspensives</h2>
          <p className="text-gray-600 mb-4">
            La vente est conclue sous réserve de l'obtention des autorisations administratives 
            nécessaires (déclaration préalable de travaux, raccordement Enedis). En cas de refus, 
            le client peut demander l'annulation de sa commande et le remboursement intégral.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 10 - Litiges</h2>
          <p className="text-gray-600 mb-4">
            Les présentes CGV sont soumises au droit français. En cas de litige, une solution 
            amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux 
            compétents seront ceux du siège social d'EOLIA.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t">
          <Link to="/" className="text-primary hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
