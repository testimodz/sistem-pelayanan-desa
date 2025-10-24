import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PilihKategoriSurat from './pages/PilihKategoriSurat';
import PilihJenisSurat from './pages/PilihJenisSurat';
import FormSurat from './pages/FormSurat';
import DaftarSurat from './pages/DaftarSurat';
import DetailSurat from './pages/DetailSurat';
import EditSurat from './pages/EditSurat';
import ArsipSurat from './pages/ArsipSurat';
import Laporan from './pages/Laporan';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ✅ CUMA LOGIN - HAPUS REGISTER & FORGOT PASSWORD */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Surat Routes */}
        <Route path="surat" element={<DaftarSurat />} />
        <Route path="surat/buat" element={<PilihKategoriSurat />} />
        <Route path="surat/pilih/:kategori" element={<PilihJenisSurat />} />
        <Route path="surat/form/:jenisSurat" element={<FormSurat />} />
        <Route path="surat/edit/:id" element={<EditSurat />} />
        <Route path="surat/:id" element={<DetailSurat />} />
        
        {/* Arsip & Laporan Routes */}
        <Route path="arsip" element={<ArsipSurat />} />
        <Route path="laporan" element={<Laporan />} />
      </Route>

      {/* 404 - Redirect ke login atau dashboard */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
