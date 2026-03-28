import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  writeBatch
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
  const [activeView, setActiveView] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSaved, setLastSaved] = useState("Conectando ao Firebase...");
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  // Real-time synchronization with Firestore
  useEffect(() => {
    setIsLoading(true);
    setConnectionError(null);
    let unsubscribe = null;
    let timeoutId = null;

    // Timeout de 15s para não ficar travado em "Conectando..."
    timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("Timeout de conexão ao Firestore (15s)");
        setIsLoading(false);
        setConnectionError("timeout");
        setLastSaved("⚠ Conexão lenta — dados podem não estar atualizados");
      }
    }, 15000);

    const startListener = (q, isRetry = false) => {
      return onSnapshot(q, (snapshot) => {
        // Conexão bem-sucedida — limpar timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        const items = snapshot.docs.map(d => ({
          ...d.data(),
          id: d.id
        }));
        // Ordena localmente se a query não tem orderBy (fallback)
        if (isRetry) {
          items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        }
        setData(items);
        setIsLoading(false);
        setConnectionError(null);
        setLastSaved(`Atualizado: ${new Date().toLocaleTimeString('pt-BR')}`);
      }, (error) => {
        console.error("Erro no Firestore:", error.code, error.message);

        // Limpar timeout em caso de erro
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // Se a consulta ordenada falhar, tenta sem o orderBy
        if (!isRetry) {
          console.warn("Tentando consulta sem orderBy...");
          unsubscribe = startListener(collection(db, "notebooks"), true);
          return;
        }

        // Se ambas falharam, mostra mensagem de acordo com o erro
        setIsLoading(false);
        if (error.code === 'permission-denied') {
          setConnectionError("permission");
          setLastSaved("⚠ Sem permissão — verifique as regras do Firestore");
        } else if (error.code === 'unavailable') {
          setConnectionError("offline");
          setLastSaved("⚠ Sem conexão com a internet");
        } else {
          setConnectionError("error");
          setLastSaved(`Erro: ${error.code || error.message}`);
        }
      });
    };

    const orderedQuery = query(collection(db, "notebooks"), orderBy("createdAt", "desc"));
    unsubscribe = startListener(orderedQuery);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Migração automática do LocalStorage antigo para o Firebase
  useEffect(() => {
    const migrateData = async () => {
      try {
        const localData = localStorage.getItem("inventario_nb");
        if (localData) {
          const parsedData = JSON.parse(localData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log(`Migrando ${parsedData.length} notebooks antigos para o Firebase...`);
            
            for (const notebook of parsedData) {
              const { id, ...notebookData } = notebook;
              await addDoc(collection(db, "notebooks"), {
                ...notebookData,
                createdAt: new Date().toISOString()
              });
            }
            // Remove o cache antigo após a migração para não duplicar no futuro
            localStorage.removeItem("inventario_nb");
            console.log("Migração concluída com sucesso!");
          }
        }
      } catch (err) {
        console.error("Erro durante a migração do LocalStorage:", err);
      }
    };

    migrateData();
  }, []);

  const addNotebook = async (notebook) => {
    try {
      await addDoc(collection(db, "notebooks"), {
        ...notebook,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      throw error; // Re-throw para que o chamador possa tratar
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

  const bulkUpdateNotebook = async (id, fields) => {
    try {
      const docRef = doc(db, "notebooks", id);
      await updateDoc(docRef, fields);
    } catch (error) {
      console.error("Erro ao atualizar em lote:", error);
      alert("Erro ao atualizar o notebook.");
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

  const addMultipleNotebooks = async (notebooksList) => {
    try {
      const batch = writeBatch(db);
      notebooksList.forEach(notebook => {
        const docRef = doc(collection(db, "notebooks"));
        batch.set(docRef, {
          ...notebook,
          createdAt: new Date().toISOString()
        });
      });
      await batch.commit();
      return true;
    } catch (error) {
      console.error("Erro ao importar em lote:", error);
      alert("Erro ao salvar no banco de dados.");
      return false;
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
      data, currentSector, setCurrentSector, activeView, setActiveView, searchQuery, setSearchQuery,
      lastSaved, isLoading, addNotebook, updateNotebook, bulkUpdateNotebook, cycleStatus, deleteNotebook,
      addMultipleNotebooks, getFilteredData, getSummary, exportCSV, SETORES_CONFIG
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
