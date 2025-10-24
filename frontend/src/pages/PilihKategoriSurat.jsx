import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  UsersIcon,
  HeartIcon,
  HomeIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';

const PilihKategoriSurat = () => {
  const navigate = useNavigate();

  const kategoriSurat = [
    {
      id: 'layanan-umum',
      nama: 'Layanan Umum',
      deskripsi: 'Surat keterangan usaha, SKTM, SKCK, dan lainnya',
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      iconColor: 'text-blue-600',
      jumlah: 15,
    },
    {
      id: 'layanan-kependudukan',
      nama: 'Layanan Kependudukan',
      deskripsi: 'KK, KTP, pindah domisili, kelahiran, kematian',
      icon: UsersIcon,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBorder: 'hover:border-green-400',
      iconColor: 'text-green-600',
      jumlah: 28,
    },
    {
      id: 'layanan-nikah',
      nama: 'Layanan Nikah',
      deskripsi: 'Pengantar nikah (N1-N6), status pernikahan',
      icon: HeartIcon,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      hoverBorder: 'hover:border-pink-400',
      iconColor: 'text-pink-600',
      jumlah: 9,
    },
    {
      id: 'layanan-pertanahan',
      nama: 'Layanan Pertanahan',
      deskripsi: 'Kepemilikan tanah, sporadik, ahli waris',
      icon: HomeIcon,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverBorder: 'hover:border-orange-400',
      iconColor: 'text-orange-600',
      jumlah: 5,
    },
    {
      id: 'layanan-lainnya',
      nama: 'Layanan Lainnya',
      deskripsi: 'Surat keterangan dan layanan lainnya',
      icon: EllipsisHorizontalIcon,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      iconColor: 'text-purple-600',
      jumlah: 3,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Buat Surat Baru</h1>
        <p className="mt-2 text-gray-600">
          Pilih kategori surat yang ingin Anda ajukan
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {kategoriSurat.map((kategori) => {
          const Icon = kategori.icon;
          return (
            <button
              key={kategori.id}
              onClick={() => navigate(`/surat/pilih/${kategori.id}`)}
              className={`group relative overflow-hidden rounded-2xl border-2 ${kategori.borderColor} bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${kategori.hoverBorder}`}
            >
              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-xl ${kategori.bgColor} p-3`}>
                    <Icon className={`h-8 w-8 ${kategori.iconColor}`} />
                  </div>
                  <span className={`rounded-full ${kategori.bgColor} px-3 py-1 text-sm font-semibold ${kategori.iconColor}`}>
                    {kategori.jumlah} Jenis
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  {kategori.nama}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {kategori.deskripsi}
                </p>

                <div className={`mt-4 flex items-center text-sm font-semibold ${kategori.iconColor}`}>
                  Pilih Kategori
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PilihKategoriSurat;
