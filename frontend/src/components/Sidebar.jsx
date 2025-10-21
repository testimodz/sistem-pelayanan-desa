import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['warga', 'petugas', 'admin'] },
    { name: 'Buat Surat', href: '/surat/buat', icon: DocumentTextIcon, roles: ['warga'] },
    { name: 'Daftar Surat', href: '/surat', icon: DocumentTextIcon, roles: ['warga', 'petugas', 'admin'] },
    { name: 'Kelola Surat', href: '/surat/kelola', icon: ChartBarIcon, roles: ['petugas', 'admin'] },
    { name: 'Pengguna', href: '/pengguna', icon: UserGroupIcon, roles: ['admin'] },
    { name: 'Pengaturan', href: '/pengaturan', icon: Cog6ToothIcon, roles: ['warga', 'petugas', 'admin'] },
  ];

  const filteredNav = navigation.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Sistem Pelayanan Desa</h1>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold">
            {user?.nama?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{user?.nama}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-gray-300 transition-colors hover:bg-red-600 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
