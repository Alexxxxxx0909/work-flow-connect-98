
/**
 * Chat Context Provider
 * 
 * This file manages all the chat functionality including:
 * - Chat data management from local storage
 * - Sending and receiving messages
 * - Creating new chats
 * - Managing active chat state
 */

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  getChats as getMockChats,
  createChat as createMockChat,
  sendMessage as sendMockMessage,
  addParticipantToChat as addMockParticipantToChat
} from '@/lib/mockData';
import { toast } from '@/components/ui/use-toast';

// Type definitions for messages and chats
export type MessageType = {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
};

export type ChatType = {
  id: string;
  name: string; // For group chats
  participants: string[]; // User IDs
  messages: MessageType[];
  isGroup: boolean;
  lastMessage?: MessageType;
};

// Chat context interface defining available functions and state
interface ChatContextType {
  chats: ChatType[];
  activeChat: ChatType | null;
  setActiveChat: (chat: ChatType | null) => void;
  sendMessage: (chatId: string, content: string) => void;
  createChat: (participantIds: string[], name?: string) => void;
  createPrivateChat: (participantId: string) => Promise<void>;
  getChat: (chatId: string) => ChatType | undefined;
  loadingChats: boolean;
  onlineUsers: string[]; // Online user IDs
  loadChats: () => Promise<void>;
  addParticipantToChat: (chatId: string, participantId: string) => Promise<boolean>;
  findExistingPrivateChat: (participantId: string) => ChatType | undefined;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Mock online users - in a real app this would come from a presence system
const MOCK_ONLINE_USERS = ['user1', 'user2', 'user3'];

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChat, setActiveChat] = useState<ChatType | null>(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [onlineUsers] = useState<string[]>(MOCK_ONLINE_USERS);

  /**
   * Function to find an existing private chat with a specific user
   * Used to prevent duplicate chat creation
   */
  const findExistingPrivateChat = (participantId: string): ChatType | undefined => {
    if (!currentUser) return undefined;
    
    return chats.find(
      chat => !chat.isGroup && 
      chat.participants.length === 2 && 
      chat.participants.includes(currentUser.id) && 
      chat.participants.includes(participantId)
    );
  };

  /**
   * Function to load all chats
   */
  const loadChats = async () => {
    if (!currentUser) {
      setChats([]);
      setLoadingChats(false);
      return;
    }
  
    setLoadingChats(true);
    try {
      console.log("Cargando chats para el usuario:", currentUser.id);
      const userChats = await getMockChats(currentUser.id);
      setChats(userChats);
      console.log("Chats cargados:", userChats.length);
    } catch (error) {
      console.error("Error al cargar chats:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los chats. Por favor, inténtalo de nuevo."
      });
    } finally {
      setLoadingChats(false);
    }
  };

  /**
   * Effect to reload chats when the user changes
   */
  useEffect(() => {
    console.log("Usuario cambiado, cargando chats...");
    loadChats();
  }, [currentUser]);

  /**
   * Helper function to get a specific chat by ID
   */
  const getChat = (chatId: string) => {
    return chats.find(chat => chat.id === chatId);
  };

  /**
   * Function to send messages
   */
  const sendMessage = async (chatId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    
    try {
      console.log("Enviando mensaje:", { chatId, content });
      const newMessage = await sendMockMessage(chatId, currentUser.id, content);
      console.log("Mensaje enviado correctamente:", newMessage);
      
      // Update local state
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage
            };
          }
          return chat;
        });
      });
      
      // Update active chat if this is the current chat
      if (activeChat?.id === chatId) {
        setActiveChat(prevChat => {
          if (!prevChat) return null;
          return {
            ...prevChat,
            messages: [...prevChat.messages, newMessage],
            lastMessage: newMessage
          };
        });
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, inténtalo de nuevo."
      });
    }
  };

  /**
   * Function to create a chat (can be group or 1:1)
   */
  const createChat = async (participantIds: string[], name = '') => {
    if (!currentUser) return;
    
    // Ensure current user is included
    if (!participantIds.includes(currentUser.id)) {
      participantIds.push(currentUser.id);
    }
    
    try {
      const newChat = await createMockChat(participantIds, name);
      console.log("Nuevo chat creado:", newChat);
      
      // Add the new chat to the local state
      setChats(prevChats => [...prevChats, newChat]);
      setActiveChat(newChat);
    } catch (error) {
      console.error("Error al crear chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el chat. Por favor, inténtalo de nuevo."
      });
    }
  };

  /**
   * Enhanced function to create or navigate to an existing private chat
   */
  const createPrivateChat = async (participantId: string) => {
    if (!currentUser || participantId === currentUser.id) return;
    
    try {
      // Check if a private chat already exists with this user
      const existingChat = findExistingPrivateChat(participantId);
      
      if (existingChat) {
        // If the chat exists, set it as active
        console.log("Chat privado existente encontrado, navegando a él:", existingChat.id);
        setActiveChat(existingChat);
        return;
      }
      
      // If it doesn't exist, create a new private chat
      console.log("Creando nuevo chat privado con usuario:", participantId);
      const participants = [currentUser.id, participantId];
      const newChat = await createMockChat(participants);
      console.log("Nuevo chat privado creado:", newChat);
      
      // Add the new chat to the local state
      setChats(prevChats => [...prevChats, newChat]);
      setActiveChat(newChat);
    } catch (error) {
      console.error("Error al crear chat privado:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el chat privado. Por favor, inténtalo de nuevo."
      });
    }
  };

  /**
   * Function to add participants to an existing chat
   */
  const addParticipantToChat = async (chatId: string, participantId: string) => {
    try {
      // Check if the chat exists
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return false;
      
      // Check if the user is already in the chat
      if (chat.participants.includes(participantId)) return false;
      
      // Add participant
      const success = await addMockParticipantToChat(chatId, participantId);
      console.log(`Participante ${participantId} añadido al chat ${chatId}`);
      
      if (success) {
        // Update local state
        setChats(prevChats => {
          return prevChats.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                participants: [...chat.participants, participantId]
              };
            }
            return chat;
          });
        });
        
        // Update active chat if this is the current chat
        if (activeChat?.id === chatId) {
          setActiveChat(prevChat => {
            if (!prevChat) return null;
            return {
              ...prevChat,
              participants: [...prevChat.participants, participantId]
            };
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error("Error al añadir participante:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo añadir el participante. Por favor, inténtalo de nuevo."
      });
      return false;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        setActiveChat,
        sendMessage,
        createChat,
        createPrivateChat,
        getChat,
        loadingChats,
        onlineUsers,
        loadChats,
        addParticipantToChat,
        findExistingPrivateChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
