# Registro de Alterações (CHANGELOG)

## [v1.1.0] - 2025-12-03 (Versão de Manutenção Final)

### Added (Manutenção Evolutiva)
- Implementação completa do Carrinho de Compras (Front e Back).
- Funcionalidade de finalização de pedido (checkout) com controle de transação no banco de dados.

### Fixed (Manutenção Corretiva)
- Corrigido problema de lógica na reposição de estoque ao cancelar pedidos no `orderController.js`, garantindo a atomicidade da transação.

### Changed (Manutenção Perfectiva / Adaptativa)
- **Adaptativa:** Ajuste da configuração CORS em `src/app.js` para se adequar ao ambiente do frontend (porta 5173).
- **Perfectiva:** Refatoração no `CartContext.jsx` para incluir validação de estoque no frontend, melhorando a robustez e a experiência do usuário.