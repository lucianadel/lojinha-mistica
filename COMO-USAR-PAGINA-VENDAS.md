# Configurar as ofertas da Lojinha Mística

A aparência, os filtros, os modais e a sacola são preservados. O cadastro das ofertas é centralizado no início de `script.js`.

## Onde cadastrar preços e links

- **`CHECKOUT_URLS`**: cole o checkout individual oficial da Hotmart entre as aspas da chave correspondente. Deixe `''` enquanto o link não existir.
- **`PRODUCT_PRICES`**: informe o preço inteiro em **centavos** na mesma chave. `12000` significa R$ 120,00. Deixe `null` enquanto o preço não estiver definido.

Um produto só fica disponível quando tem preço válido e checkout HTTPS de `pay.hotmart.com`. A configuração atualiza automaticamente os cards, os modais, a landing page e a sacola. Não é necessário editar valores no HTML.

| Produto | Chave nos dois objetos |
| --- | --- |
| Interpretação de Sonhos | `sonhos` |
| Baralho Cigano em 7 Dias | `baralho-7dias` |
| Curso Completo de Baralho Cigano | `curso-baralho` |
| Banhos Sagrados | `banhos-7dias` |
| Rituais de Umbanda | `rituais-umbanda` |
| Proteção Diária | `protecao-diaria` |

Sonhos permanece com preço `12000` e checkout `https://pay.hotmart.com/U108029098A`. Os demais produtos têm preço `null` e link vazio. Produtos sem preço mostram **Preço em breve**; produtos sem oferta completa mostram **Em breve**, sem redirecionamento ou adição à sacola.

## WhatsApp

`WHATSAPP_NUMBER` está configurado como `5521990669549`. A mensagem é montada no JavaScript com `encodeURIComponent()`. O botão abre a conversa preenchida; o envio é feito pela visitante.

## Sacola e pagamento

A sacola salva IDs e quantidades no navegador, sem confiar em preços gravados no armazenamento. Ofertas indisponíveis são removidas da seleção salva. Os controles + e − ajustam de 1 a 99 unidades; o contador e o total acompanham as alterações.

Cada e-book é pago separadamente na Hotmart. Com uma única unidade, a finalização abre o checkout do produto. Com mais unidades ou produtos, apresenta um link por unidade. Não existe cobrança unificada. A sacola não é apagada ao abrir o checkout, pois não recebe a confirmação do pagamento.

## Duplicar a landing page

1. Duplique `pagina-vendas-template.html` na mesma pasta para preservar os caminhos de CSS, JavaScript e imagens.
2. Troque título, descrição, capa e `alt`, público, benefícios, capítulos e FAQ pelo conteúdo real do e-book.
3. Troque `curso-baralho` pela chave correta em **todos** os atributos `data-product-price` e `data-checkout` da página.
4. Cadastre preço e checkout somente nos objetos de `script.js`. Para produtos novos, acrescente a mesma chave nos dois objetos.
5. Confira os capítulos e a apresentação da autora com os materiais reais antes de publicar. Não acrescente formação, depoimentos ou resultados sem comprovação.

Na vitrine, novos cards precisam de `data-product-id` e botões `data-add-to-cart` com a mesma chave. Os valores usam `data-product-price`; as compras usam `data-checkout` e `data-checkout-label` para o texto do CTA ativo.

Os HTMLs mantêm estados seguros sem JavaScript: as ofertas pendentes não têm links e Sonhos preserva seu checkout conhecido. O cadastro automático e a sacola exigem JavaScript. A entrega digital é liberada após confirmação do pagamento; a garantia anunciada é de 7 dias.
