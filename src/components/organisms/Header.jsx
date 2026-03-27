import { useInventory } from '../../context/InventoryContext';
import { Button } from '../atoms/Button';

export function Header({ onAddClick }) {
  const { lastSaved, exportCSV } = useInventory();

  return (
    <header className="bg-surface border-b border-border px-8 h-16 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-lg">
          💻
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-[0.3px] m-0">Inventário de Notebooks</h1>
          <span className="text-xs text-text-dim mt-0.5 block">{lastSaved}</span>
        </div>
      </div>
      <div className="flex gap-2.5">
        <Button variant="ghost" onClick={exportCSV}>⬇ Exportar CSV</Button>
        <Button variant="primary" onClick={onAddClick}>＋ Adicionar Notebook</Button>
      </div>
    </header>
  );
}
