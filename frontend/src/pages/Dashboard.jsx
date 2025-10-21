import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Surat</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Surat Diproses</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Surat Selesai</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Selamat Datang, {user?.nama}!
        </h2>
        <p className="text-gray-600">
          Role: <span className="font-semibold capitalize">{user?.role}</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
