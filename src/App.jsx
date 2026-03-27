import { InventoryProvider } from './context/InventoryContext';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <InventoryProvider>
      <DashboardPage />
    </InventoryProvider>
  );
}

export default App;
