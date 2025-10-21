const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama harus diisi'],
      trim: true,
    },
    nik: {
      type: String,
      required: [true, 'NIK harus diisi'],
      unique: true,
      trim: true,
      minlength: [16, 'NIK harus 16 digit'],
      maxlength: [16, 'NIK harus 16 digit'],
    },
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minlength: [6, 'Password minimal 6 karakter'],
    },
    role: {
      type: String,
      enum: ['warga', 'petugas', 'admin'],
      default: 'warga',
    },
    noTelepon: {
      type: String,
      trim: true,
    },
    alamat: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password sebelum disimpan
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method untuk compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
