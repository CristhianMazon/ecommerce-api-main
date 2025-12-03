// src/App.jsx
import React, { useState } from 'react'; // Importa useState para gerenciar o estado local
import './App.css'; // Importa o arquivo CSS para estilização (pode ser personalizado depois)
import { useAuth } from './context/AuthContext'; // Importa o hook useAuth do nosso contexto de autenticação
import Login from './components/Login'; // Importa o componente Login
import Register from './components/Register'; // Importa o componente Register
import ProductList from './components/ProductList'; // Importa o componente ProductList
import UserProfile from './components/UserProfile'; // Importa o componente UserProfile
import OrderList from './components/OrderList'; // Importa o componente OrderList
import CartView from './components/CartView'; // Importa o componente CartView (para o carrinho de compras)


function App() {
  // Desestrutura o token, a função logout e o estado de carregamento da autenticação do hook useAuth.
  // 'token' indica se o usuário está logado.
  // 'logout' é a função para deslogar o usuário.
  // 'loadingAuth' indica se o processo inicial de verificação de autenticação está em andamento.
  const { token, logout, loadingAuth } = useAuth();

  // Estado local para controlar qual formulário de autenticação deve ser exibido.
  // Se 'true', mostra o formulário de Login. Se 'false', mostra o formulário de Registro.
  const [showLogin, setShowLogin] = useState(true);

  // Novo estado para controlar a seção ativa da aplicação para usuários logados.
  // Pode ser 'products', 'profile', 'orders', 'cart'. Inicia mostrando 'products'.
  const [activeSection, setActiveSection] = useState('products');

  // Se o estado de carregamento da autenticação for verdadeiro, exibe uma mensagem de carregamento.
  // Isso é útil para evitar que a UI pisque enquanto o AuthContext verifica o token no localStorage
  // e tenta buscar o perfil do usuário.
  if (loadingAuth) {
    return (
      <div className="App">
        <header>
          <h1>Mazon Express</h1>
        </header>
        <main>
          <p style={{ textAlign: 'center', marginTop: '50px' }}>Verificando autenticação...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>Mazon Express</h1>
        {/* Barra de navegação com botões de autenticação ou navegação */}
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
          {!token ? ( // Se não houver um token (usuário não logado)
            <>
              {/* Botão para alternar para o formulário de Login */}
              <button
                onClick={() => setShowLogin(true)}
                // Estilo condicional para destacar o botão ativo
                style={{
                  padding: '10px 20px',
                  backgroundColor: showLogin ? '#0056b3' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Login
              </button>
              {/* Botão para alternar para o formulário de Registro */}
              <button
                onClick={() => setShowLogin(false)}
                // Estilo condicional para destacar o botão ativo
                style={{
                  padding: '10px 20px',
                  backgroundColor: !showLogin ? '#218838' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Registrar
              </button>
            </>
          ) : ( // Se houver um token (usuário logado)
            <>
              {/* Botões de navegação para usuários logados */}
              <button
                onClick={() => setActiveSection('profile')} // Define a seção ativa como 'profile'
                // Estilo condicional para destacar o botão ativo
                style={{
                  padding: '10px 20px',
                  backgroundColor: activeSection === 'profile' ? '#5a6268' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Meu Perfil
              </button>
              <button
                onClick={() => setActiveSection('products')} // Define a seção ativa como 'products'
                // Estilo condicional para destacar o botão ativo
                style={{
                  padding: '10px 20px',
                  backgroundColor: activeSection === 'products' ? '#5a6268' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Produtos
              </button>
              <button
                onClick={() => setActiveSection('orders')} // Define a seção ativa como 'orders'
                // Estilo condicional para destacar o botão ativo
                style={{
                  padding: '10px 20px',
                  backgroundColor: activeSection === 'orders' ? '#5a6268' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Meus Pedidos
              </button>
              {/* NOVO BOTÃO: Carrinho */}
              <button
                onClick={() => setActiveSection('cart')} // Define a seção ativa como 'cart'
                style={{
                  padding: '10px 20px',
                  backgroundColor: activeSection === 'cart' ? '#5a6268' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Carrinho
              </button>
              {/* Botão de logout. Chama a função 'logout' do contexto. */}
              <button
                onClick={logout}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545', // Cor vermelha para logout
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </header>
      {/* A tag <main> ocupa a largura total para que seu conteúdo possa ser centralizado */}
      <main style={{ width: '100%' }}>
        {!token ? ( // Se o usuário NÃO estiver logado
          // Renderiza condicionalmente o componente Login ou Register
          showLogin ? (
            <Login /> // Exibe o formulário de Login
          ) : (
            // Exibe o formulário de Registro.
            // A prop 'onRegisterSuccess' é uma função que, ao ser chamada pelo componente Register,
            // muda o estado 'showLogin' para 'true', fazendo com que a tela de Login seja exibida.
            <Register onRegisterSuccess={() => setShowLogin(true)} />
          )
        ) : ( // Se o usuário ESTIVER logado
          // Renderiza o componente correspondente à seção ativa
          activeSection === 'products' ? (
            <ProductList /> // Exibe a lista de produtos
          ) : activeSection === 'profile' ? (
            <UserProfile /> // Exibe o perfil do usuário
          ) : activeSection === 'orders' ? (
            <OrderList /> // Exibe a lista de pedidos
          ) : activeSection === 'cart' ? (
            <CartView /> // Exibe o componente do carrinho de compras
          ) : (
            // Fallback: se activeSection tiver um valor inesperado, mostra a lista de produtos
            <ProductList />
          )
        )}
      </main>
    </div>
  );
}

export default App;
