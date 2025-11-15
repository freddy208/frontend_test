'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiStatus, setApiStatus] = useState('Cliquez sur le bouton pour tester l\'API.');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const testProtectedApi = async () => {
    setApiLoading(true);
    setApiError('');
    setApiData(null);
    setApiStatus('Test en cours...');

    try {
      const response = await axiosInstance.get('/auth/me');
      setApiData(response.data);
      setApiStatus('✓ API accessible avec succès !');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'appel API';
      setApiError(errorMsg);
      setApiStatus('✗ ' + errorMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barre du haut - Blanche avec bordure gauche bleue */}
      <div className="bg-white shadow-lg rounded-lg mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 lg:mt-8 border-l-8 border-blue-600">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
                Next.js (Context/Axios) & Laravel (JWT)
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 underline hover:no-underline font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Message de bienvenue */}
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Bienvenue, {user.name} !
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Vous êtes connecté avec succès
            </p>
          </div>

          {/* Carte Test API - Bordure dorée avec shadow */}
          <div className="bg-white rounded-2xl shadow-xl border-4 border-yellow-500 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-yellow-800">
              Test de l&apos;API Protégée (Laravel JWT)
            </h3>

            <button
              onClick={testProtectedApi}
              disabled={apiLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed mb-4"
            >
              {apiLoading ? 'Test en cours...' : 'Tester l\'accès API Protégé'}
            </button>

            <div className="mb-4">
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold">Statut:</span>{' '}
                <span className="text-blue-600">{apiStatus}</span>
              </p>
            </div>

            {/* Affichage des résultats si succès */}
            {apiData && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <p className="font-semibold text-green-700 text-sm mb-3">
                  ✓ Réponse de l&apos;API :
                </p>
                <div className="bg-white p-3 rounded border border-green-200 overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-gray-800">
                    {JSON.stringify(apiData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Affichage des erreurs */}
            {apiError && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <p className="font-semibold text-red-700 text-sm">
                  ✗ Erreur lors de l&apos;appel API
                </p>
                <p className="text-sm text-red-600 mt-1">{apiError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}