import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import ListingDetail from './pages/ListingDetail';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Rooms from './pages/Rooms';
import Billing from './pages/Billing';
import Payments from './pages/Payments';
import Receipts from './pages/Receipts';
import ReceiptView from './pages/ReceiptView';
import Electricity from './pages/Electricity';
import Food from './pages/Food';
import Compliance from './pages/Compliance';
import Leads from './pages/Leads';
import { useAuth } from './lib/auth';
import { useTheme } from './lib/theme';

function ThemeSync() {
  const theme = useTheme((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const owner = useAuth((s) => s.owner);
  if (!owner) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <ThemeSync />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/receipts/:id" element={<ReceiptView />} />
          <Route path="/electricity" element={<Electricity />} />
          <Route path="/food" element={<Food />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </>
  );
}
