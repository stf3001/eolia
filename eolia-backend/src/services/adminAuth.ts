import jwt from 'jsonwebtoken';

export interface AdminTokenPayload {
  type: 'admin';
  iat: number;
  exp: number;
}

const getAdminCredentials = () => ({
  username: process.env.ADMIN_USERNAME || '',
  password: process.env.ADMIN_PASSWORD || '',
});

const getTokenSecret = (): string => {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    throw new Error('ADMIN_TOKEN_SECRET non configuré');
  }
  return secret;
};

/**
 * Vérifie les identifiants admin contre les variables d'environnement
 */
export const verifyAdminCredentials = (username: string, password: string): boolean => {
  const credentials = getAdminCredentials();
  
  if (!credentials.username || !credentials.password) {
    console.error('Admin credentials not configured');
    return false;
  }
  
  return username === credentials.username && password === credentials.password;
};

/**
 * Génère un token JWT admin avec expiration 24h
 */
export const generateAdminToken = (): { token: string; expiresAt: number } => {
  const secret = getTokenSecret();
  const expiresIn = 24 * 60 * 60; // 24 heures en secondes
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
  
  const payload: AdminTokenPayload = {
    type: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: expiresAt,
  };
  
  const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
  
  return {
    token,
    expiresAt: expiresAt * 1000, // Retourner en millisecondes pour le frontend
  };
};

/**
 * Vérifie la validité d'un token admin
 */
export const verifyAdminToken = (token: string): boolean => {
  try {
    const secret = getTokenSecret();
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as AdminTokenPayload;
    
    return decoded.type === 'admin';
  } catch (error) {
    console.error('Admin token verification failed:', error);
    return false;
  }
};

/**
 * Extrait le token du header Authorization
 */
export const extractAdminToken = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Vérifie l'authentification admin complète (header + token)
 */
export const verifyAdminAuth = (authHeader?: string): boolean => {
  const token = extractAdminToken(authHeader);
  
  if (!token) {
    return false;
  }
  
  return verifyAdminToken(token);
};
