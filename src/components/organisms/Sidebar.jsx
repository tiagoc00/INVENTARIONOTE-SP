import { useInventory } from '../../context/InventoryContext';
import { SectorButton } from '../molecules/SectorButton';
import { SummaryRow } from '../molecules/SummaryRow';

export function Sidebar() {
  const { data, currentSector, setCurrentSector, getSummary, SETORES_CONFIG } = useInventory();
  const summary = getSummary();

  const handleSectorClick = (sector) => setCurrentSector(sector);

  return (
    <aside className="w-[220px] min-w-[220px] bg-surface border-r border-border flex flex-col overflow-y-auto">
      <div className="p-4 pb-2">
        <div className="text-[10px] font-semibold text-text-muted tracking-[1px] uppercase px-2 pb-2">
          Setores
        </div>
        <SectorButton 
          name="Todos os Setores"
          count={data.length}
          colorConfig={{ cor: '#4f8ef7' }}
          isActive={currentSector === 'todos'}
          onClick={() => handleSectorClick('todos')}
        />
      </div>
      
      <div className="px-3 pb-2 flex-1 relative">
        {Object.entries(SETORES_CONFIG).map(([sectorName, config]) => {
          const count = data.filter(d => d.setor === sectorName).length;
          return (
            <SectorButton 
              key={sectorName}
              name={sectorName}
              count={count}
              colorConfig={config}
              isActive={currentSector === sectorName}
              onClick={() => handleSectorClick(sectorName)}
            />
          );
        })}
      </div>

      <div className="m-3 p-3 rounded-lg bg-bg border border-border">
        <SummaryRow label="Total" value={summary.total} />
        <SummaryRow label="Ativos" value={summary.ativos} colorClass="text-green-500" />
        <SummaryRow label="Inativos" value={summary.inativos} colorClass="text-red-500" />
        <SummaryRow label="Manutenção" value={summary.manutencao} colorClass="text-yellow-500" />
      </div>
    </aside>
  );
}
