// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { useCart } from '../context/CartContext'; // Importa o hook useCart

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); // NOVO ESTADO para notificações
  const { addToCart } = useCart(); // Pega a função addToCart do contexto

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          setError(data.message || 'Falha ao carregar produtos.');
        }
      } catch (err) {
        console.error('Erro de rede ao buscar produtos:', err);
        setError('Erro de conexão. Não foi possível carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Função para lidar com a adição ao carrinho e tratar o status de retorno
  const handleAddToCart = (product) => {
    setNotification(null); // Limpa a notificação anterior
    const result = addToCart(product); // Chama a função que agora retorna um objeto de status

    if (!result.success) {
      // Se a adição falhar devido a estoque insuficiente, define uma notificação de erro
      setNotification({ message: result.message, type: 'error' });
    } else {
      // Notificação de sucesso (opcional, mas útil)
      setNotification({ message: result.message || `${product.name} adicionado ao carrinho!`, type: 'success' });
    }
    // Remove a notificação após 3 segundos
    setTimeout(() => setNotification(null), 3000);
  };


  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando produtos...</p>;
  }

  if (error) {
    return <p className="error-message">Erro: {error}</p>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#f0f0f0' }}>Nossos Produtos</h2>
      
      {/* Exibe a notificação */}
      {notification && (
        <p className={notification.type === 'error' ? 'error-message' : 'success-message'} style={{ textAlign: 'center', marginBottom: '15px' }}>
          {notification.message}
        </p>
      )}

      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#f0f0f0' }}>Nenhum produto disponível no momento.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description || 'Sem descrição.'}</p>
              <p className="price">
                R$ {product.price ? product.price.toFixed(2) : '0.00'}
              </p>
              {/* Estilo condicional se o estoque for 0 */}
              <p className="stock-category" style={{ color: product.stock === 0 ? '#dc3545' : '#888' }}>
                Estoque: {product.stock}
              </p>
              <p className="stock-category">
                Categoria: {product.Category ? product.Category.name : 'N/A'}
              </p>
              <button
                onClick={() => handleAddToCart(product)} // Usa a nova função de handler
                disabled={product.stock === 0} // Desabilita se o estoque for 0 (Melhoria de UX)
                style={{
                  marginTop: '15px',
                  padding: '10px 15px',
                  backgroundColor: product.stock === 0 ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '1em'
                }}
              >
                {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;