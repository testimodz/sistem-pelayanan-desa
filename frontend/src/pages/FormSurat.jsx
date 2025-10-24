import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getAllJenisSurat } from '../data/jenisSurat';
import { suratAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formFieldsConfig } from '../data/formFields';
import GenericForm from '../components/surat-forms/GenericForm';

const FormSurat = () => {
  const { jenisSurat } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const allSurat = getAllJenisSurat();
  const suratInfo = allSurat.find((s) => s.id === jenisSurat);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data Pemohon State dengan date parts
  const [pemohonData, setPemohonData] = useState({
    nama: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: { day: '', month: '', year: '' }, // UBAH JADI OBJECT
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: '',
    alamat: '',
    noTelepon: '',
  });

  const handlePemohonChange = (e) => {
    setPemohonData({
      ...pemohonData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (type, value) => {
    setPemohonData({
      ...pemohonData,
      tanggalLahir: {
        ...pemohonData.tanggalLahir,
        [type]: value
      }
    });
  };

  const handleSubmit = async (dataSurat) => {
    setError('');
    setLoading(true);

    try {
      // Validasi data pemohon
      if (!pemohonData.nama || !pemohonData.nik || !pemohonData.alamat) {
        setError('Data pemohon (Nama, NIK, Alamat) harus diisi');
        setLoading(false);
        return;
      }

      let kategoriSurat = 'layanan-umum';
      if (jenisSurat.includes('kependudukan') || jenisSurat.includes('domisili') || jenisSurat.includes('kartu-keluarga')) {
        kategoriSurat = 'layanan-kependudukan';
      } else if (jenisSurat.includes('nikah')) {
        kategoriSurat = 'layanan-nikah';
      } else if (jenisSurat.includes('tanah') || jenisSurat.includes('sporadik')) {
        kategoriSurat = 'layanan-pertanahan';
      }

      // Parse dataSurat dates
      const parsedDataSurat = { ...dataSurat };
      Object.keys(parsedDataSurat).forEach(key => {
        if (key.toLowerCase().includes('tanggal') && parsedDataSurat[key]) {
          const dateValue = new Date(parsedDataSurat[key]);
          if (!isNaN(dateValue.getTime())) {
            parsedDataSurat[key] = dateValue.toISOString();
          }
        }
      });

      // Parse pemohon tanggalLahir dari 3 dropdown ke ISO format
      let tanggalLahirISO = null;
      const { day, month, year } = pemohonData.tanggalLahir;
      
      if (day && month && year) {
        // Build date as YYYY-MM-DD then convert to ISO
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateValue = new Date(dateStr);
        if (!isNaN(dateValue.getTime())) {
          tanggalLahirISO = dateValue.toISOString();
        }
      }

      const parsedPemohon = {
        nama: pemohonData.nama,
        nik: pemohonData.nik,
        tempatLahir: pemohonData.tempatLahir,
        tanggalLahir: tanggalLahirISO,
        jenisKelamin: pemohonData.jenisKelamin,
        agama: pemohonData.agama,
        pekerjaan: pemohonData.pekerjaan,
        alamat: pemohonData.alamat,
        noTelepon: pemohonData.noTelepon,
      };

      await suratAPI.create({
        jenisSurat: jenisSurat,
        kategoriSurat: kategoriSurat,
        pemohon: parsedPemohon,
        dataSurat: parsedDataSurat,
        keterangan: dataSurat.keperluan || dataSurat.keterangan || '',
      });
      
      navigate('/surat', { 
        state: { 
          message: 'Surat berhasil dibuat! Anda dapat mencetak surat dari daftar surat.' 
        } 
      });
    } catch (err) {
      console.error('Error saving surat:', err);
      setError(err.response?.data?.message || 'Gagal membuat surat. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const formConfig = formFieldsConfig[jenisSurat];

  if (!formConfig) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Form untuk jenis surat ini belum tersedia.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-green-600 hover:underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  // Generate arrays for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Kembali
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          {suratInfo?.nama || 'Form Surat'}
        </h1>
        <p className="mt-2 text-gray-600">
          Input data pemohon dan lengkapi data surat di bawah ini
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        
        {/* Data Pemohon Section */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-4 font-semibold text-gray-800 text-lg">Data Pemohon</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nama */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={pemohonData.nama}
                onChange={handlePemohonChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* NIK */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nik"
                value={pemohonData.nik}
                onChange={handlePemohonChange}
                required
                maxLength="16"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="16 digit NIK"
              />
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tempat Lahir
              </label>
              <input
                type="text"
                name="tempatLahir"
                value={pemohonData.tempatLahir}
                onChange={handlePemohonChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Kota/Kabupaten"
              />
            </div>

            {/* Tanggal Lahir - 3 DROPDOWN */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tanggal Lahir
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Tanggal (DD) */}
                <select
                  value={pemohonData.tanggalLahir.day}
                  onChange={(e) => handleDateChange('day', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Tgl</option>
                  {days.map(d => (
                    <option key={d} value={d}>{String(d).padStart(2, '0')}</option>
                  ))}
                </select>

                {/* Bulan (MM) */}
                <select
                  value={pemohonData.tanggalLahir.month}
                  onChange={(e) => handleDateChange('month', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Bulan</option>
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>

                {/* Tahun (YYYY) */}
                <select
                  value={pemohonData.tanggalLahir.year}
                  onChange={(e) => handleDateChange('year', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Tahun</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">Format: Tanggal / Bulan / Tahun</p>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Jenis Kelamin
              </label>
              <select
                name="jenisKelamin"
                value={pemohonData.jenisKelamin}
                onChange={handlePemohonChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Agama */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Agama
              </label>
              <select
                name="agama"
                value={pemohonData.agama}
                onChange={handlePemohonChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            {/* Pekerjaan */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pekerjaan
              </label>
              <input
                type="text"
                name="pekerjaan"
                value={pemohonData.pekerjaan}
                onChange={handlePemohonChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Contoh: Wiraswasta"
              />
            </div>

            {/* No Telepon */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                No. Telepon/HP
              </label>
              <input
                type="text"
                name="noTelepon"
                value={pemohonData.noTelepon}
                onChange={handlePemohonChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alamat"
                value={pemohonData.alamat}
                onChange={handlePemohonChange}
                required
                rows="3"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Alamat lengkap dengan RT/RW"
              />
            </div>
          </div>
        </div>

        {/* Generic Form untuk Data Surat */}
        <GenericForm 
          fields={formConfig.fields} 
          onSubmit={handleSubmit} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default FormSurat;
