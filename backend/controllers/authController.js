const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register user baru
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { nama, nik, email, password, noTelepon, alamat } = req.body;

    // Cek apakah user sudah ada
    const userExists = await User.findOne({ $or: [{ email }, { nik }] });

    if (userExists) {
      return res.status(400).json({
        message: 'User dengan email atau NIK ini sudah terdaftar',
      });
    }

    // Buat user baru
    const user = await User.create({
      nama,
      nik,
      email,
      password,
      noTelepon,
      alamat,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nama: user.nama,
        nik: user.nik,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah user ada
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        nama: user.nama,
        nik: user.nik,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
