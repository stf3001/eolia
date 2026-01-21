import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAdminAuth } from '../../services/adminAuth';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    const isValid = verifyAdminAuth(authHeader);

    if (!isValid) {
      return formatJSONResponse(401, {
        valid: false,
        message: 'Authentification requise',
      });
    }

    return formatJSONResponse(200, {
      valid: true,
    });
  } catch (error: any) {
    console.error('Error in admin verify:', error);

    return formatJSONResponse(401, {
      valid: false,
      message: 'Session expirée, veuillez vous reconnecter',
    });
  }
};
