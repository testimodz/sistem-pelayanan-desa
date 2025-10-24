const Surat = require('../models/Surat');
const User = require('../models/User');

// @desc    Create surat baru
// @route   POST /api/surat
// @access  Private (Petugas/Admin)
exports.createSurat = async (req, res) => {
  try {
    const { jenisSurat, kategoriSurat, pemohon, dataSurat, keterangan } = req.body;

    if (!jenisSurat || !kategoriSurat || !pemohon || !dataSurat) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    if (!pemohon.nama || !pemohon.nik) {
      return res.status(400).json({ message: 'Nama dan NIK pemohon harus diisi' });
    }

    const petugas = await User.findById(req.user._id);

    let petugasTTD = {
      namaLengkap: 'Derry Insan Akhira Yusman, S.STP.',
      jabatan: 'Lurah Sindangrasa',
      nip: '199201182014021001',
    };

    if (petugas.role === 'petugas') {
      petugasTTD = {
        namaLengkap: petugas.nama,
        jabatan: 'Staf Kelurahan Sindangrasa',
        nip: petugas.nip || '',
      };
    }

    const surat = await Surat.create({
      jenisSurat,
      kategoriSurat,
      pemohon,
      dataSurat,
      keterangan,
      createdBy: req.user._id,
      petugasTTD: petugasTTD,
    });

    await surat.populate('createdBy', 'nama email role');

    res.status(201).json({
      message: 'Surat berhasil dibuat',
      data: surat,
    });
  } catch (error) {
    console.error('Error creating surat:', error);
    res.status(500).json({ 
      message: 'Gagal membuat surat', 
      error: error.message 
    });
  }
};

// @desc    Get all surat with filters
// @route   GET /api/surat
// @access  Private
exports.getAllSurat = async (req, res) => {
  try {
    const { 
      search, 
      kategori, 
      jenisSurat,
      startDate, 
      endDate,
      page = 1,
      limit = 20,
    } = req.query;
    
    let query = { isArchived: false };
    
    if (search) {
      query.$or = [
        { 'pemohon.nama': { $regex: search, $options: 'i' } },
        { 'pemohon.nik': { $regex: search, $options: 'i' } },
        { nomorSurat: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (kategori && kategori !== 'semua') {
      query.kategoriSurat = kategori;
    }

    if (jenisSurat) {
      query.jenisSurat = jenisSurat;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Surat.countDocuments(query);

    const surat = await Surat.find(query)
      .populate('createdBy', 'nama email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      data: surat,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error('Error getting surat:', error);
    res.status(500).json({ message: 'Gagal mengambil data surat' });
  }
};

// @desc    Get single surat by ID
// @route   GET /api/surat/:id
// @access  Private
exports.getSuratById = async (req, res) => {
  try {
    const surat = await Surat.findById(req.params.id)
      .populate('createdBy', 'nama email role');

    if (!surat) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    res.json({ data: surat });
  } catch (error) {
    console.error('Error getting surat:', error);
    res.status(500).json({ message: 'Gagal mengambil data surat' });
  }
};

// @desc    Update surat
// @route   PUT /api/surat/:id
// @access  Private (Admin/Petugas)
exports.updateSurat = async (req, res) => {
  try {
    const { pemohon, dataSurat, keterangan } = req.body;

    if (!pemohon || !dataSurat) {
      return res.status(400).json({ message: 'Data pemohon dan dataSurat harus diisi' });
    }

    if (!pemohon.nama || !pemohon.nik) {
      return res.status(400).json({ message: 'Nama dan NIK pemohon harus diisi' });
    }

    const surat = await Surat.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          pemohon: pemohon,
          dataSurat: dataSurat,
          keterangan: keterangan || '',
        }
      },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('createdBy', 'nama email role');

    if (!surat) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    res.json({
      message: 'Surat berhasil diupdate',
      data: surat,
    });
  } catch (error) {
    console.error('Error updating surat:', error);
    res.status(500).json({ 
      message: 'Gagal update surat',
      error: error.message 
    });
  }
};

// @desc    Delete surat
// @route   DELETE /api/surat/:id
// @access  Private (Admin)
exports.deleteSurat = async (req, res) => {
  try {
    const surat = await Surat.findById(req.params.id);

    if (!surat) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    await surat.deleteOne();

    res.json({ message: 'Surat berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting surat:', error);
    res.status(500).json({ message: 'Gagal menghapus surat' });
  }
};

// @desc    Archive surat
// @route   PATCH /api/surat/:id/archive
// @access  Private (Admin)
exports.archiveSurat = async (req, res) => {
  try {
    const surat = await Surat.findById(req.params.id);

    if (!surat) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    surat.isArchived = !surat.isArchived;
    await surat.save();

    res.json({
      message: `Surat berhasil ${surat.isArchived ? 'diarsipkan' : 'dibatalkan arsip'}`,
      data: surat,
    });
  } catch (error) {
    console.error('Error archiving surat:', error);
    res.status(500).json({ message: 'Gagal mengarsipkan surat' });
  }
};

// @desc    Get statistics
// @route   GET /api/surat/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const total = await Surat.countDocuments({ isArchived: false });
    
    const byKategori = await Surat.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$kategoriSurat',
          count: { $sum: 1 }
        }
      }
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Surat.countDocuments({ 
      createdAt: { $gte: today },
      isArchived: false,
    });

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthCount = await Surat.countDocuments({ 
      createdAt: { $gte: thisMonth },
      isArchived: false,
    });

    const thisYear = new Date(today.getFullYear(), 0, 1);
    const thisYearCount = await Surat.countDocuments({ 
      createdAt: { $gte: thisYear },
      isArchived: false,
    });

    const topJenisSurat = await Surat.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$jenisSurat',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      total,
      today: todayCount,
      thisMonth: thisMonthCount,
      thisYear: thisYearCount,
      byKategori: byKategori.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topJenisSurat,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};

// ✅ FUNCTION BARU 1: Get arsip surat (surat >1 tahun atau yang diarsipkan)
// @desc    Get arsip surat
// @route   GET /api/surat/arsip
// @access  Private
exports.getArsipSurat = async (req, res) => {
  try {
    const { 
      search, 
      kategori, 
      page = 1,
      limit = 20,
    } = req.query;
    
    // Hitung tanggal 1 tahun yang lalu
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    // Query: surat yang diarsipkan ATAU surat >1 tahun
    let query = {
      $or: [
        { isArchived: true },
        { createdAt: { $lt: oneYearAgo } }
      ]
    };
    
    // Search by nama, NIK, atau nomor surat
    if (search) {
      query.$and = [{
        $or: [
          { 'pemohon.nama': { $regex: search, $options: 'i' } },
          { 'pemohon.nik': { $regex: search, $options: 'i' } },
          { nomorSurat: { $regex: search, $options: 'i' } },
        ]
      }];
    }
    
    // Filter kategori
    if (kategori && kategori !== 'semua') {
      query.kategoriSurat = kategori;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Surat.countDocuments(query);

    const surat = await Surat.find(query)
      .populate('createdBy', 'nama email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      data: surat,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error('Error getting arsip surat:', error);
    res.status(500).json({ message: 'Gagal mengambil arsip surat' });
  }
};

// ✅ FUNCTION BARU 2: Get laporan/statistik lengkap
// @desc    Get laporan/statistik lengkap
// @route   GET /api/surat/laporan
// @access  Private
exports.getLaporan = async (req, res) => {
  try {
    const { tahun, bulan } = req.query;
    const currentYear = tahun ? parseInt(tahun) : new Date().getFullYear();
    const currentMonth = bulan ? parseInt(bulan) - 1 : new Date().getMonth();

    // 1. Total Surat (all time, tidak termasuk arsip)
    const totalSurat = await Surat.countDocuments({ isArchived: false });

    // 2. Surat per Kategori
    const suratPerKategori = await Surat.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$kategoriSurat',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 3. Surat per Jenis (Top 10)
    const suratPerJenis = await Surat.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$jenisSurat',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 4. Surat per Bulan (dalam 1 tahun)
    const suratPerBulan = await Surat.aggregate([
      {
        $match: {
          isArchived: false,
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 5. Surat Bulan Ini
    const suratBulanIni = await Surat.countDocuments({
      isArchived: false,
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    });

    // 6. Surat Tahun Ini
    const suratTahunIni = await Surat.countDocuments({
      isArchived: false,
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1)
      }
    });

    // 7. Surat Hari Ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const suratHariIni = await Surat.countDocuments({
      isArchived: false,
      createdAt: { $gte: today }
    });

    // Format response
    res.json({
      totalSurat,
      suratHariIni,
      suratBulanIni,
      suratTahunIni,
      suratPerKategori: suratPerKategori.map(item => ({
        kategori: item._id || 'Tanpa Kategori',
        jumlah: item.count
      })),
      suratPerJenis: suratPerJenis.map(item => ({
        jenis: item._id || 'Tanpa Jenis',
        jumlah: item.count
      })),
      suratPerBulan: Array.from({ length: 12 }, (_, i) => {
        const found = suratPerBulan.find(item => item._id === i + 1);
        return {
          bulan: i + 1,
          jumlah: found ? found.count : 0
        };
      })
    });
  } catch (error) {
    console.error('Error getting laporan:', error);
    res.status(500).json({ message: 'Gagal mengambil laporan' });
  }
};
