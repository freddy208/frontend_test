'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">

        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-lg sm:text-xl font-semibold text-center text-black">
            Connexion
          </h2>

          <div>
            <label className="block text-sm font-semibold mb-2 text-black">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="utilisateur@exemple.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-black">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-200 disabled:hover:text-gray-700"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">
            *Ceci est une simulation. Utilisez utilisateur@exemple.com et password!
          </p>
        </form>
      </div>
    </div>
  );
}