const express = require('express');
const router = express.Router();
const { protect, petugasOrAdmin, admin } = require('../middleware/authMiddleware');
const {
  createSurat,
  getAllSurat,
  getSuratById,
  updateSurat,
  deleteSurat,
  archiveSurat,
  getStats,
  getArsipSurat,    // ✅ TAMBAH INI
  getLaporan        // ✅ TAMBAH INI
} = require('../controllers/suratController');

// Semua route butuh auth petugas/admin
router.use(protect);
router.use(petugasOrAdmin);

// ==================== STATS ====================
router.get('/stats/summary', getStats);

// ✅ TAMBAH ROUTE BARU - ARSIP & LAPORAN
router.get('/arsip', getArsipSurat);      // GET /api/surat/arsip
router.get('/laporan', getLaporan);       // GET /api/surat/laporan

// ==================== CRUD ====================
router.route('/')
  .get(getAllSurat)
  .post(createSurat);

router.route('/:id')
  .get(getSuratById)
  .put(updateSurat)
  .delete(admin, deleteSurat);

// ==================== ACTIONS ====================
router.patch('/:id/archive', archiveSurat);

module.exports = router;
