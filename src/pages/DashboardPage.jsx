import { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Header } from '../components/organisms/Header';
import { Sidebar } from '../components/organisms/Sidebar';
import { InventoryTable } from '../components/organisms/InventoryTable';
import { AddNotebookForm } from '../components/organisms/AddNotebookForm';
import { SearchBox } from '../components/molecules/SearchBox';
import { useInventory } from '../context/InventoryContext';
import { Badge } from '../components/atoms/Badge';

export function DashboardPage() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { currentSector, searchQuery, setSearchQuery, SETORES_CONFIG, getFilteredData } = useInventory();
  
  const sectorConfig = currentSector !== 'todos' ? SETORES_CONFIG[currentSector] : null;
  const filteredCount = getFilteredData().length;

  return (
    <DashboardLayout
      header={<Header onAddClick={() => setIsAddFormOpen(!isAddFormOpen)} />}
      sidebar={<Sidebar />}
    >
      <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-surface shrink-0">
        <div className="text-[15px] font-semibold flex items-center gap-2.5">
          <span>{currentSector === 'todos' ? 'Todos os Setores' : currentSector}</span>
          {sectorConfig && (
            <Badge colorConfig={sectorConfig}>{filteredCount} notebooks</Badge>
          )}
        </div>
        <div className="ml-auto">
          <SearchBox 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Buscar usuário, computador..." 
          />
        </div>
      </div>

      <div className="pt-5 overflow-auto flex flex-col flex-1 relative">
        <div className="absolute top-5 inset-x-0 mx-6">
          <AddNotebookForm isOpen={isAddFormOpen} onClose={() => setIsAddFormOpen(false)} />
        </div>
        
        <div className={`flex flex-col flex-1 transition-all ${isAddFormOpen ? 'mt-[380px]' : ''}`}>
           <InventoryTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
