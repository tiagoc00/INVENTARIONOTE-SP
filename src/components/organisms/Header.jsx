import { useRef } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Button } from '../atoms/Button';
import { ThemeToggle } from '../atoms/ThemeToggle';
import * as XLSX from 'xlsx';

export function Header({ onAddClick }) {
  const { lastSaved, exportCSV, addMultipleNotebooks } = useInventory();
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const mappedData = data.map(row => ({
          setor: row['Setor'] || row['setor'] || '',
          usuario: row['Usuário'] || row['Usuario'] || row['usuario'] || '',
          nb: row['Computador'] || row['nb'] || row['Computador / Hostname'] || '',
          marca: row['Marca/Modelo'] || row['Marca / Modelo'] || row['marca'] || row['Modelo'] || '',
          cpu: row['Processador'] || row['cpu'] || '',
          ram: row['RAM'] || row['Memória RAM'] || row['ram'] || '',
          hd: row['Armazenamento'] || row['HD/SSD'] || row['hd'] || '',
          serie: row['Nº Série'] || row['Nº de Série'] || row['serie'] || row['N_Serie'] || '',
          patri: row['Patrimônio'] || row['Nº Patrimônio'] || row['patri'] || row['Patrimonio'] || '',
          status: row['Status'] || row['status'] || 'Ativo',
          obs: row['Observações'] || row['Observacoes'] || row['obs'] || ''
        }));
        
        if (mappedData.length > 0) {
          const success = await addMultipleNotebooks(mappedData);
          if (success) {
            alert(`✅ ${mappedData.length} dispositivos importados com sucesso!`);
          }
        } else {
          alert('⚠ Nenhuma linha válida encontrada na planilha.');
        }
      } catch (err) {
        console.error("Erro na leitura da planilha", err);
        alert('❌ Erro ao processar o arquivo. Certifique-se de que é uma planilha válida.');
      }
      
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

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
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="w-px h-6 bg-border" />
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileUpload} 
        />
        <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
          📄 Importar
        </Button>
        <Button variant="ghost" onClick={exportCSV}>⬇ Exportar CSV</Button>
        <Button variant="primary" onClick={onAddClick}>＋ Adicionar Notebook</Button>
      </div>
    </header>
  );
}
