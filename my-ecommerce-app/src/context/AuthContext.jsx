// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../config/api'; // <--- Importa a URL base da API do novo arquivo de configuração

// Cria o contexto de autenticação
const AuthContext = createContext(null);

// Provedor de autenticação que envolverá sua aplicação
export const AuthProvider = ({ children }) => {
  // Estado para armazenar o token JWT. Tenta carregar do localStorage ao iniciar.
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  // Estado para armazenar os dados do usuário autenticado
  const [user, setUser] = useState(null);
  // Estado para indicar se a autenticação está carregando (ex: ao buscar o perfil do usuário)
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Efeito para buscar o perfil do usuário quando o token muda ou ao carregar a aplicação
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Define os dados do usuário
          } else {
            // Se o token for inválido ou o usuário não for encontrado, limpa o token
            console.error('Falha ao buscar perfil do usuário:', response.statusText);
            setToken(null);
            setUser(null);
            localStorage.removeItem('jwtToken');
          }
        } catch (error) {
          // Erro de rede ou outro erro ao buscar o perfil
          console.error('Erro de rede ao buscar perfil do usuário:', error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('jwtToken');
        }
      } else {
        setUser(null); // Limpa o usuário se não houver token
      }
      setLoadingAuth(false); // Termina o carregamento da autenticação
    };

    fetchUserProfile();
  }, [token]); // Este efeito é re-executado sempre que o 'token' muda

  // Função para realizar o login e armazenar o token
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('jwtToken', newToken); // Armazena o token no localStorage
    // Não precisa buscar o perfil aqui, o useEffect já cuidará disso
  };

  // Função para realizar o logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwtToken'); // Remove o token do localStorage
  };

  // O valor que será disponibilizado para os componentes que usarem o contexto
  const authContextValue = {
    token,
    user,
    login,
    logout,
    loadingAuth // Adiciona o estado de carregamento
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto de autenticação
export const useAuth = () => useContext(AuthContext);