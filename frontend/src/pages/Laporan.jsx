import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { suratAPI } from '../services/api';

const Laporan = () => {
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);

  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  useEffect(() => {
    loadLaporan();
  }, [tahun, bulan]);

  const loadLaporan = async () => {
    try {
      setLoading(true);
      const response = await suratAPI.getLaporan({ tahun, bulan });
      setLaporan(response.data);
    } catch (error) {
      console.error('Error loading laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ArrowPathIcon className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan & Statistik</h1>
          <p className="text-gray-600">Ringkasan data surat dan statistik</p>
        </div>
      </div>

      {/* Filter Tahun & Bulan */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6 text-gray-600" />
          <select
            value={tahun}
            onChange={(e) => setTahun(parseInt(e.target.value))}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={bulan}
            onChange={(e) => setBulan(parseInt(e.target.value))}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            {namaBulan.map((nama, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-linear-to-brrom-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Surat</p>
              <p className="mt-2 text-3xl font-bold">{laporan?.totalSurat || 0}</p>
            </div>
            <ChartBarIcon className="h-12 w-12 opacity-50" />
          </div>
        </div>

        <div className="rounded-xl bg-linear-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Surat Bulan Ini</p>
              <p className="mt-2 text-3xl font-bold">{laporan?.suratBulanIni || 0}</p>
            </div>
            <CalendarIcon className="h-12 w-12 opacity-50" />
          </div>
        </div>

        <div className="rounded-xl bg-linear-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Surat Tahun Ini</p>
              <p className="mt-2 text-3xl font-bold">{laporan?.suratTahunIni || 0}</p>
            </div>
            <DocumentTextIcon className="h-12 w-12 opacity-50" />
          </div>
        </div>
      </div>

      {/* Surat per Kategori */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Surat per Kategori</h2>
        <div className="space-y-3">
          {laporan?.suratPerKategori?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-green-300 hover:bg-green-50"
            >
              <span className="font-semibold capitalize text-gray-700">
                {item.kategori.replace(/-/g, ' ')}
              </span>
              <span className="text-2xl font-bold text-green-600">{item.jumlah}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Jenis Surat */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Top 10 Jenis Surat</h2>
        <div className="space-y-3">
          {laporan?.suratPerJenis?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-blue-50"
            >
              <span className="font-medium capitalize text-gray-700">
                {item.jenis.replace(/-/g, ' ')}
              </span>
              <span className="text-xl font-bold text-blue-600">{item.jumlah}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Surat per Bulan */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Surat per Bulan (Tahun {tahun})
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {laporan?.suratPerBulan?.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 p-4 text-center transition hover:border-green-300 hover:bg-green-50"
            >
              <p className="text-sm font-semibold text-gray-600">{namaBulan[idx]}</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{item.jumlah}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Laporan;
