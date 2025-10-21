const express = require('express');
const {
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
} = require('../controllers/suratController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

const router = express.Router();

// Public routes (dengan authentication)
router.post('/', protect, createSurat);
router.get('/', protect, getAllSurat);
router.get('/:id', protect, getSuratById);
router.put('/:id', protect, updateSurat);
router.delete('/:id', protect, deleteSurat);

// Warga routes
router.patch('/:id/ajukan', protect, authorize('warga'), ajukanSurat);

// Petugas/Admin routes
router.patch('/:id/proses', protect, authorize('petugas', 'admin'), prosesSurat);
router.patch('/:id/selesai', protect, authorize('petugas', 'admin'), selesaikanSurat);
router.patch('/:id/tolak', protect, authorize('petugas', 'admin'), tolakSurat);
router.get('/stats/all', protect, authorize('petugas', 'admin'), getStatistikSurat);

module.exports = router;
