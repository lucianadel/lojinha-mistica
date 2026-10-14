# Reutilizar a página de vendas

1. Duplique `pagina-vendas-template.html` na mesma pasta. Use um nome como `baralho-7-dias.html` para preservar os caminhos de `style.css`, `script.js` e `imagens/`.
2. Troque o `<title>`, a meta description, o nome do produto, a promessa principal, o público-alvo, os benefícios, os capítulos e o FAQ pelo conteúdo do novo e-book. Atualize também a oferta nas duas seções de compra.
3. Substitua o caminho da capa por um arquivo real de `imagens/` e ajuste o `alt`. A capa principal usa carregamento prioritário por estar na primeira tela.
4. Atualize o preço em todas as ocorrências. A landing page atual usa R$ 29,90, seguindo o preço da vitrine.
5. Configure o checkout por uma das opções abaixo. Use a mesma URL nos dois CTAs da página.

## Configuração dos links

**Por página:** substitua todos os `https://pay.kiwify.com.br/SEU_LINK_AQUI` pela URL final da Kiwify. Remova `data-checkout` dos CTAs se quiser que os links sejam controlados somente pelo HTML.

**Centralizada:** preencha `CHECKOUT_URLS` em `script.js` e use a chave correspondente em `data-checkout` nos CTAs. Uma URL HTTPS válida configurada no JavaScript substitui o `href` do HTML. Se a configuração estiver vazia, o `href` permanece. Atualize também os marcadores do HTML para funcionar quando JavaScript estiver desativado.

| Produto | Chave `data-checkout` |
| --- | --- |
| Interpretação de Sonhos | `sonhos` |
| Baralho Cigano em 7 Dias | `baralho-7dias` |
| Curso Completo de Baralho Cigano | `curso-baralho` |
| Banhos Sagrados | `banhos-7dias` |
| Rituais de Umbanda | `rituais-umbanda` |
| Proteção Diária | `protecao-diaria` |

Para adicionar um produto, crie uma nova chave no objeto `CHECKOUT_URLS` e use-a em todos os CTAs desse produto. Ao duplicar a página, não mantenha a chave `curso-baralho` em um produto diferente, pois isso poderá encaminhar a compra para o checkout errado.

## Conferência antes de publicar

- Os PDFs não foram fornecidos: a descrição dos capítulos e os benefícios são uma proposta editorial baseada nos textos existentes da vitrine. Confira cada item com o material real e ajuste os títulos do índice.
- A oferta atual é de um PDF. Confirme se não há outros formatos, aulas, suporte ou condições que devam ser informados.
- A entrega imediata anunciada ocorre após confirmação do pagamento. Configure a entrega e a garantia incondicional de 7 dias na oferta correspondente.
- Complete a apresentação da autora apenas com informações verificadas. Nenhuma formação, número de clientes ou depoimento foi inventado.
- Revise os termos e avisos do rodapé com as condições reais da oferta.
- Substitua todos os marcadores `SEU_LINK_AQUI` antes de publicar. Eles são links de demonstração, não checkouts válidos.
- Na vitrine, o modal do Curso Completo já aponta para a landing page. Para outros produtos, adicione um link semelhante no modal correspondente.

As sanfonas de conteúdo e FAQ usam `<details>` e `<summary>` e funcionam sem JavaScript. O `script.js` é compartilhado para configurar os links; a busca e os modais continuam específicos da vitrine.
