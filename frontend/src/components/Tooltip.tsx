import { useAppStore } from '@/stores/useAppStore';
import { formatNumberFull, formatHectares } from '@/utils/colorScales';

export const Tooltip = () => {
  const { tooltip, indicator } = useAppStore();

  if (!tooltip) return null;

  return (
    <div
      className="tooltip-box fixed z-50 animate-fade-in min-w-[200px]"
      style={{
        left: tooltip.x + 15,
        top: tooltip.y - 10,
        transform: tooltip.x > window.innerWidth - 250 ? 'translateX(-110%)' : undefined,
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display font-semibold text-foreground">
            {tooltip.name}
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {tooltip.code}
          </span>
        </div>
        
        <div className="space-y-1.5 pt-1 border-t border-border">
          <div className={`flex justify-between items-center ${indicator === 'nb_exploitations' ? 'text-primary font-medium' : ''}`}>
            <span className="text-sm">Exploitations</span>
            <span className="font-mono text-sm">{formatNumberFull(tooltip.nb_exploitations)}</span>
          </div>
          <div className={`flex justify-between items-center ${indicator === 'sau' ? 'text-primary font-medium' : ''}`}>
            <span className="text-sm">SAU</span>
            <span className="font-mono text-sm">{formatHectares(tooltip.sau)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
