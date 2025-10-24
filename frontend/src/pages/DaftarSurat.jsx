import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UsersIcon,
  HeartIcon,
  HomeIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  ArchiveBoxIcon  // ✅ BARU
} from '@heroicons/react/24/outline';
import { suratAPI } from '../services/api';
import { formatDate } from '../utils/dateFormatter';
import { useAuth } from '../context/AuthContext'; // ✅ BARU

const DaftarSurat = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ BARU
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('semua');
  const [selectedJenis, setSelectedJenis] = useState('semua');

  // Kategori surat
  const kategoriList = [
    {
      id: 'semua',
      nama: 'Semua Surat',
      icon: DocumentTextIcon,
      color: 'blue',
      jumlah: 0
    },
    {
      id: 'layanan-umum',
      nama: 'Layanan Umum',
      icon: DocumentTextIcon,
      color: 'blue',
      jumlah: 15
    },
    {
      id: 'layanan-kependudukan',
      nama: 'Layanan Kependudukan',
      icon: UsersIcon,
      color: 'green',
      jumlah: 28
    },
    {
      id: 'layanan-nikah',
      nama: 'Layanan Nikah',
      icon: HeartIcon,
      color: 'pink',
      jumlah: 9
    },
    {
      id: 'layanan-pertanahan',
      nama: 'Layanan Pertanahan',
      icon: HomeIcon,
      color: 'orange',
      jumlah: 5
    },
    {
      id: 'layanan-lainnya',
      nama: 'Layanan Lainnya',
      icon: EllipsisHorizontalIcon,
      color: 'purple',
      jumlah: 3
    }
  ];

  useEffect(() => {
    loadSurat();
  }, []);

  const loadSurat = async () => {
    try {
      setLoading(true);
      const response = await suratAPI.getAll();
      setSurat(response.data.data || []);
    } catch (error) {
      console.error('Error loading surat:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ BARU - Handle Archive
  const handleArchive = async (id, isArchived) => {
    const confirmMsg = isArchived 
      ? 'Yakin ingin membatalkan arsip surat ini?' 
      : 'Yakin ingin mengarsipkan surat ini?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await suratAPI.archive(id);
      const successMsg = isArchived 
        ? 'Surat berhasil dibatalkan dari arsip' 
        : 'Surat berhasil diarsipkan';
      alert(successMsg);
      loadSurat();
    } catch (error) {
      console.error('Error archiving surat:', error);
      alert('Gagal mengarsipkan surat');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus surat ini?')) return;

    try {
      await suratAPI.delete(id);
      alert('Surat berhasil dihapus');
      loadSurat();
    } catch (error) {
      console.error('Error deleting surat:', error);
      alert('Gagal menghapus surat');
    }
  };

  const handlePrint = (id) => {
    navigate(`/surat/${id}`);
  };

  // Filter surat
  const filteredSurat = surat.filter((item) => {
    const matchSearch = 
      item.nomorSurat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemohon?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenisSurat?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchKategori = 
      selectedKategori === 'semua' || 
      item.kategoriSurat === selectedKategori;

    const matchJenis = 
      selectedJenis === 'semua' || 
      item.jenisSurat === selectedJenis;

    return matchSearch && matchKategori && matchJenis;
  });

  // Get unique jenis surat untuk filter dropdown
  const jenisSuratList = ['semua', ...new Set(surat.map(s => s.jenisSurat))];

  // Update jumlah per kategori
  const kategoriWithCount = kategoriList.map(kat => ({
    ...kat,
    jumlah: kat.id === 'semua' 
      ? surat.length 
      : surat.filter(s => s.kategoriSurat === kat.id).length
  }));

  const getKategoriColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Daftar Surat</h1>
        <p className="text-gray-600 mt-1">Pilih kategori surat yang ingin Anda lihat</p>
      </div>

      {/* Kategori Cards - COMPACT */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {kategoriWithCount.map((kategori) => {
          const Icon = kategori.icon;
          const isActive = selectedKategori === kategori.id;
          
          return (
            <button
              key={kategori.id}
              onClick={() => setSelectedKategori(kategori.id)}
              className={`relative overflow-hidden rounded-xl p-4 text-center transition-all duration-200 ${
                isActive
                  ? `bg-linear-to-br ${getKategoriColor(kategori.color)} text-white shadow-lg scale-105`
                  : 'bg-white hover:shadow-md border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                isActive ? 'bg-white/20' : `bg-${kategori.color}-100`
              }`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : `text-${kategori.color}-600`}`} />
              </div>
              <h3 className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                {kategori.nama}
              </h3>
              <div className={`mt-1 rounded-full px-2 py-0.5 text-xs font-bold inline-block ${
                isActive ? 'bg-white/20 text-white' : `bg-${kategori.color}-100 text-${kategori.color}-700`
              }`}>
                {kategori.jumlah} Jenis
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor surat, nama pemohon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        <select
          value={selectedJenis}
          onChange={(e) => setSelectedJenis(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          {jenisSuratList.map((jenis) => (
            <option key={jenis} value={jenis}>
              {jenis === 'semua' ? 'Semua Jenis' : jenis.replace(/-/g, ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Hasil Pencarian */}
      <div className="text-sm text-gray-600">
        Menampilkan {filteredSurat.length} dari {surat.length} surat
      </div>

      {/* Tabel Surat */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">No. Surat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Jenis Surat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Pemohon</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Tidak ada surat ditemukan
                  </td>
                </tr>
              ) : (
                filteredSurat.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-sm text-gray-800">
                      {item.nomorSurat || 'Belum ada nomor'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {item.jenisSurat?.replace(/-/g, ' ')}
                        </span>
                        {/* ✅ BADGE ARSIP */}
                        {item.isArchived && (
                          <span className="inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                            Arsip
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{item.pemohon?.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handlePrint(item._id)}
                          className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-200 transition"
                          title="Print"
                        >
                          <PrinterIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/surat/${item._id}`)}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 transition"
                          title="Lihat Detail"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/surat/edit/${item._id}`)}
                          className="rounded-lg bg-yellow-100 p-2 text-yellow-600 hover:bg-yellow-200 transition"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        
                        {/* ✅ TOMBOL ARSIPKAN (cuma admin) */}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleArchive(item._id, item.isArchived)}
                            className={`rounded-lg p-2 transition ${
                              item.isArchived
                                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            }`}
                            title={item.isArchived ? 'Batal Arsip' : 'Arsipkan'}
                          >
                            <ArchiveBoxIcon className="h-5 w-5" />
                          </button>
                        )}
                        
                        {/* ✅ TOMBOL HAPUS (cuma admin) */}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 transition"
                            title="Hapus"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DaftarSurat;
