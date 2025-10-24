import { useState } from 'react';

const FormSuratDomisili = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    alamatLengkap: '',
    rt: '',
    rw: '',
    dusun: '',
    lamaTinggal: '',
    keperluan: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <h3 className="font-semibold text-gray-800">Data Domisili</h3>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Alamat Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            name="alamatLengkap"
            value={formData.alamatLengkap}
            onChange={handleChange}
            required
            rows="3"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="Jl. Merdeka No. 123"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              RT <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="rt"
              value={formData.rt}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="001"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              RW <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="rw"
              value={formData.rw}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="002"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Dusun
            </label>
            <input
              type="text"
              name="dusun"
              value={formData.dusun}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="Sukamaju"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Lama Tinggal (Tahun) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="lamaTinggal"
            value={formData.lamaTinggal}
            onChange={handleChange}
            required
            min="0"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Keperluan <span className="text-red-500">*</span>
          </label>
          <textarea
            name="keperluan"
            value={formData.keperluan}
            onChange={handleChange}
            required
            rows="3"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="Untuk keperluan administrasi"
          />
        </div>
      </div>

      {error && (
        <div className="animate-shake rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Catatan:</strong> Surat akan disimpan sebagai draft. Anda dapat mengedit atau mengajukan surat dari halaman Daftar Surat.
        </p>
      </div>

      <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-linear-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Menyimpan...
            </div>
          ) : (
            'Simpan'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormSuratDomisili;
