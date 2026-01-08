import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { cognitoService } from '../../services/cognito';
import { createB2CAffiliate, getAffiliateByCode } from '../../services/affiliateService';

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
    const { email, password, name, role, referralCode } = body;

    // Validation des champs requis
    if (!email || !password || !name) {
      return formatJSONResponse(400, {
        message: 'Champs requis manquants: email, password, name',
      });
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return formatJSONResponse(400, {
        message: 'Format d\'email invalide',
      });
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return formatJSONResponse(400, {
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      });
    }

    if (!/[A-Z]/.test(password)) {
      return formatJSONResponse(400, {
        message: 'Le mot de passe doit contenir au moins une majuscule',
      });
    }

    if (!/[0-9]/.test(password)) {
      return formatJSONResponse(400, {
        message: 'Le mot de passe doit contenir au moins un chiffre',
      });
    }

    // Validation du rôle
    if (role && !['client', 'ambassadeur', 'admin'].includes(role)) {
      return formatJSONResponse(400, {
        message: 'Rôle invalide. Valeurs acceptées: client, ambassadeur, admin',
      });
    }

    // Validation du code parrain si fourni
    let referrerAffiliate = null;
    if (referralCode) {
      referrerAffiliate = await getAffiliateByCode(referralCode.toUpperCase());
      
      if (!referrerAffiliate) {
        return formatJSONResponse(404, {
          message: 'Code parrain invalide',
        });
      }

      if (referrerAffiliate.status !== 'active') {
        return formatJSONResponse(422, {
          message: 'Le code parrain n\'est pas actif',
        });
      }

      // Vérifier auto-parrainage
      if (referrerAffiliate.email.toLowerCase() === email.toLowerCase()) {
        return formatJSONResponse(422, {
          message: 'Vous ne pouvez pas utiliser votre propre code parrain',
        });
      }
    }

    // Inscription Cognito
    const result = await cognitoService.register({
      email,
      password,
      name,
      role: role || 'client',
    });

    // Extraire IP et user-agent pour audit
    const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    const userAgent = event.headers['user-agent'] || 'unknown';
    const timestamp = Date.now();

    // Créer automatiquement l'affiliate B2C (Requirement 6.3, 7.1)
    const affiliate = await createB2CAffiliate(
      {
        userId: result.userSub || email,
        email: result.user.email,
      },
      {
        ip,
        userAgent,
        timestamp,
      }
    );

    return formatJSONResponse(201, {
      message: 'Inscription réussie. Vérifiez votre email pour le code de confirmation.',
      user: result.user,
      affiliate: {
        affiliateId: affiliate.affiliateId,
        code: affiliate.code,
        type: affiliate.type,
      },
      referralCode: referralCode ? referralCode.toUpperCase() : null,
    });
  } catch (error: any) {
    console.error('Error in register:', error);

    if (error.message.includes('UsernameExistsException') || error.message.includes('already exists')) {
      return formatJSONResponse(409, {
        message: 'Un utilisateur avec cet email existe déjà',
      });
    }

    return formatJSONResponse(500, {
      message: error.message || 'Erreur lors de l\'inscription',
    });
  }
};
