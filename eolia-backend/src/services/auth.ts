import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

export interface UserClaims {
  sub: string;
  email: string;
  name?: string;
  'custom:role'?: string;
  'cognito:username'?: string;
  email_verified?: boolean;
  iss?: string;
  aud?: string;
  token_use?: string;
}

const region = process.env.REGION || 'eu-west-1';
const userPoolId = process.env.USER_POOL_ID;

const jwksUri = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

const client = jwksClient({
  jwksUri,
  cache: true,
  cacheMaxAge: 600000,
});

const getSigningKey = (kid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key?.getPublicKey();
        resolve(signingKey || '');
      }
    });
  });
};

export const verifyToken = async (token: string): Promise<UserClaims> => {
  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    
    if (!decodedHeader || !decodedHeader.header.kid) {
      throw new Error('Token invalide - kid manquant');
    }

    const signingKey = await getSigningKey(decodedHeader.header.kid);

    const decoded = jwt.verify(token, signingKey, {
      algorithms: ['RS256'],
    }) as UserClaims;

    if (!decoded.iss || !decoded.iss.includes('cognito-idp')) {
      throw new Error('Token non émis par Cognito');
    }

    return decoded;
  } catch (error: any) {
    console.error('Error verifying token:', error);
    throw new Error(`Token invalide: ${error.message}`);
  }
};

export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

export const verifyAuth = async (authHeader?: string): Promise<UserClaims> => {
  const token = extractToken(authHeader);

  if (!token) {
    throw new Error('Token manquant - Header Authorization requis');
  }

  const claims = await verifyToken(token);
  return claims;
};

export const getUserRole = (claims: UserClaims): string => {
  return claims['custom:role'] || 'client';
};
