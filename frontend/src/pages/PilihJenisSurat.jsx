import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { getJenisSuratByKategori } from '../data/jenisSurat';

const PilihJenisSurat = () => {
  const { kategori } = useParams();
  const navigate = useNavigate();

  const jenisSurat = getJenisSuratByKategori(kategori);

  const kategoriNama = {
    'layanan-umum': 'Layanan Umum',
    'layanan-kependudukan': 'Layanan Kependudukan',
    'layanan-nikah': 'Layanan Nikah',
    'layanan-pertanahan': 'Layanan Pertanahan',
    'layanan-lainnya': 'Layanan Lainnya',
  };

  const kategoriColor = {
    'layanan-umum': {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hover: 'hover:border-blue-400 hover:bg-blue-50',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    'layanan-kependudukan': {
      bg: 'bg-green-50',
      border: 'border-green-200',
      hover: 'hover:border-green-400 hover:bg-green-50',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    'layanan-nikah': {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      hover: 'hover:border-pink-400 hover:bg-pink-50',
      icon: 'text-pink-600',
      iconBg: 'bg-pink-100',
    },
    'layanan-pertanahan': {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hover: 'hover:border-orange-400 hover:bg-orange-50',
      icon: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
    'layanan-lainnya': {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      hover: 'hover:border-purple-400 hover:bg-purple-50',
      icon: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
  };

  const colors = kategoriColor[kategori] || kategoriColor['layanan-umum'];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/surat/buat')}
          className="mb-4 flex items-center text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Kembali ke Kategori
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          {kategoriNama[kategori]}
        </h1>
        <p className="mt-2 text-gray-600">
          Pilih jenis surat yang ingin Anda ajukan
        </p>
      </div>

      {/* Grid Jenis Surat */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jenisSurat.map((surat) => (
          <button
            key={surat.id}
            onClick={() => navigate(`/surat/form/${surat.id}`)}
            className={`group flex items-center space-x-4 rounded-xl border-2 ${colors.border} bg-white p-5 shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${colors.hover}`}
          >
            <div className={`rounded-lg ${colors.iconBg} p-3`}>
              <DocumentIcon className={`h-6 w-6 ${colors.icon}`} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-800">
                {surat.nama}
              </h3>
            </div>
            <svg
              className={`h-5 w-5 ${colors.icon} transition-transform duration-200 group-hover:translate-x-1`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PilihJenisSurat;
