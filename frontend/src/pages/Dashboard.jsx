import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateFormatter'; // IMPORT INI

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisMonth: 0,
    thisYear: 0,
    byKategori: {},
    topJenisSurat: [],
  });
  const [recentSurat, setRecentSurat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, recentRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentSurat(5),
      ]);
      
      setStats(statsRes.data);
      setRecentSurat(recentRes.data.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Surat',
      value: stats.total,
      icon: DocumentTextIcon,
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Hari Ini',
      value: stats.today,
      icon: ClockIcon,
      color: 'green',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Bulan Ini',
      value: stats.thisMonth,
      icon: CalendarIcon,
      color: 'purple',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Tahun Ini',
      value: stats.thisYear,
      icon: ArrowTrendingUpIcon,
      color: 'orange',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  const kategoriList = [
    { key: 'layanan-umum', label: 'Layanan Umum', color: 'blue' },
    { key: 'layanan-kependudukan', label: 'Layanan Kependudukan', color: 'green' },
    { key: 'layanan-nikah', label: 'Layanan Nikah', color: 'pink' },
    { key: 'layanan-pertanahan', label: 'Layanan Pertanahan', color: 'yellow' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Kelurahan Sindangrasa
        </h1>
        <p className="mt-2 text-gray-600">
          Selamat datang, <span className="font-semibold">{user?.nama}</span>!
        </p>
      </div>

      {/* Quick Action */}
      <div className="mb-8 rounded-2xl border border-green-200 bg-linear-to-r from-green-50 to-emerald-50 p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Buat Surat Baru</h2>
            <p className="mt-1 text-sm text-gray-600">
              Input data pemohon dan cetak surat dengan cepat
            </p>
          </div>
          <button
            onClick={() => navigate('/surat/buat')}
            className="flex items-center space-x-2 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Buat Surat</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`rounded-xl ${stat.lightBg} p-3`}>
                <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 h-1 w-full ${stat.bgColor} transform transition-transform duration-300 group-hover:scale-x-100`}
            ></div>
          </div>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Surat by Kategori */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Surat Per Kategori</h2>
            <ChartBarIcon className="h-6 w-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            {kategoriList.map((kategori) => {
              const count = stats.byKategori[kategori.key] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <div key={kategori.key}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{kategori.label}</span>
                    <span className="font-bold text-gray-800">{count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full bg-${kategori.color}-500 transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Jenis Surat */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-6 text-xl font-bold text-gray-800">Surat Terbanyak</h2>
          
          {stats.topJenisSurat && stats.topJenisSurat.length > 0 ? (
            <div className="space-y-4">
              {stats.topJenisSurat.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {item._id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">Belum ada data</p>
          )}
        </div>
      </div>

      {/* Recent Surat */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Surat Terbaru</h2>
          <button
            onClick={() => navigate('/surat')}
            className="text-sm font-semibold text-green-600 transition-colors hover:text-green-700"
          >
            Lihat Semua →
          </button>
        </div>

        {recentSurat.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    No. Surat
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Pemohon
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Jenis Surat
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentSurat.map((surat) => (
                  <tr key={surat._id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {surat.nomorSurat || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {surat.pemohon?.nama || '-'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {surat.pemohon?.nik || '-'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {surat.jenisSurat.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(surat.tanggalSelesai || surat.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => navigate(`/surat/${surat._id}`)}
                        className="rounded-lg bg-green-100 px-4 py-2 text-xs font-semibold text-green-700 transition-colors hover:bg-green-200"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">Belum ada surat dibuat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
