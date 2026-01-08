import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { createPaymentIntent } from '../../services/stripeService';

interface PaymentIntentRequest {
  amount: number;
  items?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  installationDetails?: {
    installationType: 'mono' | 'tri';
    meterPower: number;
    tgbtDistance: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    city: string;
  };
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  };

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: 'Request body is required',
        }),
      };
    }

    const body: PaymentIntentRequest = JSON.parse(event.body);

    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: 'Amount must be greater than 0',
        }),
      };
    }

    if (!body.shippingAddress?.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: 'Shipping address with email is required',
        }),
      };
    }

    // Create metadata for the payment
    const metadata: Record<string, string> = {
      type: 'standard_order',
      email: body.shippingAddress.email,
      customerName: `${body.shippingAddress.firstName} ${body.shippingAddress.lastName}`,
    };

    if (body.items) {
      metadata.itemCount = body.items.length.toString();
    }

    if (body.installationDetails) {
      metadata.installationType = body.installationDetails.installationType;
      metadata.tgbtDistance = body.installationDetails.tgbtDistance;
    }

    // Create the PaymentIntent
    const paymentIntent = await createPaymentIntent(body.amount, 'eur', metadata);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'INTERNAL_ERROR',
        message: 'Failed to create payment intent',
      }),
    };
  }
};
