
/**
 * Mock Data Service
 * 
 * This file provides mock data and data manipulation functions to replace Firebase.
 * It uses localStorage to persist data between page refreshes.
 */

import { UserType } from "@/contexts/AuthContext";
import { JobType, CommentType, ReplyType } from "@/contexts/JobContext";
import { ChatType, MessageType } from "@/contexts/ChatContext";

// Helper to generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Initial mock data
const initialUsers: UserType[] = [
  {
    id: "user1",
    name: "María García",
    email: "maria@example.com",
    photoURL: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Diseñadora UX/UI con 5 años de experiencia",
    skills: ["Figma", "Adobe XD", "User Research", "Wireframing"],
    role: "freelancer",
    savedJobs: ["job2"],
    hourlyRate: 35,
    joinedAt: 1672531200000, // Jan 1, 2023
  },
  {
    id: "user2",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    photoURL: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Desarrollador Full Stack especializado en React y Node.js",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    role: "freelancer",
    savedJobs: ["job1"],
    hourlyRate: 40,
    joinedAt: 1677628800000, // Mar 1, 2023
  },
  {
    id: "user3",
    name: "Ana Martínez",
    email: "ana@example.com",
    photoURL: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Propietaria de una empresa de marketing digital",
    skills: [],
    role: "client",
    joinedAt: 1680307200000, // Apr 1, 2023
  }
];

const initialJobs: JobType[] = [
  {
    id: "job1",
    title: "Diseño de interfaz para aplicación móvil",
    description: "Necesito un diseñador UX/UI para crear la interfaz de una aplicación móvil de fitness. El proyecto incluye wireframes, mockups y prototipos interactivos.",
    budget: 1200,
    category: "Diseño UX/UI",
    skills: ["Figma", "Adobe XD", "UI Design", "UX Design"],
    userId: "user3",
    userName: "Ana Martínez",
    userPhoto: "https://randomuser.me/api/portraits/women/68.jpg",
    timestamp: 1714435200000, // Apr 30, 2024
    status: "open",
    comments: [
      {
        id: "comment1",
        jobId: "job1",
        userId: "user1",
        userName: "María García",
        userPhoto: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "Me interesa este proyecto. Tengo experiencia diseñando aplicaciones de fitness.",
        timestamp: 1714521600000, // May 1, 2024
        replies: [
          {
            id: "reply1",
            commentId: "comment1",
            userId: "user3",
            userName: "Ana Martínez",
            userPhoto: "https://randomuser.me/api/portraits/women/68.jpg",
            content: "Hola María, me gustaría ver tu portafolio. ¿Podríamos hablar por chat?",
            timestamp: 1714608000000 // May 2, 2024
          }
        ]
      }
    ],
    likes: ["user1", "user2"]
  },
  {
    id: "job2",
    title: "Desarrollo de API REST para e-commerce",
    description: "Busco un desarrollador backend para crear una API REST completa para mi tienda online. Debe incluir autenticación, gestión de productos y procesamiento de pedidos.",
    budget: 2500,
    category: "Desarrollo Backend",
    skills: ["Node.js", "Express", "MongoDB", "JWT"],
    userId: "user3",
    userName: "Ana Martínez",
    userPhoto: "https://randomuser.me/api/portraits/women/68.jpg",
    timestamp: 1714348800000, // Apr 29, 2024
    status: "open",
    comments: [],
    likes: ["user2"]
  },
  {
    id: "job3",
    title: "Migración de aplicación Angular a React",
    description: "Necesito migrar una aplicación existente en Angular a React. La aplicación es un dashboard administrativo con aproximadamente 20 pantallas.",
    budget: 3000,
    category: "Desarrollo Frontend",
    skills: ["React", "Redux", "TypeScript", "Material UI"],
    userId: "user3",
    userName: "Ana Martínez",
    userPhoto: "https://randomuser.me/api/portraits/women/68.jpg",
    timestamp: 1714262400000, // Apr 28, 2024
    status: "in-progress",
    comments: [],
    likes: []
  }
];

const initialChats: ChatType[] = [
  {
    id: "chat1",
    name: "",
    participants: ["user1", "user3"],
    messages: [
      {
        id: "msg1",
        senderId: "user3",
        content: "Hola María, me interesa tu perfil para mi proyecto de diseño UX.",
        timestamp: 1714608000000 // May 2, 2024
      },
      {
        id: "msg2",
        senderId: "user1",
        content: "¡Hola Ana! Gracias por contactarme. Me encantaría saber más detalles sobre el proyecto.",
        timestamp: 1714608060000 // May 2, 2024 + 1 minute
      }
    ],
    isGroup: false,
    lastMessage: {
      id: "msg2",
      senderId: "user1",
      content: "¡Hola Ana! Gracias por contactarme. Me encantaría saber más detalles sobre el proyecto.",
      timestamp: 1714608060000
    }
  }
];

const jobCategories = [
  "Diseño UX/UI",
  "Desarrollo Frontend",
  "Desarrollo Backend",
  "Desarrollo Móvil",
  "Diseño Gráfico",
  "Marketing Digital",
  "Redacción y Traducción",
  "SEO y SEM",
  "Análisis de Datos",
  "Administración de Sistemas"
];

const skillsList = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js",
  "Express", "Python", "Django", "Flask", "Ruby", "Ruby on Rails", "PHP", "Laravel",
  "WordPress", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "AWS", "Docker", "Kubernetes",
  "Figma", "Adobe XD", "Photoshop", "Illustrator", "UI Design", "UX Design", "User Research",
  "Wireframing", "Prototyping", "SEO", "SEM", "Google Analytics", "Social Media Marketing",
  "Content Marketing", "Email Marketing", "Swift", "Kotlin", "React Native", "Flutter"
];

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'wfc_users',
  JOBS: 'wfc_jobs',
  CHATS: 'wfc_chats',
  CURRENT_USER: 'wfc_current_user'
};

// Initialize local storage with mock data if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(initialJobs));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(initialChats));
  }
};

// Call initialization
initializeLocalStorage();

// Helper functions to get and set data in localStorage
const getData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// User functions
export const getCurrentUser = (): UserType | null => {
  const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userId) return null;
  
  const users = getData<UserType>(STORAGE_KEYS.USERS);
  return users.find(user => user.id === userId) || null;
};

export const setCurrentUser = (userId: string | null) => {
  if (userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const registerUser = async (email: string, password: string, name: string): Promise<UserType> => {
  const users = getData<UserType>(STORAGE_KEYS.USERS);
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    throw new Error("El correo electrónico ya está en uso");
  }
  
  const newUser: UserType = {
    id: generateId(),
    name,
    email,
    photoURL: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
    bio: "",
    skills: [],
    role: "freelancer",
    joinedAt: Date.now()
  };
  
  users.push(newUser);
  setData(STORAGE_KEYS.USERS, users);
  setCurrentUser(newUser.id);
  
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<UserType> => {
  const users = getData<UserType>(STORAGE_KEYS.USERS);
  const user = users.find(user => user.email === email);
  
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  
  // In a real app, we would check the password here
  // For mock purposes, we'll just log the user in
  
  setCurrentUser(user.id);
  return user;
};

export const logoutUser = async (): Promise<void> => {
  setCurrentUser(null);
};

export const updateUserProfile = async (userId: string, data: Partial<UserType>): Promise<Partial<UserType>> => {
  const users = getData<UserType>(STORAGE_KEYS.USERS);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error("Usuario no encontrado");
  }
  
  users[userIndex] = { ...users[userIndex], ...data };
  setData(STORAGE_KEYS.USERS, users);
  
  return data;
};

export const getAllUsers = async (): Promise<UserType[]> => {
  return getData<UserType>(STORAGE_KEYS.USERS);
};

export const getUserById = async (userId: string): Promise<UserType | null> => {
  const users = getData<UserType>(STORAGE_KEYS.USERS);
  return users.find(user => user.id === userId) || null;
};

export const uploadUserPhoto = async (userId: string, file: File): Promise<string> => {
  // In a real app, we would upload the file to a server
  // For mock purposes, we'll just use a random user image
  const photoURL = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
  
  const users = getData<UserType>(STORAGE_KEYS.USERS);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].photoURL = photoURL;
    setData(STORAGE_KEYS.USERS, users);
  }
  
  return photoURL;
};

// Job functions
export const getAllJobs = async (): Promise<JobType[]> => {
  return getData<JobType>(STORAGE_KEYS.JOBS);
};

export const getJobById = async (jobId: string): Promise<JobType | null> => {
  const jobs = getData<JobType>(STORAGE_KEYS.JOBS);
  return jobs.find(job => job.id === jobId) || null;
};

export const createJob = async (jobData: Omit<JobType, "id" | "timestamp" | "comments" | "likes">): Promise<JobType> => {
  const jobs = getData<JobType>(STORAGE_KEYS.JOBS);
  
  const newJob: JobType = {
    ...jobData,
    id: generateId(),
    timestamp: Date.now(),
    comments: [],
    likes: []
  };
  
  jobs.push(newJob);
  setData(STORAGE_KEYS.JOBS, jobs);
  
  return newJob;
};

export const updateJob = async (jobId: string, jobData: Partial<JobType>): Promise<JobType> => {
  const jobs = getData<JobType>(STORAGE_KEYS.JOBS);
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex === -1) {
    throw new Error("Trabajo no encontrado");
  }
  
  jobs[jobIndex] = { ...jobs[jobIndex], ...jobData };
  setData(STORAGE_KEYS.JOBS, jobs);
  
  return jobs[jobIndex];
};

export const deleteJob = async (jobId: string): Promise<boolean> => {
  const jobs = getData<JobType>(STORAGE_KEYS.JOBS);
  const filteredJobs = jobs.filter(job => job.id !== jobId);
  
  if (filteredJobs.length === jobs.length) {
    return false; // No job was deleted
  }
  
  setData(STORAGE_KEYS.JOBS, filteredJobs);
  return true;
};

export const addCommentToJob = async (jobId: string, content: string, user: UserType): Promise<CommentType> => {
  const jobs = getData<JobType>(STORAGE_KEYS.JOBS);
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex === -1) {
    throw new Error("Trabajo no encontrado");
  }
  
  const newComment: CommentType = {
    id: generateId(),
    jobId,
    userId: user.id,
    userName: user.name,
    userPhoto: user.photoURL,
    content,
    timestamp: Date.now(),
    replies: []
  };
  
  jobs[jobIndex].comments.push(newComment);
  setData(STORAGE_KEYS.JOBS, jobs);
  
  return newComment;
};

export const addReplyToComment = async (
  jobId: string, 
  commentId: string, 
  content: string, 
  user: UserType
): Promise<ReplyType | undefined> => {
  const jobs = getData<JobType>(STORAGE_KEYS.JOBS);
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex === -1) {
    throw new Error("Trabajo no encontrado");
  }
  
  const commentIndex = jobs[jobIndex].comments.findIndex(comment => comment.id === commentId);
  
  if (commentIndex === -1) {
    throw new Error("Comentario no encontrado");
  }
  
  const newReply: ReplyType = {
    id: generateId(),
    commentId,
    userId: user.id,
    userName: user.name,
    userPhoto: user.photoURL,
    content,
    timestamp: Date.now()
  };
  
  jobs[jobIndex].comments[commentIndex].replies.push(newReply);
  setData(STORAGE_KEYS.JOBS, jobs);
  
  return newReply;
};

export const toggleJobLike = async (jobId: string, userId: string): Promise<boolean> => {
  const jobs = getData<JobType>(STORAGE_KEYS.JOBS);
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex === -1) {
    throw new Error("Trabajo no encontrado");
  }
  
  const likes = jobs[jobIndex].likes;
  const userLikedIndex = likes.indexOf(userId);
  
  if (userLikedIndex === -1) {
    likes.push(userId);
  } else {
    likes.splice(userLikedIndex, 1);
  }
  
  setData(STORAGE_KEYS.JOBS, jobs);
  return userLikedIndex === -1; // Return true if liked, false if unliked
};

export const toggleSavedJob = async (userId: string, jobId: string): Promise<boolean> => {
  const users = getData<UserType>(STORAGE_KEYS.USERS);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error("Usuario no encontrado");
  }
  
  if (!users[userIndex].savedJobs) {
    users[userIndex].savedJobs = [];
  }
  
  const savedJobs = users[userIndex].savedJobs || [];
  const jobIndex = savedJobs.indexOf(jobId);
  
  if (jobIndex === -1) {
    savedJobs.push(jobId);
  } else {
    savedJobs.splice(jobIndex, 1);
  }
  
  users[userIndex].savedJobs = savedJobs;
  setData(STORAGE_KEYS.USERS, users);
  
  return jobIndex === -1; // Return true if saved, false if unsaved
};

export const getSavedJobs = async (userId: string): Promise<JobType[]> => {
  const users = getData<UserType>(STORAGE_KEYS.USERS);
  const user = users.find(user => user.id === userId);
  
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  
  const savedJobIds = user.savedJobs || [];
  if (savedJobIds.length === 0) return [];
  
  const jobs = getData<JobType>(STORAGE_KEYS.JOBS);
  return jobs.filter(job => savedJobIds.includes(job.id));
};

// Chat functions
export const getChats = async (userId: string): Promise<ChatType[]> => {
  const chats = getData<ChatType>(STORAGE_KEYS.CHATS);
  return chats.filter(chat => chat.participants.includes(userId));
};

export const createChat = async (participantIds: string[], name = ""): Promise<ChatType> => {
  const chats = getData<ChatType>(STORAGE_KEYS.CHATS);
  const isGroup = participantIds.length > 2 || !!name;
  
  const newChat: ChatType = {
    id: generateId(),
    name,
    participants: participantIds,
    messages: [],
    isGroup
  };
  
  chats.push(newChat);
  setData(STORAGE_KEYS.CHATS, chats);
  
  return newChat;
};

export const sendMessage = async (chatId: string, senderId: string, content: string): Promise<MessageType> => {
  const chats = getData<ChatType>(STORAGE_KEYS.CHATS);
  const chatIndex = chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex === -1) {
    throw new Error("Chat no encontrado");
  }
  
  const newMessage: MessageType = {
    id: generateId(),
    senderId,
    content,
    timestamp: Date.now()
  };
  
  chats[chatIndex].messages.push(newMessage);
  chats[chatIndex].lastMessage = newMessage;
  
  setData(STORAGE_KEYS.CHATS, chats);
  
  return newMessage;
};

export const addParticipantToChat = async (chatId: string, participantId: string): Promise<boolean> => {
  const chats = getData<ChatType>(STORAGE_KEYS.CHATS);
  const chatIndex = chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex === -1) {
    throw new Error("Chat no encontrado");
  }
  
  if (chats[chatIndex].participants.includes(participantId)) {
    return false; // Participant already in chat
  }
  
  chats[chatIndex].participants.push(participantId);
  setData(STORAGE_KEYS.CHATS, chats);
  
  return true;
};

// Category and skills functions
export const getJobCategories = async (): Promise<string[]> => {
  return jobCategories;
};

export const getSkillsList = async (): Promise<string[]> => {
  return skillsList;
};

// Initialize mock data function (not needed for regular use)
export const initializeMockData = () => {
  initializeLocalStorage();
};
