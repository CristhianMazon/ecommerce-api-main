// src/components/EditProfileForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

function EditProfileForm({ currentProfile, onUpdateSuccess, onCancel }) {
  const { token } = useAuth();
  const [name, setName] = useState(currentProfile.name || '');
  const [email, setEmail] = useState(currentProfile.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setName(currentProfile.name || '');
    setEmail(currentProfile.email || '');
  }, [currentProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const updateData = {};
    if (name !== currentProfile.name) updateData.name = name;
    if (email !== currentProfile.email) updateData.email = email;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      setError('Nenhuma alteração detectada.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        onUpdateSuccess(data.user);
        setPassword('');
      } else {
        setError(data.message || 'Falha ao atualizar perfil.');
      }
    } catch (err) {
      console.error('Erro de rede durante a atualização do perfil:', err);
      setError('Erro de conexão. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Este div está dentro de um .card, então não precisa de .card novamente.
    // Apenas removemos os estilos inline que já serão tratados pelo CSS global ou .card
    <div style={{ padding: '10px', borderTop: '1px solid #eee', marginTop: '20px' }}>
      <h3>Editar Perfil</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label htmlFor="editName">Nome:</label>
          <input
            type="text"
            id="editName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // Largura e padding serão do CSS
            // style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="editEmail">Email:</label>
          <input
            type="email"
            id="editEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // Largura e padding serão do CSS
            // style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="editPassword">Nova Senha (opcional):</label>
          <input
            type="password"
            id="editPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Deixe em branco para não alterar"
            // Largura e padding serão do CSS
            // style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div className="button-group"> {/* Usa a classe para agrupar botões */}
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#007bff' }}>
            {loading ? 'Atualizando...' : 'Salvar Alterações'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Perfil atualizado com sucesso!</p>}
      </form>
    </div>
  );
}

export default EditProfileForm;
