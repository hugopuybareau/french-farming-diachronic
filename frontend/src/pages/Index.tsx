// Agricultural Census Map Application
import { useMemo, useState, useEffect } from 'react';
import { ControlPanel } from '@/components/ControlPanel';
import { FranceMap } from '@/components/FranceMap';
import { Legend } from '@/components/Legend';
import { Tooltip } from '@/components/Tooltip';
import { StatsPanel } from '@/components/StatsPanel';
import { useAppStore } from '@/stores/useAppStore';
import { getDataRange, calculateStats } from '@/utils/dataUtils';
import type { RA2020Data } from '@/types/data';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { level, indicator, sizeFilter } = useAppStore();
  const [data, setData] = useState<RA2020Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data via fetch
  useEffect(() => {
    fetch('/data/ra2020.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((json: RA2020Data) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  const domain = useMemo(() => 
    data ? getDataRange(data, level, indicator, sizeFilter) : [0, 1] as [number, number],
    [data, level, indicator, sizeFilter]
  );
  
  const stats = useMemo(() => 
    data ? calculateStats(data, level, indicator, sizeFilter) : {
      total: 0,
      average: 0,
      min: { name: '-', value: 0 },
      max: { name: '-', value: 0 },
      count: 0
    },
    [data, level, indicator, sizeFilter]
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-destructive">
          <p className="text-sm">Erreur: {error || 'Données non disponibles'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Control Panel Sidebar */}
      <ControlPanel />
      
      {/* Main Map Area */}
      <main className="flex-1 relative overflow-hidden">
        <FranceMap data={data} />
        
        {/* Legend */}
        <Legend domain={domain} />
        
        {/* Stats Panel */}
        <StatsPanel stats={stats} />
        
        {/* Tooltip */}
        <Tooltip />
      </main>
    </div>
  );
};

export default Index;
