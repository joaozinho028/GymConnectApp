import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
interface User {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  data_nascimento?: string;
  genero?: string;
  foto_perfil?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  data_nascimento?: string;
  genero?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Configuração da API
const API_URL = 'http://192.168.1.69:3000/api'; // IP da máquina local para React Native

// Context
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há token salvo ao iniciar o app
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@GymConnect:token');
      const storedUser = await AsyncStorage.getItem('@GymConnect:user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const { access_token: authToken, usuario } = data.data;

        // Salvar no estado
        setToken(authToken);
        setUser(usuario);

        // Salvar no AsyncStorage
        await AsyncStorage.setItem('@GymConnect:token', authToken);
        await AsyncStorage.setItem('@GymConnect:user', JSON.stringify(usuario));

        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || 'Erro ao fazer login. Verifique suas credenciais.',
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: userData.nome,
          email: userData.email.toLowerCase().trim(),
          password: userData.senha,
          telefone: userData.telefone,
          data_nascimento: userData.data_nascimento,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        return { success: true, message: 'Conta criada com sucesso!' };
      } else {
        return {
          success: false,
          message: data.message || 'Erro ao criar conta. Tente novamente.',
        };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Limpar estado
      setUser(null);
      setToken(null);

      // Limpar AsyncStorage
      await AsyncStorage.multiRemove(['@GymConnect:token', '@GymConnect:user']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
