import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAdminCredentials, generateAdminToken } from '../../services/adminAuth';

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
    const { username, password } = body;

    // Validation
    if (!username || !password) {
      return formatJSONResponse(400, {
        message: 'Identifiant et mot de passe requis',
      });
    }

    // Vérification des identifiants
    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      return formatJSONResponse(401, {
        message: 'Identifiants incorrects',
      });
    }

    // Génération du token
    const { token, expiresAt } = generateAdminToken();

    return formatJSONResponse(200, {
      token,
      expiresAt,
    });
  } catch (error: any) {
    console.error('Error in admin auth:', error);

    return formatJSONResponse(500, {
      message: error.message || 'Erreur lors de l\'authentification',
    });
  }
};
