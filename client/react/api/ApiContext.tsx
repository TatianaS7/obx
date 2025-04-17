import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import apiURL from "../api/api.js";
import axios from "axios";

interface ApiContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  allOils: any[];
  fetchOils: () => Promise<void>;
  // browseOils: boolean;
  // setBrowseOils: (browseOils: boolean) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allOils, setAllOils] = useState<any[]>([]);
  // const [browseOils, setBrowseOils] = useState<boolean>(false);


  // Fetch all oils from the API
  const fetchOils = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiURL}/oils/all`);
      console.log(res.data);
      setAllOils(res.data);
    } catch (err) {
      setError("Failed to fetch oils");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        allOils,
        loading,
        setLoading,
        error,
        fetchOils,
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
