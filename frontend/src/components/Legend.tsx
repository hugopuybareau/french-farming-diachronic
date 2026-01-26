import { useAppStore } from '@/stores/useAppStore';
import { formatNumber } from '@/utils/colorScales';

interface LegendProps {
  domain: [number, number];
}

export const Legend = ({ domain }: LegendProps) => {
  const { indicator } = useAppStore();
  
  const indicatorLabel = indicator === 'nb_exploitations' 
    ? 'Exploitations' 
    : 'SAU (ha)';

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-card">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {indicatorLabel}
        </span>
        
        <div className="flex items-center gap-2">
          <div className="legend-gradient w-4 h-32 rounded-sm" />
          
          <div className="flex flex-col justify-between h-32 text-xs font-mono text-muted-foreground">
            <span>{formatNumber(domain[1])}</span>
            <span>{formatNumber(domain[1] * 0.75)}</span>
            <span>{formatNumber(domain[1] * 0.5)}</span>
            <span>{formatNumber(domain[1] * 0.25)}</span>
            <span>{formatNumber(domain[0])}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
