import React, { useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#4f8ef7', '#2ecc71', '#f0c030', '#e74c3c', '#9b59b6', '#3498db', '#e67e22'];

export function AnalyticsDashboard() {
  const { getFilteredData, SETORES_CONFIG } = useInventory();
  const data = getFilteredData();

  const { brandsData, ramData, sectorData } = useMemo(() => {
    // 1. Marcas (Proporção de equipamentos por fabricante)
    const brandsCount = data.reduce((acc, curr) => {
      let brand = (curr.marca || '').toLowerCase();
      if (brand.includes('dell')) brand = 'Dell';
      else if (brand.includes('hp')) brand = 'HP';
      else if (brand.includes('lenovo')) brand = 'Lenovo';
      else if (brand.includes('apple') || brand.includes('mac')) brand = 'Apple';
      else if (brand.includes('acer')) brand = 'Acer';
      else if (brand.includes('asus')) brand = 'Asus';
      else if (brand.includes('sams')) brand = 'Samsung';
      else if (brand.includes('vaio')) brand = 'Vaio';
      else brand = brand.trim() ? 'Outros' : 'Não Informado';

      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {});
    const brandsData = Object.entries(brandsCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 2. Obsolescência de RAM
    const ramCount = data.reduce((acc, curr) => {
      let ramStr = (curr.ram || '').toLowerCase();
      let val = 'Desconhecido';
      
      // Usa regex simples para procurar números associados a GB
      const match = ramStr.match(/(\d+)\s*(g|gb)/i);
      let num = match ? parseInt(match[1], 10) : 0;
      
      if (!num && ramStr.includes('4')) num = 4;
      if (!num && ramStr.includes('8')) num = 8;
      if (!num && ramStr.includes('16')) num = 16;
      if (!num && ramStr.includes('32')) num = 32;

      if (num > 0 && num <= 4) val = '≤ 4GB (Crítico)';
      else if (num > 4 && num <= 8) val = '8GB (Atenção)';
      else if (num > 8 && num <= 16) val = '16GB (Ideal)';
      else if (num > 16) val = '> 16GB (Alta Perf.)';
      
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    
    const ramOrdering = { '≤ 4GB (Crítico)': 1, '8GB (Atenção)': 2, '16GB (Ideal)': 3, '> 16GB (Alta Perf.)': 4, 'Desconhecido': 5 };
    const ramData = Object.entries(ramCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => ramOrdering[a.name] - ramOrdering[b.name]);

    // 3. Problemas por Setor (Máquinas quebrando ou inativas)
    const problematic = data.filter(d => d.status === 'Manutenção' || d.status === 'Inativo');
    const sectorIssues = problematic.reduce((acc, curr) => {
      const s = curr.setor || 'Sem setor';
      if (!acc[s]) {
        acc[s] = { setor: s, 'Manutenção': 0, 'Inativos': 0 };
      }
      if (curr.status === 'Manutenção') acc[s]['Manutenção'] += 1;
      if (curr.status === 'Inativo') acc[s]['Inativos'] += 1;
      return acc;
    }, {});
    const sectorData = Object.values(sectorIssues).sort((a, b) => (b['Manutenção'] + b['Inativos']) - (a['Manutenção'] + a['Inativos']));

    return { brandsData, ramData, sectorData };
  }, [data]);

  // Cores customizadas para o Tooltip do Recharts no Dark Mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-xl text-sm">
          <p className="font-semibold text-text mb-2 border-b border-border pb-1">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Visão Geral (Analytics)</h2>
          <p className="text-sm text-text-muted mt-1">Análise consolidada baseada nos filtros selecionados ({data.length} cadastradas).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Marcas */}
        <div className="bg-surface2 border border-border rounded-xl p-5 flex flex-col h-[380px]">
          <h3 className="text-[13px] font-semibold text-text-dim uppercase tracking-[1px] mb-4">Proporção por Fabricante</h3>
          <div className="flex-1 min-h-0">
            {brandsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {brandsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted text-sm">Sem dados suficientes</div>
            )}
          </div>
        </div>

        {/* Card: RAM */}
        <div className="bg-surface2 border border-border rounded-xl p-5 flex flex-col h-[380px]">
          <h3 className="text-[13px] font-semibold text-text-dim uppercase tracking-[1px] mb-4">Obsolescência de Memória (RAM)</h3>
          <div className="flex-1 min-h-0">
            {ramData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ramData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    stroke="#1a1c23" // Aproximando a cor de fundo surface2 para destacar no dark mode
                    strokeWidth={2}
                  >
                    {ramData.map((entry, index) => {
                      let color = COLORS[index % COLORS.length];
                      if(entry.name.includes('Crítico')) color = '#e74c3c';
                      else if(entry.name.includes('Atenção')) color = '#f0c030';
                      else if(entry.name.includes('Ideal')) color = '#3498db';
                      else if(entry.name.includes('Alta Perf')) color = '#2ecc71';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted text-sm">Sem dados de RAM disponíveis</div>
            )}
          </div>
        </div>

        {/* Card: Problemas por Setor */}
        <div className="bg-surface2 border border-border rounded-xl p-5 flex flex-col h-[380px] md:col-span-2">
          <h3 className="text-[13px] font-semibold text-text-dim uppercase tracking-[1px] mb-4">Setores com mais problemas (Manutenção/Inativos)</h3>
          <div className="flex-1 min-h-0">
            {sectorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3d" vertical={false} />
                  <XAxis dataKey="setor" stroke="#8892b0" tick={{ fill: '#8892b0', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8892b0" tick={{ fill: '#8892b0', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#2a2e3d', opacity: 0.4 }} content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Manutenção" stackId="a" fill="#f0c030" radius={[0, 0, 4, 4]} barSize={40} />
                  <Bar dataKey="Inativos" stackId="a" fill="#e74c3c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-text-muted text-sm gap-2">
                <span className="text-3xl">🎉</span>
                Nenhuma máquina quebrando ou inativa neste filtro!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
