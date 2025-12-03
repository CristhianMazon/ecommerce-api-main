// src/components/Register.jsx
import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Falha no registro.');
      }
    } catch (err) {
      console.error('Erro de rede durante o registro:', err);
      setError('Erro de conexão. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Usa a classe "card" definida em App.css
    <div className="card">
      <h2>Registrar</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label htmlFor="registerName">Nome:</label>
          <input
            type="text"
            id="registerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            // Remove o estilo inline de largura e padding
            // style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="registerEmail">Email:</label>
          <input
            type="email"
            id="registerEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // Remove o estilo inline de largura e padding
            // style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="registerPassword">Senha:</label>
          <input
            type="password"
            id="registerPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            // Remove o estilo inline de largura e padding
            // style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ backgroundColor: '#28a745' }}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Registro bem-sucedido! Por favor, faça login.</p>}
      </form>
    </div>
  );
}

export default Register;
