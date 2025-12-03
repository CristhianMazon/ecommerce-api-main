# Registro de Alterações (CHANGELOG)

## [v1.1.0] - Versão de Manutenção

### Added (Manutenção Evolutiva)
- Implementação completa do Carrinho de Compras (`CartContext`, `CartView`).
- Funcionalidade de finalização de pedido (checkout).

### Fixed (Manutenção Corretiva)
- Corrigido problema de lógica na reposição de estoque ao cancelar pedidos no `orderController.js`.

### Changed (Manutenção Perfectiva / Adaptativa)
- **Segurança Adaptativa:** Ajuste da configuração CORS em `src/app.js` para restringir o acesso à porta 5173 (ambiente do Frontend).
- **Perfectiva/Perfectiva:** Refatoração do `CartContext.jsx` para incluir validação de estoque antes de adicionar itens no carrinho, melhorando a robustez.