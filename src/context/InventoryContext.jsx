import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../services/firebase';

const InventoryContext = createContext();

const SETORES_CONFIG = {
  "TI":                   { cor: "#2471A3", cl: "#1a3a5c", tag: "#4a9fd4" },
  "RH":                   { cor: "#1E8449", cl: "#0f3d22", tag: "#2ecc71" },
  "Financeiro":           { cor: "#B7950B", cl: "#4a3a04", tag: "#f0c030" },
  "Diretoria":            { cor: "#922B21", cl: "#3d1008", tag: "#e74c3c" },
  "Comercial/Vendas":     { cor: "#6C3483", cl: "#2d1238", tag: "#9b59b6" },
  "Operações":            { cor: "#1A5276", cl: "#0a2030", tag: "#3498db" },
  "Auditoria":            { cor: "#7D6608", cl: "#352a02", tag: "#d4ac0d" },
  "Departamento Pessoal": { cor: "#154360", cl: "#091c2b", tag: "#2980b9" },
  "Marketing":            { cor: "#784212", cl: "#321608", tag: "#e67e22" },
};

const STATUS_CYCLE = ["Ativo", "Inativo", "Manutenção"];

export function InventoryProvider({ children }) {
  const [data, setData] = useState([]);
  const [currentSector, setCurrentSector] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSaved, setLastSaved] = useState("Conectado ao Firebase Cloud");
  const [isLoading, setIsLoading] = useState(true);

  // Real-time synchronization with Firestore
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "notebooks"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setData(items);
      setIsLoading(false);
      setLastSaved(`Atualizado: ${new Date().toLocaleTimeString('pt-BR')}`);
    }, (error) => {
      console.error("Erro ao ler do Firebase:", error);
      setIsLoading(false);
      setLastSaved("Erro na conexão com Banco de Dados");
    });

    return () => unsubscribe();
  }, []);

  const addNotebook = async (notebook) => {
    try {
      await addDoc(collection(db, "notebooks"), {
        ...notebook,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao salvar no banco de dados.");
    }
  };

  const updateNotebook = async (id, field, value) => {
    try {
      const docRef = doc(db, "notebooks", id);
      await updateDoc(docRef, { [field]: value });
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const cycleStatus = async (id) => {
    const item = data.find(d => d.id === id);
    if (!item) return;
    const i = STATUS_CYCLE.indexOf(item.status);
    const newStatus = STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length] || "Ativo";
    await updateNotebook(id, "status", newStatus);
  };

  const deleteNotebook = async (id) => {
    try {
      await deleteDoc(doc(db, "notebooks", id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const getFilteredData = () => {
    let rows = currentSector === "todos" ? data : data.filter(d => d.setor === currentSector);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(d => Object.values(d).some(v => String(v).toLowerCase().includes(q)));
    }
    return rows;
  };

  const getSummary = () => {
    const filtered = currentSector === "todos" ? data : data.filter(d => d.setor === currentSector);
    return {
      total: filtered.length,
      ativos: filtered.filter(d => d.status === "Ativo").length,
      inativos: filtered.filter(d => d.status === "Inativo").length,
      manutencao: filtered.filter(d => d.status === "Manutenção").length,
    };
  };

  const exportCSV = () => {
    const rows = [["Setor","Usuário","Computador","Marca/Modelo","Processador","RAM","Armazenamento","Nº Série","Patrimônio","Status","Observações"]];
    data.forEach(d => rows.push([d.setor,d.usuario,d.nb,d.marca,d.cpu,d.ram,d.hd,d.serie,d.patri,d.status,d.obs]));
    const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g,'""')}"`).join(";")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
    a.download = "inventario_notebooks.csv";
    a.click();
  };

  return (
    <InventoryContext.Provider value={{
      data, currentSector, setCurrentSector, searchQuery, setSearchQuery,
      lastSaved, isLoading, addNotebook, updateNotebook, cycleStatus, deleteNotebook,
      getFilteredData, getSummary, exportCSV, SETORES_CONFIG
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
