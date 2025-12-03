// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Cria o contexto do carrinho
const CartContext = createContext(null);

// Provedor do carrinho que envolverá sua aplicação
export const CartProvider = ({ children }) => {
  // Estado para armazenar os itens do carrinho.
  // Cada item no array será um objeto: { productId: 1, name: 'Produto X', price: 100, quantity: 1 }
  const [cartItems, setCartItems] = useState(() => {
    // Tenta carregar o carrinho do localStorage ao iniciar
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Efeito para salvar o carrinho no localStorage sempre que cartItems mudar
  useEffect(() => {
    console.log('Carrinho atualizado (localStorage):', cartItems); // Log do carrinho atualizado
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Função para adicionar um item ao carrinho
  const addToCart = (product, quantity = 1) => {
    console.log('addToCart chamado com:', product, 'Quantidade a adicionar:', quantity); // Log inicial
    
    if (!product || (!product.id && !product.productId)) {
        console.error('Produto inválido ou sem ID/productId ao tentar adicionar ao carrinho:', product);
        return { success: false, message: 'Produto inválido.' }; // Retorna erro de validação
    }

    const itemId = product.id || product.productId;
    let success = true;
    let message = '';
    let productName = '';

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === itemId);
      console.log('PrevItems (antes da atualização):', prevItems); // Log dos itens anteriores
      console.log('Existing Item Index:', existingItemIndex); // Log do índice

      const productStock = product.stock;
      productName = product.name;

      if (existingItemIndex > -1) {
        // Se o item já existe, atualiza a quantidade
        const updatedItems = [...prevItems];
        const currentItem = { ...updatedItems[existingItemIndex] };
        const currentQuantity = currentItem.quantity;
        const newQuantity = currentQuantity + quantity;
        
        // --- LOGS DE DEPURACAO DE ESTOQUE ---
        console.log(`[DEBUG ESTOQUE] Produto: ${product.name}`);
        console.log(`[DEBUG ESTOQUE] Quantidade atual no carrinho: ${currentQuantity}`);
        console.log(`[DEBUG ESTOQUE] Quantidade a adicionar: ${quantity}`);
        console.log(`[DEBUG ESTOQUE] Nova quantidade tentativa: ${newQuantity}`);
        console.log(`[DEBUG ESTOQUE] Estoque disponível (product.stock): ${productStock}`);
        // -----------------------------------

        // Validação de estoque: impede que a quantidade no carrinho exceda o estoque disponível
        if (newQuantity > productStock) {
            console.warn(`[ALERTA ESTOQUE] Não é possível adicionar mais de ${product.name}. Estoque máximo (${productStock}) atingido.`);
            
            // Define o status de falha e a mensagem
            success = false;
            message = `Estoque insuficiente para adicionar mais do produto ${productName}. Limite: ${productStock}.`;

            return prevItems; // Retorna o estado anterior para não exceder o estoque
        }
        
        currentItem.quantity = newQuantity;
        updatedItems[existingItemIndex] = currentItem;
        
        console.log('Quantidade atualizada para:', updatedItems[existingItemIndex]);
        return updatedItems; // Retorna o novo array com o item atualizado
      } else {
        // Se o item não existe, adiciona-o ao carrinho
        // Verifique se a quantidade inicial não excede o estoque
        if (quantity > product.stock) {
            console.warn(`[ALERTA ESTOQUE] Não é possível adicionar ${product.name}. Quantidade inicial (${quantity}) excede o estoque (${product.stock}).`);

            // Define o status de falha e a mensagem
            success = false;
            message = `Quantidade solicitada (${quantity}) excede o estoque inicial (${productStock}) para ${productName}.`;

            return prevItems;
        }
        console.log('Adicionando novo item ao carrinho:', { productId: itemId, name: product.name, price: product.price, stock: product.stock, quantity: quantity });
        return [...prevItems, {
          productId: itemId,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity: quantity
        }];
      }
    });

    // Retorna o status da operação para o componente chamador
    return { success, message: success ? `${productName} adicionado ao carrinho.` : message };
  };

  // Função para remover um item do carrinho ou diminuir sua quantidade
  const removeFromCart = (productId, quantityToRemove = 1) => {
    console.log('removeFromCart chamado para ID:', productId, 'Quantidade a remover:', quantityToRemove);
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const currentItem = { ...updatedItems[existingItemIndex] }; // CRÍTICO: Cria uma cópia do item existente
        currentItem.quantity -= quantityToRemove; // Atualiza a quantidade na cópia do item

        if (currentItem.quantity <= 0) { // Verifica a quantidade na cópia
          console.log('Removendo item completamente (quantidade <= 0):', productId);
          return updatedItems.filter(item => item.productId !== productId); // Filtra o array
        }
        updatedItems[existingItemIndex] = currentItem; // Substitui o item antigo pela cópia atualizada
        console.log('Quantidade do item atualizada para:', updatedItems[existingItemIndex]);
        return updatedItems; // Retorna o novo array com o item atualizado
      }
      console.warn('Tentativa de remover item não encontrado no carrinho:', productId);
      return prevItems;
    });
  };

  // Função para remover completamente um item do carrinho
  const removeProductCompletely = (productId) => {
    console.log('removeProductCompletely chamado para ID:', productId);
    setCartItems((prevItems) => prevItems.filter(item => item.productId !== productId));
  };

  // Função para limpar todo o carrinho
  const clearCart = () => {
    console.log('clearCart chamado');
    setCartItems([]);
  };

  // Calcula o total de itens no carrinho
  const cartTotalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calcula o valor total do carrinho
  const cartTotalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);


  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    removeProductCompletely,
    clearCart,
    cartTotalItems,
    cartTotalPrice,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto do carrinho
export const useCart = () => useContext(CartContext);