import logoImage from '../../assets/logo-ciamis.png';

const GenericTemplate = ({ template, surat }) => {
  const content = template.generateContent(surat.dataSurat, surat.pemohon);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Parse bold text **text** menjadi <strong>
  const parseBold = (text) => {
    if (!text) return text;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Kop Surat Profesional - Format Resmi Pemerintahan */}
      <div className="mb-3">
        <table className="w-full">
          <tbody>
            <tr>
              {/* Logo Kiri */}
              <td className="w-24 align-top pt-2">
                <img 
                  src={logoImage}
                  alt="Logo Kabupaten Ciamis" 
                  className="h-24 w-24 object-contain"
                />
              </td>
              
              {/* Header Text Tengah */}
              <td className="text-center align-top px-4">
                <div className="leading-tight">
                  <h1 className="text-lg font-bold uppercase tracking-wider">
                    PEMERINTAH KABUPATEN CIAMIS
                  </h1>
                  <h2 className="text-base font-bold uppercase mt-0.5">
                    KECAMATAN CIAMIS
                  </h2>
                  <h2 className="text-xl font-bold uppercase mt-0.5">
                    KELURAHAN SINDANGRASA
                  </h2>
                  <p className="text-xs mt-2 font-medium">
                    Jl. Jenderal Sudirman No. 286 Sindangrasa Telp. (0265) 772730 Kode Pos: 46215
                  </p>
                  <p className="text-xs font-medium">
                    Email: kel.sindangrasa@ciamiskab.go.id | Website: kelurahan-sindangrasa.ciamiskab.go.id
                  </p>
                </div>
              </td>
              
              {/* Spacer Kanan (untuk simetris) */}
              <td className="w-24 align-top pt-2">
                <div className="h-24 w-24"></div>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Garis Kop Surat */}
        <div className="mt-2">
          <div className="border-t-4 border-black"></div>
          <div className="border-t border-black mt-0.5"></div>
        </div>
      </div>

      {/* Nomor & Judul Surat */}
      <div className="mt-6 text-center">
        <h1 className="text-base font-bold uppercase underline decoration-2 underline-offset-4">
          {template.title}
        </h1>
        <p className="text-sm mt-1">Nomor: {surat.nomorSurat || '........................'}</p>
      </div>

      {/* Isi Surat - Format Resmi */}
      <div className="mt-8 text-[13px] leading-loose">
        {/* Pembukaan */}
        <p className="text-justify indent-12">
          {content.pembukaan}
        </p>

        {/* Data Pemohon - Table Format */}
        {content.dataPemohon && content.dataPemohon.length > 0 && (
          <table className="ml-20 my-4">
            <tbody>
              {content.dataPemohon.map((item, index) => (
                <tr key={index} className="align-top">
                  <td className="pr-8 py-1 whitespace-nowrap">{item.label}</td>
                  <td className="pr-4 py-1">:</td>
                  <td className="py-1">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Isi Utama */}
        {content.isiUtama && (
          <p className="text-justify mt-4">
            {parseBold(content.isiUtama)}
          </p>
        )}

        {/* Data Khusus - Table Format */}
        {content.dataKhusus && content.dataKhusus.length > 0 && (
          <table className="ml-20 my-4">
            <tbody>
              {content.dataKhusus.map((item, index) => (
                <tr key={index} className="align-top">
                  <td className="pr-8 py-1 whitespace-nowrap">{item.label}</td>
                  <td className="pr-4 py-1">:</td>
                  <td className="py-1">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Penutup - Handle Array atau String */}
        {content.penutup && (
          <>
            {Array.isArray(content.penutup) ? (
              // Kalau array, render per item (pisah per paragraph)
              content.penutup.map((paragraph, index) => (
                <p key={index} className="text-justify mt-4 indent-12">
                  {parseBold(paragraph)}
                </p>
              ))
            ) : (
              // Kalau string biasa
              <p className="text-justify mt-4 indent-12">
                {parseBold(content.penutup)}
              </p>
            )}
          </>
        )}
      </div>

      {/* Tanda Tangan - Format Resmi */}
      <div className="mt-16">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-1/2"></td>
              <td className="w-1/2 text-center">
                <p className="text-sm mb-1">
                  Sindangrasa, {formatDate(surat.tanggalSelesai || new Date())}
                </p>
                <p className="text-sm font-bold mb-20">
                  {surat.petugasTTD?.jabatan || 'Lurah Sindangrasa'}
                </p>
                
                {/* Space untuk TTD Basah */}
                <div className="h-20"></div>
                
                <p className="text-sm font-bold underline decoration-1">
                  {surat.petugasTTD?.namaLengkap || 'Derry Insan Akhira Yusman, S.STP.'}
                </p>
                {surat.petugasTTD?.nip && (
                  <p className="text-xs mt-1">
                    NIP. {surat.petugasTTD.nip}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GenericTemplate;
