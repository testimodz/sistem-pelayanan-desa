import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,  // ✅ BARU - Icon Unarchive
} from '@heroicons/react/24/outline';
import { suratAPI } from '../services/api';
import { useAuth } from '../context/AuthContext'; // ✅ BARU

const ArsipSurat = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ BARU
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    loadArsip();
  }, [pagination.currentPage, search, kategori]);

  const loadArsip = async () => {
    try {
      setLoading(true);
      const response = await suratAPI.getArsip({
        page: pagination.currentPage,
        limit: 20,
        search,
        kategori,
      });

      setSuratList(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error loading arsip:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ BARU - Handle Unarchive
  const handleUnarchive = async (id) => {
    if (!window.confirm('Yakin ingin membatalkan arsip surat ini?')) return;

    try {
      await suratAPI.archive(id);
      alert('Surat berhasil dibatalkan dari arsip');
      loadArsip(); // Reload data
    } catch (error) {
      console.error('Error unarchiving surat:', error);
      alert('Gagal membatalkan arsip surat');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    loadArsip();
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Arsip Surat</h1>
          <p className="text-gray-600">Surat yang dibuat lebih dari 1 tahun lalu atau yang diarsipkan</p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 px-4 py-2 shadow-sm">
          <ArchiveBoxIcon className="h-5 w-5 text-amber-600" />
          <span className="font-semibold text-amber-700">{pagination.total} Arsip</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nomor surat, nama, atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>

          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="">Semua Kategori</option>
            <option value="layanan-umum">Layanan Umum</option>
            <option value="layanan-kependudukan">Layanan Kependudukan</option>
            <option value="layanan-nikah">Layanan Nikah</option>
            <option value="layanan-pertanahan">Layanan Pertanahan</option>
          </select>

          <button
            type="submit"
            className="flex items-center space-x-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 px-6 py-2.5 font-semibold text-white shadow-md shadow-green-500/20 transition hover:shadow-lg hover:shadow-green-500/30"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <ArrowPathIcon className="h-12 w-12 animate-spin text-green-500" />
          </div>
        ) : suratList.length === 0 ? (
          <div className="py-20 text-center">
            <ArchiveBoxIcon className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-gray-600">Tidak ada arsip surat</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Nomor Surat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Pemohon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {suratList.map((surat) => (
                  <tr key={surat._id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{surat.nomorSurat}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {surat.jenisSurat?.replace(/-/g, ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{surat.pemohon?.nama}</div>
                      <div className="text-sm text-gray-500">{surat.pemohon?.nik}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 capitalize">
                        {surat.kategoriSurat?.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(surat.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/surat/${surat._id}`)}
                          className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>Lihat</span>
                        </button>

                        {/* ✅ TOMBOL UNARCHIVE (cuma admin) */}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleUnarchive(surat._id)}
                            className="inline-flex items-center space-x-1 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 transition hover:bg-green-200"
                            title="Batalkan Arsip"
                          >
                            <ArrowUturnLeftIcon className="h-4 w-4" />
                            <span>Unarchive</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-600">
                Menampilkan {(pagination.currentPage - 1) * 20 + 1} -{' '}
                {Math.min(pagination.currentPage * 20, pagination.total)} dari {pagination.total} arsip
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArsipSurat;
