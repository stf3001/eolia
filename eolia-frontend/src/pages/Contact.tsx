import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      content: '42 Avenue de l\'Innovation',
      detail: '75008 Paris, France'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@eolia-energie.fr',
      detail: 'Réponse sous 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '01 23 45 67 89',
      detail: 'Appel non surtaxé'
    }
  ];

  const hours = [
    { day: 'Lundi - Vendredi', time: '9h00 - 18h00' },
    { day: 'Samedi', time: '10h00 - 16h00' },
    { day: 'Dimanche', time: 'Fermé' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-sky-600 to-sky-800 py-4 lg:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Nous Contacter
          </h1>
          <p className="text-base text-white/90 max-w-3xl mx-auto">
            Notre équipe est à votre écoute pour répondre à toutes vos questions
          </p>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Coordonnées
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plusieurs moyens de nous joindre selon vos préférences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-primary font-semibold text-lg mb-1">
                    {info.content}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {info.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Horaires */}
      <section className="py-8 lg:py-10 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Horaires d'Ouverture
              </h2>
              <p className="text-lg text-gray-600">
                Notre service client est disponible aux horaires suivants
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="space-y-4">
                {hours.map((schedule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-700 font-medium">{schedule.day}</span>
                    <span className={`font-semibold ${schedule.time === 'Fermé' ? 'text-gray-400' : 'text-primary'}`}>
                      {schedule.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Message d'information */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Une Question sur nos Produits ?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Notre équipe d'experts est là pour vous accompagner dans votre projet d'énergie éolienne. 
              N'hésitez pas à nous contacter pour obtenir des conseils personnalisés, un devis gratuit 
              ou des informations sur l'installation.
            </p>
            <div className="bg-primary/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Nous Répondons à Toutes vos Questions
              </h3>
              <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Choix du modèle adapté à vos besoins
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Estimation de production pour votre région
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Conseils d'installation et réglementation
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Financement et aides disponibles
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Service après-vente et maintenance
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
