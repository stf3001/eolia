import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  getCurrentUser,
  fetchUserAttributes,
  resendSignUpCode,
} from 'aws-amplify/auth'

export interface User {
  userId: string
  email: string
  name: string
  role?: string
  emailVerified?: boolean
}

interface SignUpData {
  email: string
  password: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (data: SignUpData) => Promise<{ isSignUpComplete: boolean; nextStep: string }>
  confirmSignUp: (email: string, code: string) => Promise<void>
  resendCode: (email: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user

  // Check current auth state on mount
  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()

      setUser({
        userId: currentUser.userId,
        email: attributes.email || '',
        name: attributes.name || '',
        role: attributes['custom:role'] || 'customer',
        emailVerified: attributes.email_verified === 'true',
      })
    } catch {
      // User is not authenticated
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await amplifySignIn({
        username: email,
        password,
      })

      if (result.isSignedIn) {
        await checkAuthState()
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        throw new Error('CONFIRM_SIGN_UP_REQUIRED')
      }
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await amplifySignOut()
      setUser(null)
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (data: SignUpData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await amplifySignUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.name,
          },
        },
      })

      return {
        isSignUpComplete: result.isSignUpComplete,
        nextStep: result.nextStep?.signUpStep || 'DONE',
      }
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const confirmSignUp = useCallback(async (email: string, code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await amplifyConfirmSignUp({
        username: email,
        confirmationCode: code,
      })
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resendCode = useCallback(async (email: string) => {
    setError(null)

    try {
      await resendSignUpCode({ username: email })
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        signIn,
        signOut,
        signUp,
        confirmSignUp,
        resendCode,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to translate Cognito errors to French
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message || error.name

    // Map common Cognito errors to French messages
    const errorMap: Record<string, string> = {
      UserNotFoundException: 'Aucun compte trouvé avec cet email',
      NotAuthorizedException: 'Email ou mot de passe incorrect',
      UsernameExistsException: 'Un compte existe déjà avec cet email',
      InvalidPasswordException: 'Le mot de passe ne respecte pas les critères requis',
      CodeMismatchException: 'Code de vérification incorrect',
      ExpiredCodeException: 'Le code de vérification a expiré',
      LimitExceededException: 'Trop de tentatives. Veuillez réessayer plus tard',
      UserNotConfirmedException: 'Veuillez confirmer votre compte',
      CONFIRM_SIGN_UP_REQUIRED: 'Veuillez confirmer votre compte',
    }

    for (const [key, value] of Object.entries(errorMap)) {
      if (message.includes(key)) {
        return value
      }
    }

    return message
  }

  return 'Une erreur inattendue est survenue'
}
