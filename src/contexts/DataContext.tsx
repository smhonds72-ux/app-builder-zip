import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { dataService } from '@/lib/dataService';

type DataMode = 'mock' | 'live';

interface LiveSeries {
  id: string;
  title?: {
    nameShortened?: string;
  };
  tournament?: {
    nameShortened?: string;
  };
  startTimeScheduled?: string;
  format?: {
    name?: string;
  };
  teams?: {
    baseInfo?: {
      name?: string;
    };
    scoreAdvantage?: number;
  }[];
}

interface DataContextType {
    dataMode: DataMode;
    setDataMode: (mode: DataMode) => void;
    isLiveMode: boolean;
    selectedSeries: LiveSeries | null;
    setSelectedSeries: (series: LiveSeries | null) => void;
    toggleLiveMode: (enabled: boolean) => Promise<boolean>;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [dataMode, setDataMode] = useState<DataMode>(dataService.getLiveMode() ? 'live' : 'mock');
    const [selectedSeries, setSelectedSeries] = useState<LiveSeries | null>(null);

    const toggleLiveMode = async (enabled: boolean): Promise<boolean> => {
        if (enabled) {
            const isConnected = await dataService.checkConnection();
            if (isConnected) {
                dataService.setLiveMode(true);
                setDataMode('live');
                // Reload after a short delay to allow UI to update/toast to show
                setTimeout(() => window.location.reload(), 1500);
                return true;
            } else {
                dataService.setLiveMode(false);
                setDataMode('mock');
                return false;
            }
        } else {
            dataService.setLiveMode(false);
            setDataMode('mock');
            setTimeout(() => window.location.reload(), 1500);
            return true;
        }
    };

    const refreshData = async (): Promise<void> => {
        try {
            await dataService.refreshLiveData();
        } catch (error) {
            console.error('Failed to refresh data:', error);
            throw error;
        }
    };

    return (
        <DataContext.Provider
            value={{
                dataMode,
                setDataMode,
                isLiveMode: dataMode === 'live',
                selectedSeries,
                setSelectedSeries,
                toggleLiveMode,
                refreshData,
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
