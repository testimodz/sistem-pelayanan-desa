import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { suratAPI } from '../services/api';
import { formFieldsConfig } from '../data/formFields';
import GenericForm from '../components/surat-forms/GenericForm';
import { formatDateForInput } from '../utils/dateFormatter'; // IMPORT INI

const EditSurat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [surat, setSurat] = useState(null);
  
  const [pemohonData, setPemohonData] = useState({
    nama: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: '',
    alamat: '',
    noTelepon: '',
  });

  useEffect(() => {
    loadSurat();
  }, [id]);

  const loadSurat = async () => {
    setLoading(true);
    try {
      const { data } = await suratAPI.getById(id);
      setSurat(data.data);
      
      setPemohonData({
        nama: data.data.pemohon?.nama || '',
        nik: data.data.pemohon?.nik || '',
        tempatLahir: data.data.pemohon?.tempatLahir || '',
        tanggalLahir: formatDateForInput(data.data.pemohon?.tanggalLahir), // PAKAI FORMAT
        jenisKelamin: data.data.pemohon?.jenisKelamin || 'Laki-laki',
        agama: data.data.pemohon?.agama || 'Islam',
        pekerjaan: data.data.pemohon?.pekerjaan || '',
        alamat: data.data.pemohon?.alamat || '',
        noTelepon: data.data.pemohon?.noTelepon || '',
      });
    } catch (error) {
      console.error('Error loading surat:', error);
      alert('Gagal memuat data surat');
      navigate('/surat');
    } finally {
      setLoading(false);
    }
  };

  const handlePemohonChange = (e) => {
    setPemohonData({
      ...pemohonData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (dataSurat) => {
    setError('');
    setSaving(true);

    try {
      if (!pemohonData.nama || !pemohonData.nik || !pemohonData.alamat) {
        setError('Data pemohon (Nama, NIK, Alamat) harus diisi');
        setSaving(false);
        return;
      }

      await suratAPI.update(id, {
        pemohon: pemohonData,
        dataSurat: dataSurat,
        keterangan: dataSurat.keperluan || dataSurat.keterangan || '',
      });
      
      navigate('/surat', { 
        state: { 
          message: 'Surat berhasil diupdate!' 
        } 
      });
    } catch (err) {
      console.error('Error updating surat:', err);
      setError(err.response?.data?.message || 'Gagal update surat. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!surat) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Surat tidak ditemukan</p>
      </div>
    );
  }

  const formConfig = formFieldsConfig[surat.jenisSurat];

  if (!formConfig) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Form untuk jenis surat ini belum tersedia.</p>
        <button
          onClick={() => navigate('/surat')}
          className="mt-4 text-green-600 hover:underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/surat')}
          className="mb-4 flex items-center text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Kembali
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          Edit Surat
        </h1>
        <p className="mt-2 text-gray-600">
          {surat.jenisSurat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Nomor: {surat.nomorSurat || 'Belum ada nomor'}
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        
        {/* Data Pemohon Section */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-4 font-semibold text-gray-800 text-lg">Data Pemohon</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggalLahir"
                value={pemohonData.tanggalLahir}
                onChange={handlePemohonChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

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

        <GenericForm 
          fields={formConfig.fields} 
          onSubmit={handleSubmit} 
          loading={saving}
          error={error}
          initialData={surat.dataSurat}
          submitButtonText="Simpan Perubahan"
        />
      </div>
    </div>
  );
};

export default EditSurat;
