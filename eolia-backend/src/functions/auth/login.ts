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
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return formatJSONResponse(400, {
        message: 'Email et mot de passe requis',
      });
    }

    // Connexion
    const result = await cognitoService.login({ email, password });

    return formatJSONResponse(200, {
      message: 'Connexion réussie',
      tokens: result.tokens,
    });
  } catch (error: any) {
    console.error('Error in login:', error);

    if (error.message.includes('incorrect') || error.message.includes('NotAuthorizedException')) {
      return formatJSONResponse(401, {
        message: 'Email ou mot de passe incorrect',
      });
    }

    if (error.message.includes('confirmer') || error.message.includes('UserNotConfirmedException')) {
      return formatJSONResponse(403, {
        message: 'Veuillez confirmer votre email avant de vous connecter',
      });
    }

    return formatJSONResponse(500, {
      message: error.message || 'Erreur lors de la connexion',
    });
  }
};
