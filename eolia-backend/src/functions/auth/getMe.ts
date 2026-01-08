import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { cognitoService } from '../../services/cognito';
import jwt from 'jsonwebtoken';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Extraire le header Authorization
    const authHeader = event.headers?.Authorization || event.headers?.authorization;

    if (!authHeader) {
      return formatJSONResponse(401, {
        message: 'Token manquant - Header Authorization requis',
      });
    }

    // Extraire le token (format: "Bearer <token>")
    const token = authHeader.replace('Bearer ', '').replace('bearer ', '');

    if (!token) {
      return formatJSONResponse(401, {
        message: 'Token invalide',
      });
    }

    // Vérifier et valider le token JWT
    await verifyAuth(authHeader);

    // Décoder le token pour extraire les informations
    const decoded = jwt.decode(token) as any;

    if (!decoded || !decoded.sub) {
      return formatJSONResponse(401, {
        message: 'Token invalide - sub manquant',
      });
    }

    const userId = decoded.sub;
    const userIdentifier = decoded.email || decoded['cognito:username'] || decoded.username;

    if (!userIdentifier) {
      return formatJSONResponse(401, {
        message: 'Identifiant utilisateur manquant dans le token',
      });
    }

    // Récupérer les détails complets depuis Cognito
    const user = await cognitoService.getUser(userIdentifier);

    return formatJSONResponse(200, {
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        enabled: user.enabled,
        userStatus: user.userStatus,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error in getMe:', error);

    // Erreur d'authentification
    if (error.message.includes('Token') || error.message.includes('jwt')) {
      return formatJSONResponse(401, {
        message: error.message,
      });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des informations utilisateur',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
