import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Award,
  MapPin,
  Shield,
  CheckCircle,
  Calculator,
  MessageCircle,
  Clock,
  Wrench,
  GraduationCap,
  FileCheck,
  Phone,
  Mail,
  Building,
  Star,
  Zap,
  ClipboardCheck,
} from 'lucide-react';

/**
 * Page détaillée du partenaire Réseau Installateurs
 * Présente le réseau d'électriciens certifiés, les critères de sélection et les garanties
 * Requirements: 4.2, 4.3, 4.4, 4.5, 8.1, 8.2, 8.3, 8.4, 8.5
 */
export default function InstallersDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Gradient violet */}
      <section className="relative bg-gradient-to-br from-violet-600 to-violet-500 text-white py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Bouton retour */}
          <Link
            to="/partenaires"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux partenaires
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Réseau d'électriciens certifiés
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Réseau Installateurs</h1>
              <p className="text-xl text-violet-100 mb-6">
                Des professionnels certifiés près de chez vous
              </p>
              <p className="text-violet-100 leading-relaxed">
                EOLIA a constitué un réseau d'électriciens qualifiés et formés 
                spécifiquement à l'installation d'éoliennes verticales. Chaque 
                installateur partenaire est sélectionné selon des critères stricts 
                pour garantir une installation dans les règles de l'art et un 
                service après-vente réactif.
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">100+</p>
                <p className="text-violet-100 text-sm">Installateurs certifiés</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">France</p>
                <p className="text-violet-100 text-sm">Couverture nationale</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">48h</p>
                <p className="text-violet-100 text-sm">Intervention SAV</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold mb-2">10 ans</p>
                <p className="text-violet-100 text-sm">Garantie décennale</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section Notre réseau */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Un réseau de confiance partout en France
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  EOLIA a sélectionné des <span className="font-semibold text-gray-900">électriciens qualifiés</span> dans 
                  toutes les régions de France pour vous garantir une installation 
                  professionnelle et un service de proximité.
                </p>
                <p>
                  Chaque installateur partenaire a suivi une <span className="font-semibold text-gray-900">formation spécifique 
                  de 2 jours</span> sur les éoliennes verticales Tulipe, leurs spécificités 
                  techniques et les bonnes pratiques d'installation.
                </p>
                <p>
                  Notre réseau s'engage sur la qualité : <span className="font-semibold text-gray-900">garantie décennale</span>, 
                  intervention SAV sous 48h, et suivi personnalisé de votre installation.
                </p>
              </div>
            </div>

            {/* Caractéristiques clés */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Couverture nationale</h3>
                <p className="text-sm text-gray-600">
                  Installateurs dans toutes les régions
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Formation EOLIA</h3>
                <p className="text-sm text-gray-600">
                  2 jours de formation certifiée
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Garantie décennale</h3>
                <p className="text-sm text-gray-600">
                  Assurance vérifiée et valide
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">SAV réactif</h3>
                <p className="text-sm text-gray-600">
                  Intervention sous 48h garantie
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Critères de sélection */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Critères de sélection stricts
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chaque installateur partenaire EOLIA est sélectionné selon des critères 
              rigoureux pour vous garantir une installation de qualité professionnelle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Qualification professionnelle</h3>
              <p className="text-sm text-gray-600">
                QualiPV, Qualit'EnR ou équivalent. Certification obligatoire 
                pour rejoindre le réseau EOLIA.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expérience minimum 5 ans</h3>
              <p className="text-sm text-gray-600">
                Au moins 5 années d'expérience dans l'installation 
                électrique et les énergies renouvelables.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Formation EOLIA obligatoire</h3>
              <p className="text-sm text-gray-600">
                Formation de 2 jours sur les éoliennes Tulipe, 
                leurs spécificités et les bonnes pratiques.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assurance décennale vérifiée</h3>
              <p className="text-sm text-gray-600">
                Attestation d'assurance décennale contrôlée 
                et validée par EOLIA chaque année.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Section Ce que comprend l'installation */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ce que comprend l'installation
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nos installateurs partenaires assurent une prestation complète, 
                de l'étude de faisabilité à la mise en service, pour une installation 
                clé en main de votre éolienne Tulipe.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Étude de faisabilité sur site
                    </h3>
                    <p className="text-sm text-gray-600">
                      Visite technique pour évaluer l'emplacement optimal, 
                      les contraintes et le potentiel éolien de votre terrain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Montage du mât et de l'éolienne
                    </h3>
                    <p className="text-sm text-gray-600">
                      Installation professionnelle du mât, fixation de l'éolienne 
                      et mise en place de tous les éléments mécaniques.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Raccordement électrique complet
                    </h3>
                    <p className="text-sm text-gray-600">
                      Câblage, raccordement à l'onduleur, connexion au tableau 
                      électrique et au réseau selon les normes en vigueur.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Mise en service et tests
                    </h3>
                    <p className="text-sm text-gray-600">
                      Vérification complète de l'installation, tests de fonctionnement 
                      et paramétrage de l'onduleur pour des performances optimales.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Formation utilisateur
                    </h3>
                    <p className="text-sm text-gray-600">
                      Explication du fonctionnement, utilisation de l'application 
                      de monitoring et conseils d'entretien.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustration étapes */}
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Les étapes de votre installation
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Prise de contact et étude de votre projet
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Visite technique et devis personnalisé
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Installation complète en 1 à 2 jours
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <p className="text-sm text-gray-700">
                    Mise en service et formation utilisateur
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    5
                  </div>
                  <p className="text-sm text-gray-700">
                    Suivi et SAV pendant toute la durée de vie
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section Garanties */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Garanties & Service Après-Vente
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nos installateurs partenaires s'engagent sur la qualité de leur 
                travail avec des garanties solides et un service après-vente réactif.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Garantie décennale sur l'installation
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tous nos installateurs disposent d'une assurance décennale 
                      couvrant les travaux d'installation pendant 10 ans.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      SAV sous 48h en cas de problème
                    </h3>
                    <p className="text-sm text-gray-600">
                      En cas de dysfonctionnement, un technicien intervient 
                      sous 48h maximum pour diagnostiquer et résoudre le problème.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Maintenance annuelle optionnelle
                    </h3>
                    <p className="text-sm text-gray-600">
                      Contrat de maintenance préventive disponible pour assurer 
                      le bon fonctionnement de votre installation sur le long terme.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Hotline technique dédiée
                    </h3>
                    <p className="text-sm text-gray-600">
                      Une ligne téléphonique dédiée pour répondre à toutes 
                      vos questions techniques et vous accompagner.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagements qualité */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Nos engagements qualité
              </h3>
              <p className="text-gray-600 mb-6">
                Le réseau d'installateurs EOLIA s'engage sur des standards 
                de qualité élevés pour votre satisfaction.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0" />
                  <span className="text-gray-700">Installation conforme aux normes NF C 15-100</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0" />
                  <span className="text-gray-700">Certificat de conformité Consuel</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0" />
                  <span className="text-gray-700">Rapport de mise en service détaillé</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0" />
                  <span className="text-gray-700">Documentation complète fournie</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0" />
                  <span className="text-gray-700">Satisfaction client suivie par EOLIA</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-600">
                  Note moyenne de satisfaction : <span className="font-semibold text-gray-900">4.8/5</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section Demander un devis / Contact */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Demander un devis d'installation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Contactez-nous pour être mis en relation avec un installateur 
              certifié EOLIA près de chez vous. Devis gratuit et sans engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 text-center border border-violet-200">
              <div className="w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Par téléphone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Appelez-nous du lundi au vendredi de 9h à 18h
              </p>
              <a 
                href="tel:+33123456789" 
                className="text-violet-600 font-semibold hover:text-violet-700 transition-colors"
              >
                01 23 45 67 89
              </a>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 text-center border border-violet-200">
              <div className="w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Par email</h3>
              <p className="text-sm text-gray-600 mb-4">
                Réponse garantie sous 24h ouvrées
              </p>
              <a 
                href="mailto:installation@eolia.fr" 
                className="text-violet-600 font-semibold hover:text-violet-700 transition-colors"
              >
                installation@eolia.fr
              </a>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 text-center border border-violet-200">
              <div className="w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Formulaire en ligne</h3>
              <p className="text-sm text-gray-600 mb-4">
                Décrivez votre projet et recevez un devis personnalisé
              </p>
              <Link 
                to="/contact" 
                className="text-violet-600 font-semibold hover:text-violet-700 transition-colors"
              >
                Remplir le formulaire
              </Link>
            </div>
          </div>

          <div className="mt-10 bg-gray-50 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Rappel sous 24h
                </h3>
                <p className="text-sm text-gray-600">
                  Après votre demande, un conseiller EOLIA vous rappelle sous 24h 
                  pour discuter de votre projet et vous mettre en relation avec 
                  l'installateur le plus proche de chez vous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-12 lg:py-16 bg-violet-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à installer votre éolienne ?
          </h2>
          <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
            Nos installateurs certifiés sont prêts à vous accompagner dans votre 
            projet d'autonomie énergétique. Demandez un devis gratuit dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculateur"
              className="inline-flex items-center justify-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Calculer ma production
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
