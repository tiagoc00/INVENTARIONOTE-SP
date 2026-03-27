import { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

export function AddNotebookForm({ isOpen, onClose }) {
  const { addNotebook, SETORES_CONFIG } = useInventory();
  
  const initialForm = {
    setor: '', usuario: '', nb: '', marca: '', cpu: '', ram: '', hd: '', serie: '', patri: '', status: 'Ativo', obs: ''
  };
  const [form, setForm] = useState(initialForm);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.setor) return alert('⚠ Selecione um setor!');
    if (!form.usuario) return alert('⚠ Informe o nome do usuário!');
    
    addNotebook(form);
    setForm(initialForm);
    onClose();
  };

  return (
    <div className="mx-6 mb-5 bg-surface2 border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-4 text-text-dim">➕ Novo Notebook</h3>
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mb-4">
        <FormField 
          label="Setor" type="select" name="setor" value={form.setor} onChange={handleChange}
          options={[
            { value: '', label: 'Selecione...' },
            ...Object.keys(SETORES_CONFIG).map(s => ({ value: s, label: s }))
          ]}
        />
        <FormField label="Nome do Usuário" name="usuario" value={form.usuario} onChange={handleChange} placeholder="Ex: João Silva" />
        <FormField label="Nome do Computador" name="nb" value={form.nb} onChange={handleChange} placeholder="Ex: NB-TI-001" />
        <FormField label="Marca / Modelo" name="marca" value={form.marca} onChange={handleChange} placeholder="Ex: Dell Latitude 5420" />
        <FormField label="Processador" name="cpu" value={form.cpu} onChange={handleChange} placeholder="Ex: Intel i5-1135G7" />
        <FormField label="Memória RAM" name="ram" value={form.ram} onChange={handleChange} placeholder="Ex: 16 GB DDR4" />
        <FormField label="Armazenamento" name="hd" value={form.hd} onChange={handleChange} placeholder="Ex: 512 GB SSD" />
        <FormField label="Nº de Série" name="serie" value={form.serie} onChange={handleChange} placeholder="Ex: SN123456789" />
        <FormField label="Nº Patrimônio" name="patri" value={form.patri} onChange={handleChange} placeholder="Ex: PAT-00123" />
        <FormField 
          label="Status" type="select" name="status" value={form.status} onChange={handleChange}
          options={[
            { value: 'Ativo', label: 'Ativo' },
            { value: 'Inativo', label: 'Inativo' },
            { value: 'Manutenção', label: 'Manutenção' }
          ]}
        />
        <FormField label="Observações" name="obs" value={form.obs} onChange={handleChange} placeholder="Observações gerais..." />
      </div>

      <div className="flex gap-2.5">
        <Button variant="success" onClick={handleSave}>✓ Salvar</Button>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
      </div>
    </div>
  );
}
