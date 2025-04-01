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
  quality_inspection_data?: QualityInspectionData[];
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
  selectedItemId: string | null; // Add selectedItemId to the context
  setSelectedItemId: React.Dispatch<React.SetStateAction<string | null>>; // Setter for selectedItemId
  licensePlateFilter: string | null; // Add licensePlateFilter to the context
  setLicensePlateFilter: React.Dispatch<React.SetStateAction<string | null>>; // Setter for licensePlateFilter
}

// Default context value
const defaultContextValue: DataContextType = {
  apiData: null,
  loading: false,
  error: null,
  selectedItemId: null, // Default to null
  setSelectedItemId: () => {}, // Placeholder function
  licensePlateFilter: null, // Default to null
  setLicensePlateFilter: () => {}, // Placeholder function
};

// Create the context for data fetching and selected item
const DataContext = createContext<DataContextType>(defaultContextValue);

// Provider for handling API data and selected item
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiData, setApiData] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null); // Manage selectedItemId here
  const [licensePlateFilter, setLicensePlateFilter] = useState<string | null>(null); // Manage licensePlateFilter here

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/method/lbf_logistica.api.bol.get_bill_of_landing');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Message = await response.json();

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
    <DataContext.Provider value={{ apiData, loading, error, selectedItemId, setSelectedItemId, licensePlateFilter, setLicensePlateFilter }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context (including selectedItemId and licensePlateFilter)
// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
