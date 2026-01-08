import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({ region: process.env.AWS_REGION || 'eu-west-1' })

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@eolia.fr'
const COMPANY_NAME = 'EOLIA'

interface EmailParams {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
}

export async function sendEmail({ to, subject, htmlBody, textBody }: EmailParams): Promise<void> {
  const command = new SendEmailCommand({
    Source: `${COMPANY_NAME} <${FROM_EMAIL}>`,
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8'
        },
        ...(textBody && {
          Text: {
            Data: textBody,
            Charset: 'UTF-8'
          }
        })
      }
    }
  })

  await ses.send(command)
}

// Templates d'emails
export function getWelcomeEmailTemplate(firstName: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Bienvenue chez EOLIA ! 🌬️',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #065f46; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #065f46; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue chez EOLIA</h1>
          </div>
          <div class="content">
            <p>Bonjour ${firstName},</p>
            <p>Nous sommes ravis de vous accueillir dans la communauté EOLIA !</p>
            <p>Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
            <ul>
              <li>Calculer votre production éolienne potentielle</li>
              <li>Commander nos éoliennes Tulipe</li>
              <li>Suivre vos commandes</li>
              <li>Devenir ambassadeur et parrainer vos proches</li>
            </ul>
            <a href="https://eolia.fr/calculateur" class="button">Calculer ma production</a>
            <p>À bientôt,<br>L'équipe EOLIA</p>
          </div>
          <div class="footer">
            <p>EOLIA SAS - Éoliennes domestiques verticales</p>
            <p><a href="https://eolia.fr">eolia.fr</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bienvenue chez EOLIA !

Bonjour ${firstName},

Nous sommes ravis de vous accueillir dans la communauté EOLIA !

Votre compte a été créé avec succès. Vous pouvez maintenant :
- Calculer votre production éolienne potentielle
- Commander nos éoliennes Tulipe
- Suivre vos commandes
- Devenir ambassadeur et parrainer vos proches

Rendez-vous sur https://eolia.fr/calculateur pour estimer votre production.

À bientôt,
L'équipe EOLIA
    `
  }
}


export function getOrderConfirmationTemplate(
  firstName: string,
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
): { subject: string; html: string; text: string } {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} €</td>
    </tr>
  `).join('')

  const itemsText = items.map(item => 
    `- ${item.name} x${item.quantity} : ${item.price.toFixed(2)} €`
  ).join('\n')

  return {
    subject: `Confirmation de commande #${orderId} - EOLIA`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #065f46; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-table th { background: #065f46; color: white; padding: 12px; text-align: left; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          .button { display: inline-block; background: #065f46; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .info-box { background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Commande confirmée !</h1>
            <p>N° ${orderId}</p>
          </div>
          <div class="content">
            <p>Bonjour ${firstName},</p>
            <p>Merci pour votre commande ! Nous l'avons bien reçue et elle est en cours de traitement.</p>
            
            <h3>Récapitulatif de votre commande</h3>
            <table class="order-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: center;">Qté</th>
                  <th style="text-align: right;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <p class="total">Total : ${total.toFixed(2)} € TTC</p>
            
            <div class="info-box">
              <strong>📦 Prochaines étapes :</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Préparation de votre commande sous 2-3 jours</li>
                <li>Email de confirmation d'expédition avec suivi</li>
                <li>Livraison sous 5-10 jours ouvrés</li>
              </ul>
            </div>
            
            <a href="https://eolia.fr/espace-client" class="button">Suivre ma commande</a>
            
            <p>Une question ? Contactez-nous à support@eolia.fr</p>
            <p>À bientôt,<br>L'équipe EOLIA</p>
          </div>
          <div class="footer">
            <p>EOLIA SAS - Éoliennes domestiques verticales</p>
            <p><a href="https://eolia.fr">eolia.fr</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Commande confirmée !

Bonjour ${firstName},

Merci pour votre commande n° ${orderId} !

Récapitulatif :
${itemsText}

Total : ${total.toFixed(2)} € TTC

Prochaines étapes :
- Préparation sous 2-3 jours
- Email de confirmation d'expédition avec suivi
- Livraison sous 5-10 jours ouvrés

Suivez votre commande sur https://eolia.fr/espace-client

Une question ? Contactez-nous à support@eolia.fr

L'équipe EOLIA
    `
  }
}

export function getAnemometerLoanTemplate(
  firstName: string,
  orderId: string
): { subject: string; html: string; text: string } {
  return {
    subject: `Prêt d'anémomètre confirmé #${orderId} - EOLIA`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #065f46; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #065f46; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .info-box { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .steps { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .step { display: flex; margin-bottom: 15px; }
          .step-number { background: #065f46; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌬️ Anémomètre en route !</h1>
          </div>
          <div class="content">
            <p>Bonjour ${firstName},</p>
            <p>Votre demande de prêt d'anémomètre a été confirmée. Vous allez recevoir votre kit de mesure sous 3-5 jours ouvrés.</p>
            
            <div class="steps">
              <h3>Comment ça marche ?</h3>
              <div class="step">
                <div class="step-number">1</div>
                <div>
                  <strong>Réception</strong><br>
                  Installez l'anémomètre à l'emplacement prévu pour votre éolienne
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div>
                  <strong>Mesure</strong><br>
                  Laissez l'appareil enregistrer pendant 1 mois minimum
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div>
                  <strong>Retour</strong><br>
                  Renvoyez l'anémomètre avec le bon de retour prépayé inclus
                </div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div>
                  <strong>Analyse</strong><br>
                  Utilisez vos données dans notre calculateur pour une estimation précise
                </div>
              </div>
            </div>
            
            <div class="info-box">
              <strong>⚠️ Important :</strong> La caution de 100€ sera remboursée à réception de l'anémomètre en bon état.
            </div>
            
            <a href="https://eolia.fr/calculateur" class="button">Accéder au calculateur</a>
            
            <p>Des questions ? Contactez-nous à support@eolia.fr</p>
            <p>À bientôt,<br>L'équipe EOLIA</p>
          </div>
          <div class="footer">
            <p>EOLIA SAS - Éoliennes domestiques verticales</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Anémomètre en route !

Bonjour ${firstName},

Votre demande de prêt d'anémomètre a été confirmée.
Vous allez recevoir votre kit de mesure sous 3-5 jours ouvrés.

Comment ça marche ?
1. Installez l'anémomètre à l'emplacement prévu
2. Laissez l'appareil enregistrer pendant 1 mois minimum
3. Renvoyez avec le bon de retour prépayé inclus
4. Utilisez vos données dans notre calculateur

Important : La caution de 100€ sera remboursée à réception de l'anémomètre en bon état.

Des questions ? Contactez-nous à support@eolia.fr

L'équipe EOLIA
    `
  }
}
