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
      setApiStatus('API accessible avec succès !');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'appel API';
      setApiError(errorMsg);
      setApiStatus(errorMsg);
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
      <div className="text-center pt-6 sm:pt-8 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600 px-4">
          Next.js (Context/Axios) & Laravel (JWT)
        </h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg mx-4 sm:mx-6 lg:mx-8 mt-4 border-l-8 border-blue-600">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <svg 
              className="w-6 h-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            
            <span className="text-sm sm:text-base font-medium text-gray-700">
              {user.name}
            </span>
            
            <button
              onClick={handleLogout}
              className="text-sm sm:text-base text-red-600 hover:text-red-700 font-medium ml-2"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Bienvenue, {user.name} !
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Vous êtes connecté avec succès
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-500 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold mb-6 text-yellow-800 text-center">
              Test de l&apos;API Protégée (Laravel JWT)
            </h3>

            <button
              onClick={testProtectedApi}
              disabled={apiLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed mb-6"
            >
              {apiLoading ? 'Test en cours...' : 'Tester l\'accès API Protégé'}
            </button>

            <div className="mb-6 text-center">
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold">Statut:</span>{' '}
                <span className="text-blue-600">{apiStatus}</span>
              </p>
            </div>

            {apiData && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <p className="font-semibold text-green-700 text-sm mb-3">
                  Réponse de l&apos;API :
                </p>
                <div className="bg-white p-3 rounded border border-green-200 overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-gray-800">
                    {JSON.stringify(apiData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {apiError && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <p className="font-semibold text-red-700 text-sm">
                  Erreur lors de l&apos;appel API
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