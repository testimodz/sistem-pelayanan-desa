import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  PrinterIcon 
} from '@heroicons/react/24/outline';
import { suratAPI } from '../services/api';
import { suratTemplates } from '../data/suratTemplates';
import { formatDate } from '../utils/dateFormatter';

const formatDateIndonesia = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const tanggal = d.getDate();
  const bulan = namaBulan[d.getMonth()];
  const tahun = d.getFullYear();
  
  return `${tanggal} ${bulan} ${tahun}`;
};

const DetailSurat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  useEffect(() => {
    loadSurat();
  }, [id]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body * {
          visibility: hidden;
        }
        .surat-print-container,
        .surat-print-container * {
          visibility: visible;
        }
        .surat-print-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const loadSurat = async () => {
    try {
      const response = await suratAPI.getById(id);
      setSurat(response.data.data);
    } catch (error) {
      console.error('Error loading surat:', error);
      alert('Gagal memuat detail surat');
      navigate('/surat');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus surat ini?')) return;

    try {
      await suratAPI.delete(id);
      alert('Surat berhasil dihapus');
      navigate('/surat');
    } catch (error) {
      console.error('Error deleting surat:', error);
      alert('Gagal menghapus surat');
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

  const template = suratTemplates[surat.jenisSurat];
  const content = template ? template.generateContent(surat.dataSurat, surat.pemohon) : null;

  const perluPemegangSurat = [
    'surat-keterangan-usaha',
    'surat-keterangan-domisili',
    'surat-pengantar-skck',
    'surat-tidak-mampu-sekolah',
    'surat-tidak-mampu-umum'
  ].includes(surat.jenisSurat);

  return (
    <div className="space-y-6">
      <div className="print:hidden flex items-center justify-between">
        <button
          onClick={() => navigate('/surat')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/surat/edit/${id}`)}
            className="flex items-center space-x-2 rounded-lg bg-yellow-100 px-4 py-2 font-semibold text-yellow-700 hover:bg-yellow-200 transition"
          >
            <PencilIcon className="h-5 w-5" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
          >
            <PrinterIcon className="h-5 w-5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 rounded-lg bg-red-100 px-4 py-2 font-semibold text-red-700 hover:bg-red-200 transition"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Hapus</span>
          </button>
        </div>
      </div>

      <div className="print:hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600">Nomor Surat</p>
            <p className="font-semibold text-gray-800">{surat.nomorSurat || 'Belum ada nomor'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kategori</p>
            <p className="font-semibold text-gray-800 capitalize">
              {surat.kategoriSurat?.replace(/-/g, ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tanggal Dibuat</p>
            <p className="font-semibold text-gray-800">{formatDate(surat.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white print:shadow-none flex justify-center">
        <div 
          ref={printRef}
          className="surat-print-container"
          style={{ 
            width: '210mm',
            minHeight: '297mm',
            maxHeight: '297mm',
            padding: '15mm 20mm',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          
          {/* Kop Surat */}
          <div style={{ marginBottom: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <tbody>
                <tr>
                  <td style={{ width: '75px', verticalAlign: 'middle', padding: 0 }}>
                    <img 
                      src="https://i.ibb.co/mC9p4nzJ/logo-ciamis.png" 
                      alt="Logo Ciamis" 
                      style={{ 
                        width: '72px', 
                        height: '72px', 
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      crossOrigin="anonymous"
                    />
                  </td>
                  <td style={{ 
                    verticalAlign: 'middle',
                    padding: '0 12px',
                    textAlign: 'center',
                    fontFamily: 'Times New Roman, serif'
                  }}>
                    <div style={{ fontSize: '14pt', fontWeight: 'bold', letterSpacing: '0.5px', lineHeight: '1.2', marginBottom: '1px' }}>
                      PEMERINTAH KABUPATEN CIAMIS
                    </div>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '1px' }}>
                      KECAMATAN CIAMIS
                    </div>
                    <div style={{ fontSize: '16pt', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '4px' }}>
                      KELURAHAN SINDANGRASA
                    </div>
                    <div style={{ fontSize: '8.5pt', lineHeight: '1.3' }}>
                      Jl. Jenderal Sudirman No. 286 Sindangrasa Telp. (0265) 772730 Kode Pos: 46215<br/>
                      Email: kel.sindangrasa@ciamiskab.go.id
                    </div>
                  </td>
                  <td style={{ width: '75px' }}></td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ borderTop: '3px solid #000', marginTop: '6px' }}></div>
            <div style={{ borderTop: '1px solid #000', marginTop: '2px' }}></div>
          </div>

          {/* Title & Nomor */}
          <div style={{ textAlign: 'center', margin: '14px 0' }}>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: 'Arial, sans-serif' }}>
              {template?.title || 'SURAT KETERANGAN'}
            </div>
            <div style={{ fontSize: '10pt', marginTop: '3px', fontFamily: 'Arial, sans-serif' }}>
              Nomor: {surat.nomorSurat || '........................'}
            </div>
          </div>

          {/* Content */}
          {content && (
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.6', color: '#000' }}>
              
              {/* Pembukaan - PAKAI INDENT */}
              <p style={{ textAlign: 'justify', textIndent: '40px', margin: '0 0 12px 0' }}>
                {content.pembukaan}
              </p>

              {/* Data Pemohon - PAKAI INDENT (RAPI) */}
              {content.dataPemohon && content.dataPemohon.length > 0 && (
                <div style={{ margin: '0 0 12px 0', fontSize: '10pt', paddingLeft: '40px' }}>
                  {content.dataPemohon.map((item, index) => (
                    <div key={index} style={{ display: 'flex', marginBottom: '2px' }}>
                      <div style={{ width: '180px', flexShrink: 0 }}>
                        {item.label}
                      </div>
                      <div style={{ width: '12px', flexShrink: 0, textAlign: 'center' }}>
                        :
                      </div>
                      <div style={{ 
                        flex: 1,
                        fontWeight: item.label.includes('Nama') || item.label.includes('NIK') ? 'bold' : 'normal',
                        wordWrap: 'break-word'
                      }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Isi Utama - PAKAI INDENT */}
              {content.isiUtama && (
                <p style={{ textAlign: 'justify', textIndent: '40px', margin: '12px 0' }}>
                  {content.isiUtama}
                </p>
              )}

              {/* Data Khusus - PAKAI INDENT (RAPI) */}
              {content.dataKhusus && content.dataKhusus.length > 0 && (
                <div style={{ margin: '12px 0', fontSize: '10pt', paddingLeft: '40px' }}>
                  {content.dataKhusus.map((item, index) => (
                    <div key={index} style={{ display: 'flex', marginBottom: '2px' }}>
                      <div style={{ width: '180px', flexShrink: 0 }}>
                        {item.label}
                      </div>
                      <div style={{ width: '12px', flexShrink: 0, textAlign: 'center' }}>
                        :
                      </div>
                      <div style={{ flex: 1, wordWrap: 'break-word' }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Keperluan - PAKAI INDENT */}
              {content.keperluan && (
                <p style={{ textAlign: 'justify', textIndent: '40px', margin: '12px 0' }}>
                  {content.keperluan}
                </p>
              )}

              {/* Penutup - PAKAI INDENT */}
              {content.penutup && (
                <p style={{ textAlign: 'justify', textIndent: '40px', margin: '12px 0' }}>
                  {content.penutup}
                </p>
              )}
            </div>
          )}

          {/* TTD - TANGGAL DI KANAN (KONSISTEN) */}
          <div style={{ marginTop: '32px', fontFamily: 'Arial, sans-serif' }}>
            
            {/* CASE 1: 2 TTD (dengan Pemegang Surat) */}
            {perluPemegangSurat ? (
              <>
                {/* Row 1: Tanggal (di kanan, sejajar dengan 1 TTD) */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    flex: '0 0 50%',
                    textAlign: 'center',
                    fontSize: '10pt'
                  }}>
                    Sindangrasa, {formatDateIndonesia(surat.tanggalSelesai || new Date())}
                  </div>
                </div>

                {/* Row 2: Jabatan (Pemegang Surat & Lurah sejajar) */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  gap: '20px'
                }}>
                  <div style={{ 
                    flex: '1',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '70px' }}>
                      Pemegang Surat
                    </div>
                    <div style={{ 
                      fontSize: '10pt',
                      fontWeight: 'bold', 
                      borderBottom: '1px solid #000', 
                      display: 'inline-block', 
                      paddingBottom: '2px',
                      minWidth: '140px'
                    }}>
                      {surat.pemohon?.nama || 'Nama Pemohon'}
                    </div>
                  </div>
                  
                  <div style={{ 
                    flex: '1',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '65px' }}>
                      {surat.petugasTTD?.jabatan || 'Lurah Sindangrasa'}
                    </div>
                    <div style={{ 
                      fontSize: '10pt',
                      fontWeight: 'bold', 
                      borderBottom: '1px solid #000', 
                      display: 'inline-block', 
                      paddingBottom: '2px',
                      minWidth: '140px'
                    }}>
                      {surat.petugasTTD?.namaLengkap || 'Nama Pejabat'}
                    </div>
                    {surat.petugasTTD?.nip && (
                      <div style={{ fontSize: '9pt', marginTop: '4px' }}>
                        NIP. {surat.petugasTTD.nip}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* CASE 2: 1 TTD (tanpa Pemegang Surat) - Tanggal & TTD di kanan */
              <>
                {/* Tanggal di atas Lurah (kanan) */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    flex: '0 0 50%',
                    textAlign: 'center',
                    fontSize: '10pt'
                  }}>
                    Sindangrasa, {formatDateIndonesia(surat.tanggalSelesai || new Date())}
                  </div>
                </div>

                {/* TTD Lurah (kanan) */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{ 
                    flex: '0 0 50%',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '65px' }}>
                      {surat.petugasTTD?.jabatan || 'Lurah Sindangrasa'}
                    </div>
                    <div style={{ 
                      fontSize: '10pt',
                      fontWeight: 'bold', 
                      borderBottom: '1px solid #000', 
                      display: 'inline-block', 
                      paddingBottom: '2px',
                      minWidth: '140px'
                    }}>
                      {surat.petugasTTD?.namaLengkap || 'Nama Pejabat'}
                    </div>
                    {surat.petugasTTD?.nip && (
                      <div style={{ fontSize: '9pt', marginTop: '4px' }}>
                        NIP. {surat.petugasTTD.nip}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSurat;
