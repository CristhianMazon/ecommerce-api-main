// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import EditProfileForm from './EditProfileForm';

function UserProfile() {
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [profileData, setProfileData] = useState(user);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
          setProfileData(data);
        } else {
          setError(data.message || 'Falha ao carregar perfil.');
          if (response.status === 401) {
            logout();
          }
        }
      } catch (err) {
        console.error('Erro de rede ao buscar perfil:', err);
        setError('Erro de conexão. Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };

    if (!user || (token && !profileData)) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token, user, profileData, logout]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando perfil...</p>;
  }

  if (error) {
    return <p className="error-message">Erro: {error}</p>;
  }

  if (!profileData) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Nenhum perfil encontrado. Por favor, faça login.</p>;
  }

  return (
    // Usa a classe "card" definida em App.css
    <div className="card">
      <h2>Meu Perfil</h2>
      {!showEditForm ? (
        <div>
          {/* Estilos inline para p e strong para garantir a cor do texto no card branco */}
          <p style={{ color: '#333' }}><strong>Nome:</strong> {profileData.name}</p>
          <p style={{ color: '#333' }}><strong>Email:</strong> {profileData.email}</p>
          <button
            onClick={() => setShowEditForm(true)}
            style={{ backgroundColor: '#007bff' }}
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <EditProfileForm
          currentProfile={profileData}
          onUpdateSuccess={(updatedUser) => {
            setProfileData(updatedUser);
            setShowEditForm(false);
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
}

export default UserProfile;
