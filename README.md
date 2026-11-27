# Dev Coffee API

## Sobre o projeto

A Dev Coffee API é uma aplicação Back-End desenvolvida para gerenciar os pedidos de uma cafeteria, permitindo cadastrar, consultar, atualizar e excluir pedidos.

O projeto foi desenvolvido utilizando exclusivamente módulos nativos do Node.js, sem utilização de frameworks ou bibliotecas externas.

## Autor

**Bruno Martinho**

## Tecnologias utilizadas

- Node.js
- Módulo nativo HTTP (`node:http`)
- Módulo URL (`node:url`)
- JavaScript
- JSON

## Como executar o projeto

**Requisitos:**
- Node.js instalado na máquina.

**Passos para execução:**

1. Abra o terminal na pasta do projeto.
2. Execute o comando:

```bash
npm start
```

3. O servidor será iniciado no endereço:

```text
http://localhost:3000
```

Não é necessário executar `npm install`, pois o projeto não utiliza dependências externas.

## Estrutura do projeto

```text
dev-coffee/
├── server.js
├── package.json
└── README.md
```

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/orders` | Lista todos os pedidos |
| GET | `/orders?status=pendente` | Filtra pedidos por status |
| GET | `/orders/:id` | Busca um pedido pelo ID |
| POST | `/orders` | Cadastra um novo pedido |
| PATCH | `/orders/:id/status` | Atualiza o status de um pedido |
| DELETE | `/orders/:id` | Exclui um pedido |

### 1. Cadastrar pedido

**POST /orders**

Corpo da requisição:

```json
{
  "client": "Bruno",
  "item": "Cappuccino"
}
```

Retorno esperado: `201 Created`.

O pedido recebe um ID automático e inicia com status `pendente`.

Exemplo cURL:

```bash
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d "{\"client\":\"Bruno\",\"item\":\"Cappuccino\"}"
```

### 2. Listar pedidos

**GET /orders**

Retorna todos os pedidos cadastrados.

Retorno esperado: `200 OK`.

Exemplo cURL:

```bash
curl http://localhost:3000/orders
```

### 3. Filtrar pedidos por status

**GET /orders?status=pendente**

Permite filtrar os pedidos utilizando o parâmetro `status`.

Status disponíveis:

- pendente
- pronto
- cancelado

Retorno esperado: `200 OK`.

Exemplo cURL:

```bash
curl "http://localhost:3000/orders?status=pendente"
```

### 4. Buscar pedido por ID

**GET /orders/1**

Busca um pedido específico pelo seu identificador.

Retornos possíveis:

- `200 OK`: pedido encontrado.
- `404 Not Found`: pedido não encontrado.

Exemplo cURL:

```bash
curl http://localhost:3000/orders/1
```

### 5. Atualizar status do pedido

**PATCH /orders/1/status**

Atualiza exclusivamente o status do pedido.

Corpo da requisição:

```json
{
  "status": "pronto"
}
```

Status permitidos:

- pendente
- pronto
- cancelado

Retornos possíveis:

- `200 OK`: status atualizado.
- `400 Bad Request`: status inválido.
- `404 Not Found`: pedido não encontrado.

Exemplo cURL:

```bash
curl -X PATCH http://localhost:3000/orders/1/status -H "Content-Type: application/json" -d "{\"status\":\"pronto\"}"
```

### 6. Excluir pedido

**DELETE /orders/1**

Remove um pedido pelo ID.

Retornos possíveis:

- `204 No Content`: pedido removido com sucesso.
- `404 Not Found`: pedido não encontrado.

Exemplo cURL:

```bash
curl -X DELETE http://localhost:3000/orders/1
```

A resposta `204 No Content` não possui corpo.

### 7. Tratamento de rotas inexistentes

Qualquer rota ou método HTTP não implementado retorna:

`404 Not Found`

Exemplo cURL:

```bash
curl http://localhost:3000/rota-inexistente
```

## Requisitos técnicos implementados

- Criação do servidor utilizando `http.createServer()`.
- Utilização exclusiva de módulos nativos do Node.js.
- Armazenamento dos pedidos em memória.
- Geração automática de IDs sequenciais.
- Leitura do corpo das requisições utilizando `req.on('data')` e `req.on('end')`.
- Manipulação de dados utilizando `Buffer`.
- Conversão de JSON utilizando `JSON.parse()` com tratamento de erros através de `try/catch`.
- Validação dos campos obrigatórios.
- Validação dos status permitidos.
- Configuração do cabeçalho `Content-Type: application/json; charset=utf-8`.
- Tratamento de respostas HTTP conforme os códigos de status especificados.

## Observação

Os pedidos são armazenados em memória, portanto, os dados cadastrados são perdidos quando o servidor é encerrado ou reiniciado.

---

**Projeto desenvolvido como atividade prática de Desenvolvimento Back-End (AP2).**