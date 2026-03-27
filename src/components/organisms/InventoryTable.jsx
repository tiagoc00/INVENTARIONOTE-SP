import { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export function InventoryTable() {
  const { getFilteredData, SETORES_CONFIG, cycleStatus, deleteNotebook, updateNotebook, isLoading } = useInventory();
  const data = getFilteredData();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  if (isLoading) {
    return (
      <div className="text-center py-16 px-5 text-text-muted">
        <div className="animate-spin text-4xl mb-3">⏳</div>
        <p className="text-sm">Conectando ao banco de dados...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16 px-5 text-text-muted">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-sm">Nenhum notebook encontrado.</p>
      </div>
    );
  }

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    Object.keys(editForm).forEach(key => {
      updateNotebook(editingId, key, editForm[key]);
    });
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div className="flex-1 overflow-auto px-6 py-5">
      <table className="w-full border-separate border-spacing-0 text-[13px]">
        <thead>
          <tr>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap rounded-tl-lg">Setor</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Usuário</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Computador</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Marca / Modelo</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Processador</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">RAM</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Armazenamento</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Nº Série</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Patrimônio</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Status</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap">Observações</th>
            <th className="bg-surface2 text-text-dim font-semibold text-[11px] tracking-[0.5px] uppercase p-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap rounded-tr-lg">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => {
            const isEditing = editingId === d.id;
            const cfg = SETORES_CONFIG[d.setor] || { cor: "#555", cl: "#222", tag: "#aaa" };
            
            return (
              <tr key={d.id} className={`border-b border-border transition-colors hover:bg-surface2 ${isEditing ? 'bg-[#1a2040] outline outline-1 outline-accent -outline-offset-1 z-0 relative' : ''}`}>
                <td className="p-2.5 align-middle border-b border-border">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.cor }} />
                    <span className="text-xs font-semibold" style={{ color: cfg.tag }}>{d.setor}</span>
                  </span>
                </td>
                <td className="p-2.5 align-middle border-b border-border">
                  {isEditing ? <Input name="usuario" value={editForm.usuario} onChange={handleEditChange} className="py-1 px-2 h-7" /> : d.usuario}
                </td>
                <td className="p-2.5 align-middle border-b border-border font-mono text-xs whitespace-nowrap">
                  {isEditing ? <Input name="nb" value={editForm.nb} onChange={handleEditChange} className="py-1 px-2 h-7 font-mono text-xs" /> : d.nb}
                </td>
                <td className="p-2.5 align-middle border-b border-border whitespace-nowrap">
                  {isEditing ? <Input name="marca" value={editForm.marca} onChange={handleEditChange} className="py-1 px-2 h-7" /> : d.marca}
                </td>
                <td className="p-2.5 align-middle border-b border-border">
                  {isEditing ? <Input name="cpu" value={editForm.cpu} onChange={handleEditChange} className="py-1 px-2 h-7" /> : d.cpu}
                </td>
                <td className="p-2.5 align-middle border-b border-border whitespace-nowrap">
                  {isEditing ? <Input name="ram" value={editForm.ram} onChange={handleEditChange} className="py-1 px-2 h-7" /> : d.ram}
                </td>
                <td className="p-2.5 align-middle border-b border-border whitespace-nowrap">
                  {isEditing ? <Input name="hd" value={editForm.hd} onChange={handleEditChange} className="py-1 px-2 h-7" /> : d.hd}
                </td>
                <td className="p-2.5 align-middle border-b border-border font-mono text-xs">
                  {isEditing ? <Input name="serie" value={editForm.serie} onChange={handleEditChange} className="py-1 px-2 h-7 font-mono text-xs" /> : d.serie}
                </td>
                <td className="p-2.5 align-middle border-b border-border font-mono text-xs">
                  {isEditing ? <Input name="patri" value={editForm.patri} onChange={handleEditChange} className="py-1 px-2 h-7 font-mono text-xs" /> : d.patri}
                </td>
                <td className="p-2.5 align-middle border-b border-border">
                  <button 
                    onClick={() => cycleStatus(d.id)}
                    className="border-none font-inherit cursor-pointer bg-transparent p-0"
                  >
                    <Badge className={
                      d.status === 'Ativo' ? 'bg-[#0f3d22] !text-[#2ecc71] !border-none' :
                      d.status === 'Inativo' ? 'bg-[#3d0f0f] !text-[#e74c3c] !border-none' :
                      'bg-[#3d2e0a] !text-[#f0c030] !border-none'
                    }>
                      {d.status === 'Ativo' ? '●' : d.status === 'Inativo' ? '○' : '⚙'} {d.status}
                    </Badge>
                  </button>
                </td>
                <td className="p-2.5 align-middle border-b border-border">
                  {isEditing ? <Input name="obs" value={editForm.obs} onChange={handleEditChange} className="py-1 px-2 h-7" /> : <div className="max-w-[150px] truncate" title={d.obs}>{d.obs}</div>}
                </td>
                <td className="p-2.5 align-middle border-b border-border">
                  <div className="flex gap-1.5 whitespace-nowrap">
                    {isEditing ? (
                      <>
                        <Button variant="success" size="sm" onClick={saveEdit}>✓</Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>✕</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(d)}>✎</Button>
                        <Button variant="danger" size="sm" onClick={() => { if(confirm('Remover?')) deleteNotebook(d.id) }}>🗑</Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
