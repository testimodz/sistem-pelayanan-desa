const mongoose = require('mongoose');

const suratSchema = new mongoose.Schema(
  {
    // Informasi Dasar Surat
    nomorSurat: {
      type: String,
      unique: true,
      sparse: true,
    },
    jenisSurat: {
      type: String,
      required: [true, 'Jenis surat harus diisi'],
      enum: [
        // Layanan Umum
        'surat-keterangan-usaha',
        'surat-keterangan-tempat-usaha',
        'surat-pengantar-barang',
        'surat-pengantar-ternak',
        'surat-tidak-mampu-sekolah',
        'surat-tidak-mampu-umum',
        'surat-rumah-tangga-miskin',
        'surat-penghasilan-orang-tua',
        'izin-keramaian-pesta',
        'surat-pengantar-skck',
        'surat-ahli-waris',
        'surat-bepergian',
        'surat-tidak-berada-ditempat',
        'surat-beda-identitas',
        'surat-keterangan-lainnya',
        
        // Layanan Kependudukan - Biodata
        'formulir-kartu-keluarga',
        'formulir-peristiwa-kependudukan',
        'surat-tidak-memiliki-dokumen',
        'surat-perubahan-data-kependudukan',
        'formulir-biodata-perubahan-wni',
        'surat-kuasa-administrasi',
        'formulir-kk-baru-wni',
        'formulir-perubahan-kk-wni',
        'formulir-permohonan-ktp',
        'surat-keterangan-domisili',
        'surat-hilang-kartu-keluarga',
        
        // Layanan Kependudukan - Pindah
        'surat-keterangan-pindah',
        'formulir-perpindahan-penduduk',
        'surat-pindah-datang-satu-desa',
        'surat-pindah-antar-desa',
        'surat-pindah-datang-antar-desa',
        'surat-pindah-antar-kecamatan',
        'surat-pindah-datang-antar-kecamatan',
        'surat-pengantar-pindah',
        'surat-pengantar-pindah-datang',
        'formulir-pindah-antar-provinsi',
        'formulir-pindah-datang-antar-provinsi',
        
        // Layanan Kependudukan - Kelahiran
        'surat-keterangan-kelahiran',
        'sptjm-kebenaran-kelahiran',
        'sptjm-pasangan-suami-istri',
        'surat-belum-memiliki-akta-kelahiran',
        
        // Layanan Kependudukan - Kematian
        'surat-keterangan-kematian',
        'surat-kematian',
        'surat-keterangan-penguburan',
        
        // Layanan Nikah
        'pengantar-nikah-n1',
        'pengantar-nikah-n2',
        'pengantar-nikah-n3',
        'pengantar-nikah-n4',
        'pengantar-nikah-n5',
        'pengantar-nikah-n6',
        'surat-pernah-nikah',
        'surat-belum-pernah-nikah',
        'surat-duda-janda',
        
        // Layanan Pertanahan
        'surat-pencocokan-sporadik',
        'sporadik',
        'surat-kepemilikan-tanah',
        'surat-jaminan-rumah',
        'keterangan-ahli-waris-tanah',
        'keterangan-desa',
      ],
    },
    kategoriSurat: {
      type: String,
      required: true,
      enum: [
        'layanan-umum',
        'layanan-kependudukan',
        'layanan-nikah',
        'layanan-pertanahan',
        'layanan-lainnya',
      ],
    },
    
    // Data Pemohon Manual (Input Petugas)
    pemohon: {
      nama: {
        type: String,
        required: [true, 'Nama pemohon harus diisi'],
      },
      nik: {
        type: String,
        required: [true, 'NIK pemohon harus diisi'],
      },
      tempatLahir: String,
      tanggalLahir: Date,
      jenisKelamin: {
        type: String,
        enum: ['Laki-laki', 'Perempuan'],
      },
      agama: String,
      pekerjaan: String,
      statusPerkawinan: String,
      kewarganegaraan: {
        type: String,
        default: 'WNI',
      },
      alamat: String,
      noTelepon: String,
      email: String,
    },
    
    // Data Dinamis Surat
    dataSurat: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    
    // Keterangan Tambahan
    keterangan: {
      type: String,
      trim: true,
    },
    
    // Petugas yang Membuat Surat
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Petugas yang Menandatangani
    petugasTTD: {
      namaLengkap: {
        type: String,
        required: true,
      },
      jabatan: {
        type: String,
        default: 'Lurah Sindangrasa',
      },
      nip: String,
    },
    
    // File Upload
    lampiran: [
      {
        namaFile: String,
        urlFile: String,
        jenisFile: String,
        ukuranFile: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    // Tanggal Surat Selesai
    tanggalSelesai: {
      type: Date,
      default: Date.now,
    },
    
    // File PDF Hasil
    filePDF: String,
    
    // Metadata
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk query performance
suratSchema.index({ 'pemohon.nama': 'text', 'pemohon.nik': 'text' });
suratSchema.index({ jenisSurat: 1, kategoriSurat: 1 });
suratSchema.index({ nomorSurat: 1 });
suratSchema.index({ createdAt: -1 });
suratSchema.index({ createdBy: 1 });

// Auto generate nomor surat - FORMAT RESMI PEMERINTAH
suratSchema.pre('save', async function (next) {
  if (!this.nomorSurat) {
    try {
      const year = new Date().getFullYear();
      
      // Count total surat di tahun ini (semua kategori)
      const count = await mongoose.model('Surat').countDocuments({
        nomorSurat: { $exists: true, $ne: null },
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1),
        },
      });
      
      // Format RESMI: 005/145/Kel.Sindangrasa/2025
      const kodeKlasifikasi = '005'; // Kode untuk urusan pemerintahan umum
      const nomorUrut = String(count + 1).padStart(3, '0');
      
      this.nomorSurat = `${kodeKlasifikasi}/${nomorUrut}/Kel.Sindangrasa/${year}`;
      
      console.log(`✅ Generated nomor surat: ${this.nomorSurat}`);
    } catch (error) {
      console.error('❌ Error generating nomor surat:', error);
    }
  }
  next();
});

// Method untuk format data pemohon dengan format dd/MM/yyyy
suratSchema.methods.getFormattedPemohon = function() {
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    ...this.pemohon,
    tanggalLahirFormatted: formatDate(this.pemohon.tanggalLahir),
  };
};

module.exports = mongoose.model('Surat', suratSchema);
