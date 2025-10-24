import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon, BuildingLibraryIcon, UserIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [username, setUsername] = useState(''); // ✅ GANTI EMAIL -> USERNAME
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password); // ✅ KIRIM USERNAME

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-brrom-amber-50 via-green-50 to-emerald-100 px-4">
      {/* Animated Background Circles */}
      <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-green-200/30 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 h-96 w-96 animate-pulse rounded-full bg-amber-200/30 blur-3xl animation-delay-2000"></div>
      <div className="absolute left-1/2 top-1/2 h-64 w-64 animate-pulse rounded-full bg-emerald-200/20 blur-2xl animation-delay-4000"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white bg-white p-8 shadow-2xl">
          {/* Logo & Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-600 to-emerald-600">
              <BuildingLibraryIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Selamat Datang</h1>
            <p className="mt-2 text-gray-600">Sistem Pelayanan Surat Desa</p>
            <p className="mt-1 text-sm text-gray-500">Kelurahan Sindangrasa</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 animate-shake rounded-xl border border-red-300 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ✅ USERNAME INPUT (BUKAN EMAIL) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-green-600 to-emerald-600 py-3.5 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Memproses...
                </div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Jika ada kendala login, hubungi administrator
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Sistem Pelayanan Desa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
