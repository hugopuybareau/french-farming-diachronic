// Agricultural Census Map Application
import { useMemo, useState, useEffect } from 'react';
import { ControlPanel } from '@/components/ControlPanel';
import { FranceMap } from '@/components/FranceMap';
import { Legend } from '@/components/Legend';
import { Tooltip } from '@/components/Tooltip';
import { StatsPanel } from '@/components/StatsPanel';
import { SauChart } from '@/components/SauChart';
import { useAppStore } from '@/stores/useAppStore';
import { getDataRange, calculateStats } from '@/utils/dataUtils';
import type { RA2020Data, SauByRegionYearData, SauByDepartmentYearData } from '@/types/data';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { level, indicator, sizeFilter, selectedRegion, selectedDepartment } = useAppStore();
  const [data, setData] = useState<RA2020Data | null>(null);
  const [sauData, setSauData] = useState<SauByRegionYearData | null>(null);
  const [sauDeptData, setSauDeptData] = useState<SauByDepartmentYearData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data via fetch
  useEffect(() => {
    Promise.all([
      fetch('/data/ra2020.json').then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      }),
      fetch('/data/sau_by_region_year.json').then(res => {
        if (!res.ok) throw new Error('Failed to fetch SAU data');
        return res.json();
      }),
      fetch('/data/sau_by_department_year.json').then(res => {
        if (!res.ok) throw new Error('Failed to fetch department SAU data');
        return res.json();
      }),
    ])
      .then(([ra2020, sauByRegion, sauByDept]: [RA2020Data, SauByRegionYearData, SauByDepartmentYearData]) => {
        setData(ra2020);
        setSauData(sauByRegion);
        setSauDeptData(sauByDept);
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
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className={`relative overflow-hidden transition-all duration-500 ${(selectedRegion || selectedDepartment) ? 'h-[55vh]' : 'flex-1'}`}>
          <FranceMap data={data} />

          {/* Legend */}
          <Legend domain={domain} />

          {/* Stats Panel */}
          <StatsPanel stats={stats} />

          {/* Tooltip */}
          <Tooltip />
        </div>

        {selectedRegion && sauData && (() => {
          const regionSau = sauData.regions.find(r => r.code === selectedRegion);
          if (!regionSau) return null;
          return (
            <div className="h-[45vh] border-t border-border">
              <SauChart regionData={regionSau} />
            </div>
          );
        })()}

        {selectedDepartment && sauDeptData && (() => {
          const deptSau = sauDeptData.departments.find(d => d.code === selectedDepartment);
          if (!deptSau) return null;
          return (
            <div className="h-[45vh] border-t border-border">
              <SauChart regionData={deptSau} />
            </div>
          );
        })()}
      </main>
    </div>
  );
};

export default Index;
