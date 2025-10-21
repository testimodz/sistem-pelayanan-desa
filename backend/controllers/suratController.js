const Surat = require('../models/Surat');
const User = require('../models/User');

// @desc    Buat surat baru (draft atau langsung ajukan)
// @route   POST /api/surat
// @access  Private
const createSurat = async (req, res) => {
  try {
    const {
      jenisSurat,
      kategoriSurat,
      dataPemohon,
      dataSurat,
      keterangan,
      status,
    } = req.body;

    const surat = await Surat.create({
      jenisSurat,
      kategoriSurat,
      pemohon: req.user._id,
      dataPemohon,
      dataSurat,
      keterangan,
      status: status || 'draft',
      tanggalPengajuan: status === 'diajukan' ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: 'Surat berhasil dibuat',
      data: surat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get semua surat (dengan filter)
// @route   GET /api/surat
// @access  Private
const getAllSurat = async (req, res) => {
  try {
    const {
      status,
      kategoriSurat,
      jenisSurat,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filter berdasarkan role
    if (req.user.role === 'warga') {
      query.pemohon = req.user._id;
    }

    // Filter tambahan
    if (status) query.status = status;
    if (kategoriSurat) query.kategoriSurat = kategoriSurat;
    if (jenisSurat) query.jenisSurat = jenisSurat;

    const surat = await Surat.find(query)
      .populate('pemohon', 'nama email nik')
      .populate('petugasProses', 'nama email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Surat.countDocuments(query);

    res.json({
      success: true,
      data: surat,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalData: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get surat by ID
// @route   GET /api/surat/:id
// @access  Private
const getSuratById = async (req, res) => {
  try {
    const surat = await Surat.findById(req.params.id)
      .populate('pemohon', 'nama email nik noTelepon alamat')
      .populate('petugasProses', 'nama email');

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan',
      });
    }

    // Check authorization
    if (
      req.user.role === 'warga' &&
      surat.pemohon._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Tidak ada akses ke surat ini',
      });
    }

    res.json({
      success: true,
      data: surat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update surat
// @route   PUT /api/surat/:id
// @access  Private
const updateSurat = async (req, res) => {
  try {
    const surat = await Surat.findById(req.params.id);

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan',
      });
    }

    // Warga hanya bisa update surat draft miliknya
    if (req.user.role === 'warga') {
      if (
        surat.pemohon.toString() !== req.user._id.toString() ||
        surat.status !== 'draft'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Tidak dapat mengubah surat ini',
        });
      }
    }

    const updatedSurat = await Surat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Surat berhasil diupdate',
      data: updatedSurat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Ajukan surat (ubah status dari draft ke diajukan)
// @route   PATCH /api/surat/:id/ajukan
// @access  Private (Warga)
const ajukanSurat = async (req, res) => {
  try {
    const surat = await Surat.findById(req.params.id);

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan',
      });
    }

    if (surat.pemohon.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Tidak ada akses ke surat ini',
      });
    }

    if (surat.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Hanya surat draft yang dapat diajukan',
      });
    }

    surat.status = 'diajukan';
    surat.tanggalPengajuan = new Date();
    await surat.save();

    res.json({
      success: true,
      message: 'Surat berhasil diajukan',
      data: surat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Proses surat (petugas)
// @route   PATCH /api/surat/:id/proses
// @access  Private (Petugas/Admin)
const prosesSurat = async (req, res) => {
  try {
    const surat = await Surat.findById(req.params.id);

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan',
      });
    }

    if (surat.status !== 'diajukan') {
      return res.status(400).json({
        success: false,
        message: 'Hanya surat yang diajukan yang dapat diproses',
      });
    }

    surat.status = 'diproses';
    surat.petugasProses = req.user._id;
    surat.tanggalProses = new Date();
    await surat.save();

    res.json({
      success: true,
      message: 'Surat mulai diproses',
      data: surat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Selesaikan surat (petugas)
// @route   PATCH /api/surat/:id/selesai
// @access  Private (Petugas/Admin)
const selesaikanSurat = async (req, res) => {
  try {
    const { petugasTTD } = req.body;

    const surat = await Surat.findById(req.params.id);

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan',
      });
    }

    if (surat.status !== 'diproses') {
      return res.status(400).json({
        success: false,
        message: 'Hanya surat yang sedang diproses yang dapat diselesaikan',
      });
    }

    surat.status = 'selesai';
    surat.petugasTTD = petugasTTD;
    surat.tanggalSelesai = new Date();
    await surat.save();

    res.json({
      success: true,
      message: 'Surat selesai diproses',
      data: surat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Tolak surat (petugas)
// @route   PATCH /api/surat/:id/tolak
// @access  Private (Petugas/Admin)
const tolakSurat = async (req, res) => {
  try {
    const { alasanPenolakan } = req.body;

    if (!alasanPenolakan) {
      return res.status(400).json({
        success: false,
        message: 'Alasan penolakan harus diisi',
      });
    }

    const surat = await Surat.findById(req.params.id);

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan',
      });
    }

    surat.status = 'ditolak';
    surat.alasanPenolakan = alasanPenolakan;
    surat.petugasProses = req.user._id;
    await surat.save();

    res.json({
      success: true,
      message: 'Surat ditolak',
      data: surat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete surat
// @route   DELETE /api/surat/:id
// @access  Private
const deleteSurat = async (req, res) => {
  try {
    const surat = await Surat.findById(req.params.id);

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan',
      });
    }

    // Warga hanya bisa delete draft miliknya
    if (req.user.role === 'warga') {
      if (
        surat.pemohon.toString() !== req.user._id.toString() ||
        surat.status !== 'draft'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Tidak dapat menghapus surat ini',
        });
      }
    }

    await surat.deleteOne();

    res.json({
      success: true,
      message: 'Surat berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get statistik surat
// @route   GET /api/surat/stats
// @access  Private (Petugas/Admin)
const getStatistikSurat = async (req, res) => {
  try {
    const stats = await Surat.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalSurat = await Surat.countDocuments();
    
    const suratPerKategori = await Surat.aggregate([
      {
        $group: {
          _id: '$kategoriSurat',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalSurat,
        suratPerStatus: stats,
        suratPerKategori,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSurat,
  getAllSurat,
  getSuratById,
  updateSurat,
  ajukanSurat,
  prosesSurat,
  selesaikanSurat,
  tolakSurat,
  deleteSurat,
  getStatistikSurat,
};
