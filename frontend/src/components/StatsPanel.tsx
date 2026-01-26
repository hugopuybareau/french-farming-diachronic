import { useAppStore } from '@/stores/useAppStore';
import { formatNumberFull, formatHectares } from '@/utils/colorScales';
import { TrendingUp, TrendingDown, BarChart2, MapPin } from 'lucide-react';

interface StatsPanelProps {
  stats: {
    total: number;
    average: number;
    min: { name: string; value: number };
    max: { name: string; value: number };
    count: number;
  };
}

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  const { indicator, level } = useAppStore();
  
  const formatValue = (value: number) => {
    return indicator === 'sau' ? formatHectares(value) : formatNumberFull(value);
  };

  const levelLabel = level === 'regions' ? 'régions' : 'départements';
  const indicatorLabel = indicator === 'nb_exploitations' ? 'exploitations' : 'ha de SAU';

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-soft p-4 animate-fade-in">
      <div className="flex items-center gap-6">
        {/* Total France */}
        <div className="stat-card !p-3 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 text-primary mb-1">
            <BarChart2 className="h-4 w-4" />
            <span className="text-xs font-medium">Total France</span>
          </div>
          <p className="font-display font-bold text-lg text-primary">
            {formatValue(stats.total)}
          </p>
          <p className="text-xs text-muted-foreground">{stats.count} {levelLabel}</p>
        </div>

        {/* Average */}
        <div className="stat-card !p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium">Moyenne</span>
          </div>
          <p className="font-display font-semibold text-foreground">
            {formatValue(stats.average)}
          </p>
          <p className="text-xs text-muted-foreground">par {level === 'regions' ? 'région' : 'département'}</p>
        </div>

        {/* Max */}
        <div className="stat-card !p-3">
          <div className="flex items-center gap-2 text-accent mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Maximum</span>
          </div>
          <p className="font-display font-semibold text-foreground">
            {formatValue(stats.max.value)}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]" title={stats.max.name}>
            {stats.max.name}
          </p>
        </div>

        {/* Min */}
        <div className="stat-card !p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xs font-medium">Minimum</span>
          </div>
          <p className="font-display font-semibold text-foreground">
            {formatValue(stats.min.value)}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]" title={stats.min.name}>
            {stats.min.name}
          </p>
        </div>
      </div>
    </div>
  );
};
