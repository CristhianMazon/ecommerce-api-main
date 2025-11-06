// src/components/Modal.jsx
import React from 'react';

// Componente Modal reutilizável
// Props:
// - show: boolean para controlar a visibilidade do modal
// - title: título do modal
// - message: mensagem principal do modal
// - type: 'info', 'success', 'error', 'confirm' (para estilização e botões)
// - onConfirm: função a ser chamada se o utilizador confirmar (apenas para type='confirm')
// - onCancel: função a ser chamada se o utilizador cancelar (apenas para type='confirm')
// - onClose: função a ser chamada ao fechar o modal (para 'info', 'success', 'error')
function Modal({ show, title, message, type, onConfirm, onCancel, onClose }) {
  if (!show) {
    return null; // Não renderiza nada se show for falso
  }

  // Define a cor da borda e do botão com base no tipo de modal
  let borderColor = '#ccc';
  let buttonBgColor = '#007bff';
  // let buttonHoverColor = '#0056b3'; // Removida, pois não estava a ser utilizada.

  if (type === 'success') {
    borderColor = '#28a745';
    buttonBgColor = '#28a745';
  } else if (type === 'error') {
    borderColor = '#dc3545';
    buttonBgColor = '#dc3545';
  } else if (type === 'confirm') {
    borderColor = '#ffc107';
    buttonBgColor = '#007bff'; // Botão de confirmação azul
  }

  // Estilos inline para o modal (pode ser movido para CSS para maior controlo)
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    border: `2px solid ${borderColor}`,
    color: '#333', // Cor do texto dentro do modal
  };

  const modalTitleStyle = {
    color: '#333',
    marginBottom: '15px',
    fontSize: '1.5em',
  };

  const modalMessageStyle = {
    color: '#555',
    marginBottom: '25px',
    fontSize: '1.1em',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    color: 'white',
    transition: 'background-color 0.3s ease',
    margin: '0 10px',
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={modalTitleStyle}>{title}</h2>
        <p style={modalMessageStyle}>{message}</p>

        {type === 'confirm' ? (
          <div>
            <button
              onClick={onConfirm} // <--- VERIFICADO: Chama a prop onConfirm
              style={{ ...buttonStyle, backgroundColor: buttonBgColor }}
            >
              Confirmar
            </button>
            <button
              onClick={onCancel}
              style={{ ...buttonStyle, backgroundColor: '#6c757d' }} // Botão de cancelar cinzento
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            style={{ ...buttonStyle, backgroundColor: buttonBgColor }}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
}

export default Modal;
