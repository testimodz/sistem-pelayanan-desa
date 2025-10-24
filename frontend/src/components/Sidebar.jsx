import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,        // ✅ BARU
  ChartBarIcon,          // ✅ BARU
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['warga', 'petugas', 'admin'] },
    { name: 'Buat Surat', href: '/surat/buat', icon: PlusCircleIcon, roles: ['warga', 'petugas', 'admin'] },
    { name: 'Daftar Surat', href: '/surat', icon: ClipboardDocumentListIcon, roles: ['warga', 'petugas', 'admin'] },
    { name: 'Arsip Surat', href: '/arsip', icon: ArchiveBoxIcon, roles: ['petugas', 'admin'] }, // ✅ BARU
    { name: 'Laporan', href: '/laporan', icon: ChartBarIcon, roles: ['petugas', 'admin'] }, // ✅ BARU
    { name: 'Pengguna', href: '/pengguna', icon: UserGroupIcon, roles: ['admin'] },
    { name: 'Pengaturan', href: '/pengaturan', icon: Cog6ToothIcon, roles: ['warga', 'petugas', 'admin'] },
  ];

  const filteredNav = navigation.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-gradient-to-br from-green-600 to-emerald-600">
        <h1 className="text-lg font-bold text-white">Sistem Pelayanan Desa</h1>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 font-bold text-white shadow-md">
            {user?.nama?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{user?.nama}</p>
            <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/20'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-500'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
