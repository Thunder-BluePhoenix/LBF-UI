import React, { createContext, useContext, useState, useEffect } from 'react';


// Interface for Quality Inspection Data
interface QualityInspectionData {
  status: string;
}

// Interface for individual item
interface Item {
  party_type: string;
  customer: string;
  name: string;
  quality_inspection_data?: QualityInspectionData[]
}

// Interface for the API response message
interface Message {
  message: unknown;
  customer: string;
  party_type: string;
  items?: Item[]; // Optional array of items
}

// Define the type for the context
interface DataContextType {
  apiData: Message | null; // API data should be Message or null
  loading: boolean;
  error: Error | null;
}

// Default context value
const defaultContextValue: DataContextType = {
  apiData: null,
  loading: false,
  error: null,
};


const DataContext = createContext<DataContextType>(defaultContextValue);


interface DataProviderProps {
  children: React.ReactNode;
}


export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [apiData, setApiData] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/method/lbf_logistica.api.bol.get_bill_of_landing');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Message = await response.json();

        // Log the fetched data to confirm the API response
        console.log("Fetched data:", data);

        // Set the API data
        setApiData(data);
        setError(null);
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <DataContext.Provider value={{ apiData, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useDataContext = (): DataContextType => {
  return useContext(DataContext);
};
