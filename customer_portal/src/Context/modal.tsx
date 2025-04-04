// CreateContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface SelectedItemContextType {
  selectedItemId: string | null;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with an empty default value
const SelectedItemContext = createContext<SelectedItemContextType | undefined>(undefined);

// Provider component to wrap around components that need access to selectedItemId
export const SelectedItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <SelectedItemContext.Provider value={{ selectedItemId, setSelectedItemId }}>
      {children}
    </SelectedItemContext.Provider>
  );
};

// Hook to use the selectedItem context in any component
export const useSelectedItem = () => {
  const context = useContext(SelectedItemContext);
  if (!context) {
    throw new Error('useSelectedItem must be used within a SelectedItemProvider');
  }
  return context;
};
