// src/components/OrderList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import Modal from './Modal';

function OrderList() {
  const { token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para controlar o modal
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });
  const [modalAction, setModalAction] = useState(null); // Para guardar a ação de confirmação
  // A variável de estado 'orderToCancel' foi removida, pois não é mais necessária
  // para passar o ID do pedido, que agora é enviado diretamente para a função de confirmação.

  // Use useCallback para memorizar a função fetchOrders.
  const fetchOrders = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        setError(data.message || 'Falha ao carregar pedidos.');
        if (response.status === 401) {
          logout(); // Desautentica se o token for inválido
        }
      }
    } catch (err) {
      console.error('Erro de rede ao buscar pedidos:', err);
      setError('Erro de conexão. Não foi possível carregar os seus pedidos.');
    } finally {
      setLoading(false);
    }
  }, [token, logout]); // Dependências de fetchOrders

  // useEffect para chamar fetchOrders quando o componente é montado ou as suas dependências mudam
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Agora, o useEffect depende de fetchOrders (que é memorizada pelo useCallback)

  // Função para cancelar um pedido (mostra o modal de confirmação)
  const handleCancelOrder = (orderId) => {
    if (!token) {
      setModalContent({ title: 'Erro de Autenticação', message: 'Você não está autenticado para cancelar pedidos.', type: 'error' });
      setShowModal(true);
      return;
    }

    // Não precisamos mais de setOrderToCancel(orderId) aqui
    setModalContent({
      title: 'Confirmar Cancelamento',
      message: `Tem certeza que deseja cancelar o pedido #${orderId}? Esta ação é irreversível.`,
      type: 'confirm'
    });
    // CRÍTICO: Passa o orderId como argumento para a função que será executada na confirmação do modal
    setModalAction(() => () => cancelOrderConfirmed(orderId));
    setShowModal(true);
    return;
  };

  // Nova função para ser chamada após a confirmação do modal de cancelamento
  // Agora recebe o orderId como argumento diretamente
  const cancelOrderConfirmed = async (orderIdToConfirm) => {
    console.log('[DEBUG CANCEL] Função cancelOrderConfirmed iniciada.');
    setShowModal(false); // Fecha o modal de confirmação
    
    try {
      setLoading(true);
      console.log(`[DEBUG CANCEL] Tentando cancelar pedido ID: ${orderIdToConfirm}`);
      const response = await fetch(`${API_BASE_URL}/orders/${orderIdToConfirm}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('[DEBUG CANCEL] Resposta da API:', response.status);
      // Tenta ler JSON, mas ignora se a resposta for 204 (No Content)
      const responseData = await response.json().catch(() => ({ message: 'No content' })); 

      if (response.status === 204) { // 204 No Content para eliminação bem-sucedida
        setModalContent({ title: 'Sucesso!', message: `Pedido #${orderIdToConfirm} cancelado com sucesso!`, type: 'success' });
        setShowModal(true);
        fetchOrders(); // Re-busca a lista de pedidos para atualizar a UI
        console.log('[DEBUG CANCEL] Pedido cancelado com sucesso. Rebuscando pedidos.');
      } else {
        console.error('[DEBUG CANCEL] Erro ao cancelar pedido:', responseData);
        setModalContent({ title: 'Erro', message: responseData.message || `Falha ao cancelar pedido #${orderIdToConfirm}.`, type: 'error' });
        setShowModal(true);
      }
    } catch (err) {
      console.error('[DEBUG CANCEL] Erro de rede ao cancelar pedido:', err);
      setModalContent({ title: 'Erro de Conexão', message: 'Erro de conexão. Não foi possível cancelar o pedido.', type: 'error' });
      setShowModal(true);
    } finally {
      setLoading(false);
      // setOrderToCancel(null); // Não é mais necessário, pois a variável de estado foi removida
      console.log('[DEBUG CANCEL] Finalizado o processo de cancelamento.');
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px', color: '#f0f0f0' }}>A carregar pedidos...</p>;
  }

  if (error) {
    return <p className="error-message">Erro: {error}</p>;
  }

  return (
    <div className="card" style={{ maxWidth: '800px' }}>
      <h2>Os Meus Pedidos</h2>
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#333' }}>Você não tem nenhum pedido ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1em', marginBottom: '10px', color: '#007bff' }}>Pedido #{order.id}</h3>
              {order.Products && order.Products.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {order.Products.map((product) => (
                    <li key={product.id} style={{ marginBottom: '5px', color: '#555' }}>
                      {product.name} (Quantidade: {product.OrderProduct.quantity}) - R$ {product.price ? product.price.toFixed(2) : '0.00'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#888' }}>Nenhum produto neste pedido.</p>
              )}
              <button
                onClick={() => handleCancelOrder(order.id)}
                style={{
                  marginTop: '15px',
                  padding: '8px 15px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }}
              >
                Cancelar Pedido
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Adiciona o componente Modal */}
      <Modal
        show={showModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onConfirm={() => {
          console.log('[DEBUG MODAL] Botão Confirmar clicado no modal.');
          if (modalAction) {
            modalAction(); // Executa a ação guardada (cancelOrderConfirmed com o ID correto)
          }
          setShowModal(false);
          setModalAction(null);
          // setOrderToCancel(null); // Não é mais necessário aqui
        }}
        onCancel={() => {
          setShowModal(false);
          setModalAction(null);
          // setOrderToCancel(null); // Não é mais necessário aqui
        }}
        onClose={() => {
          setShowModal(false);
          setModalAction(null);
          // setOrderToCancel(null); // Não é mais necessário aqui
        }}
      />
    </div>
  );
}

export default OrderList;
