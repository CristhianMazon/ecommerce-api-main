// src/components/CartView.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; // Importa o hook useCart para aceder aos itens do carrinho
import { useAuth } from '../context/AuthContext'; // Para aceder ao token do utilizador (para criar pedido)
import { API_BASE_URL } from '../config/api'; // Importa a URL base da API
import Modal from './Modal'; // Importa o componente Modal

function CartView() {
  const { cartItems, addToCart, removeFromCart, removeProductCompletely, clearCart, cartTotalPrice } = useCart();
  const { token } = useAuth(); // Pega o token para a criação do pedido
  const [loadingOrder, setLoadingOrder] = useState(false); // Estado para carregamento do pedido
  const [orderError, setOrderError] = useState(null); // Estado para erros do pedido
  const [orderSuccess, setOrderSuccess] = useState(null); // Estado para sucesso do pedido

  // Estados para controlar o modal
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });
  const [modalAction, setModalAction] = useState(null); // Para guardar a ação de confirmação

  // Função para ser chamada após a confirmação do modal de pedido
  const placeOrderConfirmed = async () => {
    setShowModal(false); // Fecha o modal de confirmação
    setLoadingOrder(true);
    setOrderError(null);
    setOrderSuccess(null);

    const productsForOrder = cartItems.map(item => ({
      productId: item.productId, // Usa item.productId conforme guardado no carrinho
      quantity: item.quantity
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products: productsForOrder })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess(`Pedido #${data.orderId} criado com sucesso!`);
        clearCart(); // Limpa o carrinho após o pedido
        setModalContent({ title: 'Sucesso!', message: `Pedido #${data.orderId} criado com sucesso!`, type: 'success' });
        setShowModal(true);
      } else {
        setOrderError(data.message || 'Falha ao finalizar o pedido.');
        setModalContent({ title: 'Erro', message: data.message || 'Falha ao finalizar o pedido.', type: 'error' });
        setShowModal(true);
      }
    } catch (err) {
      console.error('Erro de rede ao finalizar pedido:', err);
      setOrderError('Erro de conexão. Não foi possível finalizar o pedido.');
      setModalContent({ title: 'Erro de Conexão', message: 'Erro de conexão. Não foi possível finalizar o pedido.', type: 'error' });
      setShowModal(true);
    } finally {
      setLoadingOrder(false);
    }
  };

  // Função para iniciar o processo de finalização do pedido (mostra o modal de confirmação)
  const handlePlaceOrder = () => {
    if (!token) {
      setModalContent({ title: 'Erro de Autenticação', message: 'Você precisa estar logado para finalizar um pedido.', type: 'error' });
      setShowModal(true);
      return;
    }
    if (cartItems.length === 0) {
      setModalContent({ title: 'Carrinho Vazio', message: 'Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.', type: 'info' });
      setShowModal(true);
      return;
    }

    setModalContent({
      title: 'Confirmar Pedido',
      message: `Deseja finalizar o pedido no valor total de R$ ${cartTotalPrice.toFixed(2)}?`,
      type: 'confirm'
    });
    setModalAction(() => placeOrderConfirmed); // Guarda a função a ser chamada na confirmação
    setShowModal(true);
  };

  // Log para verificar o estado do carrinho antes da renderização
  console.log('CartView renderizando. cartItems atual:', cartItems); 

  return (
    <div className="card" style={{ maxWidth: '800px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Meu Carrinho</h2>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#333' }}>Seu carrinho está vazio.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cartItems.map((item) => (
            <div key={item.productId} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              color: '#333'
            }}>
              <div style={{ flex: 2 }}>
                <h3 style={{ margin: 0, fontSize: '1.1em', color: '#333' }}>{item.name}</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>
                  R$ {item.price ? item.price.toFixed(2) : '0.00'}
                </p>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  style={{ padding: '5px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => {
                    console.log('Botão "+" clicado para:', item.name, 'ID:', item.productId, 'Item completo:', item);
                    addToCart(item, 1); // Passa explicitamente '1' como a quantidade a adicionar
                  }}
                  // Desabilita o botão se a quantidade no carrinho for igual ao estoque
                  disabled={item.quantity >= item.stock}
                  style={{ padding: '5px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
              <div style={{ flex: 0.5, textAlign: 'right' }}>
                <button
                  onClick={() => removeProductCompletely(item.productId)}
                  style={{ padding: '5px 8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>
            Total: R$ {cartTotalPrice.toFixed(2)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              onClick={clearCart}
              style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Limpar Carrinho
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loadingOrder || cartItems.length === 0}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              {loadingOrder ? 'Finalizando...' : 'Finalizar Pedido'}
            </button>
          </div>

          {orderError && <p className="error-message">{orderError}</p>}
          {orderSuccess && <p className="success-message">{orderSuccess}</p>}

          {/* Adiciona o componente Modal */}
          <Modal
            show={showModal}
            title={modalContent.title}
            message={modalContent.message}
            type={modalContent.type}
            onConfirm={() => {
              if (modalAction) {
                modalAction(); // Executa a ação guardada (placeOrderConfirmed)
              }
              setShowModal(false); // Fecha o modal
              setModalAction(null); // Limpa a ação
            }}
            onCancel={() => {
              setShowModal(false); // Fecha o modal
              setModalAction(null); // Limpa a ação
            }}
            onClose={() => {
              setShowModal(false); // Fecha o modal
              setModalAction(null); // Limpa a ação
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CartView;
