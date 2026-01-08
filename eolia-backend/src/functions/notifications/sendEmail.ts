import { APIGatewayProxyHandler } from 'aws-lambda'
import { 
  sendEmail, 
  getWelcomeEmailTemplate, 
  getOrderConfirmationTemplate,
  getAnemometerLoanTemplate 
} from '../../services/emailService'

type EmailType = 'welcome' | 'order_confirmation' | 'anemometer_loan'

interface SendEmailRequest {
  type: EmailType
  to: string
  data: Record<string, unknown>
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      }
    }

    const { type, to, data } = JSON.parse(event.body) as SendEmailRequest

    if (!type || !to || !data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'type, to, and data are required' })
      }
    }

    let template: { subject: string; html: string; text: string }

    switch (type) {
      case 'welcome':
        template = getWelcomeEmailTemplate(data.firstName as string)
        break

      case 'order_confirmation':
        template = getOrderConfirmationTemplate(
          data.firstName as string,
          data.orderId as string,
          data.items as Array<{ name: string; quantity: number; price: number }>,
          data.total as number
        )
        break

      case 'anemometer_loan':
        template = getAnemometerLoanTemplate(
          data.firstName as string,
          data.orderId as string
        )
        break

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Unknown email type: ${type}` })
        }
    }

    await sendEmail({
      to,
      subject: template.subject,
      htmlBody: template.html,
      textBody: template.text
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: `Email ${type} sent to ${to}`
      })
    }

  } catch (error) {
    console.error('Send email error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
