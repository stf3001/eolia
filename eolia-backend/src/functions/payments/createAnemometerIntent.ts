import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { createPaymentIntent } from '../../services/stripeService';
import { dynamoDb, Tables } from '../../services/dynamodb';

const ANEMOMETER_CAUTION = 100; // 100€ caution

interface AnemometerIntentRequest {
  amount: number;
  type: 'anemometer_loan';
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

    const body: AnemometerIntentRequest = JSON.parse(event.body);

    // Validate type
    if (body.type !== 'anemometer_loan') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: 'Invalid order type. Expected: anemometer_loan',
        }),
      };
    }

    // Validate amount matches caution
    if (body.amount !== ANEMOMETER_CAUTION) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: `Invalid caution amount. Expected: ${ANEMOMETER_CAUTION}€`,
        }),
      };
    }

    // Validate shipping address
    const { shippingAddress } = body;
    if (!shippingAddress?.firstName || !shippingAddress?.lastName || 
        !shippingAddress?.email || !shippingAddress?.phone ||
        !shippingAddress?.addressLine1 || !shippingAddress?.postalCode || 
        !shippingAddress?.city) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: 'Complete shipping address is required',
        }),
      };
    }

    // Generate order ID
    const orderId = uuidv4();
    const createdAt = Date.now();

    // Create metadata for the payment
    const metadata: Record<string, string> = {
      type: 'anemometer_loan',
      orderId,
      email: shippingAddress.email,
      customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      cautionAmount: ANEMOMETER_CAUTION.toString(),
    };

    // Create the PaymentIntent for caution
    const paymentIntent = await createPaymentIntent(ANEMOMETER_CAUTION, 'eur', metadata);

    // Create pending order in DynamoDB
    const order = {
      orderId,
      createdAt,
      type: 'anemometer_loan',
      status: 'pending_payment',
      totalAmount: ANEMOMETER_CAUTION,
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || '',
        postalCode: shippingAddress.postalCode,
        city: shippingAddress.city,
        country: 'France',
      },
      paymentIntentId: paymentIntent.id,
      loanDetails: {
        loanDuration: 30, // 1 month in days
        cautionAmount: ANEMOMETER_CAUTION,
        prepaidReturnIncluded: true,
      },
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: Tables.ORDERS,
        Item: order,
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId,
      }),
    };
  } catch (error) {
    console.error('Error creating anemometer payment intent:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'INTERNAL_ERROR',
        message: 'Failed to create anemometer loan order',
      }),
    };
  }
};
