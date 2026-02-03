import { createContext, useContext, useState, ReactNode } from 'react';

type DataMode = 'mock' | 'live';

interface DataContextType {
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  isLiveMode: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataMode, setDataMode] = useState<DataMode>('mock');

  return (
    <DataContext.Provider
      value={{
        dataMode,
        setDataMode,
        isLiveMode: dataMode === 'live',
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataMode() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataMode must be used within a DataProvider');
  }
  return context;
}
