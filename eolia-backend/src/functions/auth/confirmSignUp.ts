import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { cognitoService } from '../../services/cognito';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return formatJSONResponse(400, {
        message: 'Corps de la requête manquant',
      });
    }

    const body = JSON.parse(event.body);
    const { email, code } = body;

    // Validation
    if (!email || !code) {
      return formatJSONResponse(400, {
        message: 'Champs requis manquants: email, code',
      });
    }

    // Confirmer l'inscription
    const result = await cognitoService.confirmSignUp(email, code);

    return formatJSONResponse(200, result);
  } catch (error: any) {
    console.error('Error in confirmSignUp:', error);

    if (error.message.includes('invalide')) {
      return formatJSONResponse(400, {
        message: 'Code de vérification invalide',
      });
    }

    if (error.message.includes('expiré')) {
      return formatJSONResponse(400, {
        message: 'Code de vérification expiré',
      });
    }

    return formatJSONResponse(400, {
      message: error.message || 'Erreur lors de la confirmation',
    });
  }
};
