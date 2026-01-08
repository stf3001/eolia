import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  AdminGetUserCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION || 'eu-west-1',
});

const USER_POOL_ID = process.env.USER_POOL_ID || '';
const CLIENT_ID = process.env.USER_POOL_CLIENT_ID || '';

export interface RegisterUserParams {
  email: string;
  password: string;
  name: string;
  role?: 'client' | 'ambassadeur' | 'admin';
}

export interface LoginParams {
  email: string;
  password: string;
}

export const cognitoService = {
  /**
   * Inscription d'un nouvel utilisateur via SignUp (déclenche email de vérification)
   */
  register: async (params: RegisterUserParams) => {
    const { email, password, name, role = 'client' } = params;

    try {
      const signUpCommand = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name },
          { Name: 'custom:role', Value: role },
        ],
      });

      const response = await cognitoClient.send(signUpCommand);

      return {
        success: true,
        message: 'Utilisateur créé avec succès. Vérifiez votre email pour le code de vérification.',
        user: {
          email,
          name,
          role,
        },
        userSub: response.UserSub,
        userConfirmed: response.UserConfirmed,
      };
    } catch (error: any) {
      console.error('Error registering user:', error);
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
  },

  /**
   * Confirmer l'inscription avec le code de vérification
   */
  confirmSignUp: async (email: string, code: string) => {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      });

      await cognitoClient.send(command);

      return {
        success: true,
        message: 'Email vérifié avec succès',
      };
    } catch (error: any) {
      console.error('Error confirming sign up:', error);

      if (error.name === 'CodeMismatchException') {
        throw new Error('Code de vérification invalide');
      }

      if (error.name === 'ExpiredCodeException') {
        throw new Error('Code de vérification expiré');
      }

      throw new Error(error.message || 'Erreur lors de la confirmation');
    }
  },

  /**
   * Connexion d'un utilisateur
   */
  login: async (params: LoginParams) => {
    const { email, password } = params;

    try {
      const command = new AdminInitiateAuthCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const response = await cognitoClient.send(command);

      if (!response.AuthenticationResult) {
        throw new Error('Échec de l\'authentification');
      }

      return {
        success: true,
        tokens: {
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
          refreshToken: response.AuthenticationResult.RefreshToken,
          expiresIn: response.AuthenticationResult.ExpiresIn,
        },
      };
    } catch (error: any) {
      console.error('Error logging in:', error);

      if (error.name === 'NotAuthorizedException') {
        throw new Error('Email ou mot de passe incorrect');
      }

      if (error.name === 'UserNotConfirmedException') {
        throw new Error('Veuillez confirmer votre email avant de vous connecter');
      }

      throw new Error(error.message || 'Erreur lors de la connexion');
    }
  },

  /**
   * Récupérer les informations d'un utilisateur
   */
  getUser: async (username: string) => {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
      });

      const response = await cognitoClient.send(command);

      const attributes = response.UserAttributes?.reduce((acc, attr) => {
        if (attr.Name && attr.Value) {
          acc[attr.Name] = attr.Value;
        }
        return acc;
      }, {} as Record<string, string>);

      return {
        username: response.Username,
        email: attributes?.email,
        name: attributes?.name,
        role: attributes?.['custom:role'] || 'client',
        emailVerified: attributes?.email_verified === 'true',
        enabled: response.Enabled,
        userStatus: response.UserStatus,
        createdAt: response.UserCreateDate,
      };
    } catch (error: any) {
      console.error('Error getting user:', error);
      throw new Error(error.message || 'Erreur lors de la récupération de l\'utilisateur');
    }
  },
};

export { cognitoClient, USER_POOL_ID, CLIENT_ID };
