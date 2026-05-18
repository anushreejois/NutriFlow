/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- AUTHENTICATION API ---

export const registerUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

export const loginUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('userInfo');
};

// --- AI PLAN API (SYNCED WITH BIO-VAULT) ---

export const generatePlan = async (userData: any, explicitUserId?: string) => {
  try {
    // Fallback gracefully to legacy localstorage if Clerk ID isn't directly passed down
    const userInfo = localStorage.getItem('userInfo');
    const dbUserId = explicitUserId || (userInfo ? JSON.parse(userInfo)._id : null);

    const payload = { ...userData, userId: dbUserId }; 
    const response = await axios.post(`${API_URL}/plans/generate-plan`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error (Generate):", error);
    throw error;
  }
};

export const adjustPlan = async (currentPlan: any, adjustmentRequest: string, explicitUserId?: string) => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    const dbUserId = explicitUserId || (userInfo ? JSON.parse(userInfo)._id : null);

    const response = await axios.post(`${API_URL}/plans/adjust-plan`, {
      currentPlan,
      adjustmentRequest,
      userId: dbUserId 
    });
    return response.data;
  } catch (error) {
    console.error("API Error (Adjust):", error);
    throw error;
  }
};

export const getPlanHistory = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/plans/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching plan history:", error);
    throw error;
  }
};

// --- USER PROGRESS & PROFILE API ---

export const getUserProfile = async (userId: string) => {
  const response = await axios.get(`${API_URL}/user/profile/${userId}`);
  return response.data;
};

export const updateUserProfile = async (profileData: any) => {
  const response = await axios.put(`${API_URL}/user/profile`, profileData);
  return response.data;
};

export const updateResetProgress = async (userId: string, dayNumber: number) => {
  const response = await axios.put(`${API_URL}/user/reset-progress`, { userId, dayNumber });
  return response.data;
};

export const updateCycleData = async (userId: string, date: Date | null, length?: number) => {
  const response = await axios.put(`${API_URL}/user/cycle-data`, { userId, date, length });
  return response.data;
};

// --- HABIT STATS API ---

export const getWeeklyStats = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/habits/weekly/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    return [];
  }
};

// --- BLOG APIs ---

export const getBlogs = async () => {
  const response = await axios.get(`${API_URL}/blogs`);
  return response.data;
};

export const createBlog = async (blogData: any) => {
  const response = await axios.post(`${API_URL}/blogs`, blogData);
  return response.data;
};

export const likeBlog = async (id: string) => {
  const response = await axios.put(`${API_URL}/blogs/${id}/like`);
  return response.data;
};

// --- ROUTINE & TRACKING APIs ---

export const updateGymSplit = async (userId: string, gymRoutine: any) => {
  const response = await axios.put(`${API_URL}/routine/split`, { userId, gymRoutine });
  return response.data;
};

export const saveDailyLog = async (logData: any) => {
  const response = await axios.post(`${API_URL}/routine/log`, logData);
  return response.data;
};

export const getDailyLog = async (userId: string, date: string) => {
  const response = await axios.get(`${API_URL}/routine/log/${userId}/${date}`);
  return response.data;
};

export const getWeeklySummary = async (userId: string, startDate: string, endDate: string) => {
  const response = await axios.get(`${API_URL}/routine/summary/${userId}/${startDate}/${endDate}`);
  return response.data;
};

// --- CLERK SYNC API ---
export const syncClerkToDB = async (userData: { clerkId: string, email: string, name: string }) => {
  const response = await axios.post(`${API_URL}/users/sync`, userData);
  return response.data;
};