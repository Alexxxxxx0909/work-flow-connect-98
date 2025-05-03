
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { 
  registerUser as registerMockUser, 
  loginUser as loginMockUser, 
  logoutUser as logoutMockUser, 
  updateUserProfile as updateMockUserProfile,
  uploadUserPhoto as uploadMockUserPhoto,
  getCurrentUser,
  getUserById
} from "@/lib/mockData";

export type UserType = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  bio?: string;
  skills?: string[];
  role: 'freelancer' | 'client';
  savedJobs?: string[];
  hourlyRate?: number;
  joinedAt?: number;
};

interface AuthContextType {
  currentUser: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserType>) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if a user is already logged in
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error checking current user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await loginMockUser(email, password);
      setCurrentUser(user);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a WorkFlowConnect",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: error instanceof Error ? error.message : "Error al iniciar sesión",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const user = await registerMockUser(email, password, name);
      setCurrentUser(user);
      toast({
        title: "Registro exitoso",
        description: "¡Bienvenido a WorkFlowConnect!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error instanceof Error ? error.message : "Error al registrar",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutMockUser();
      setCurrentUser(null);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cerrar sesión"
      });
    }
  };

  const updateUserProfile = async (data: Partial<UserType>) => {
    if (!currentUser) throw new Error('No hay usuario autenticado');
    
    try {
      await updateMockUserProfile(currentUser.id, data);
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al actualizar el perfil"
      });
      throw error;
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    if (!currentUser) throw new Error('No hay usuario autenticado');
    
    try {
      console.log("Iniciando proceso de subida de foto de perfil");
      const photoURL = await uploadMockUserPhoto(currentUser.id, file);
      
      setCurrentUser(prev => prev ? { ...prev, photoURL } : null);
      
      toast({
        title: "Foto actualizada",
        description: "Tu foto de perfil ha sido actualizada",
      });
      
      console.log("Foto de perfil actualizada correctamente:", photoURL);
      return photoURL;
    } catch (error) {
      console.error("Error en uploadProfilePhoto:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al subir la foto de perfil"
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        loading, 
        login, 
        register, 
        logout,
        updateUserProfile,
        uploadProfilePhoto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
