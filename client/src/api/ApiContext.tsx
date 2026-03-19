import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import apiClient from "./httpClient";

interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  rewards_points: number;
  is_employee: boolean;
  birthday: string | null;
}

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

interface LoginPayload {
  email?: string;
  phone_number?: string;
  password: string;
}

interface ApiContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  allOils: any[];
  fetchOils: () => Promise<void>;
  authToken: string | null;
  currentUser: AuthUser | null;
  registerUser: (payload: RegisterPayload) => Promise<void>;
  loginUser: (payload: LoginPayload) => Promise<void>;
  logoutUser: () => void;
  // browseOils: boolean;
  // setBrowseOils: (browseOils: boolean) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allOils, setAllOils] = useState<any[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("authToken"),
  );
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // const [browseOils, setBrowseOils] = useState<boolean>(false);

  const persistSession = (token: string, user: AuthUser) => {
    setAuthToken(token);
    setCurrentUser(user);
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const extractErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data?.message as string | undefined) ||
        (err.response?.data?.error as string | undefined);
      return message ?? fallback;
    }
    return fallback;
  };

  // Fetch all oils from the API
  const fetchOils = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/oils/all");
      console.log(res.data);
      setAllOils(res.data);
    } catch (err) {
      setError("Failed to fetch oils");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post("/auth/register", payload);
      const token = res.data?.success as string | undefined;
      const user = res.data?.user as AuthUser | undefined;

      if (!token || !user) {
        throw new Error("Missing auth data from registration response");
      }

      persistSession(token, user);
    } catch (err) {
      const message = extractErrorMessage(err, "Registration failed.");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post("/auth/login", payload);
      const token = res.data?.success as string | undefined;
      const user = res.data?.user as AuthUser | undefined;

      if (!token || !user) {
        throw new Error("Missing auth data from login response");
      }

      persistSession(token, user);
    } catch (err) {
      const message = extractErrorMessage(err, "Sign in failed.");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  };

  return (
    <ApiContext.Provider
      value={{
        allOils,
        loading,
        setLoading,
        error,
        fetchOils,
        authToken,
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
        // browseOils,
        // setBrowseOils
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export default {
  ApiProvider,
  useApi,
};
