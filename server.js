
const http = require('node:http');
const { URL } = require('node:url');


const orders = [];
let nextId = 1;


const VALID_STATUSES = ['pendente', 'pronto', 'cancelado'];

const PORT = 3000;


function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8'
    });

    res.end(JSON.stringify(data));
}


function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            const bodyBuffer = Buffer.concat(chunks);
            const bodyText = bodyBuffer.toString('utf8');

            if (!bodyText.trim()) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(bodyText));
            } catch (error) {
                reject(new Error('JSON inválido no corpo da requisição.'));
            }
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
}


function findOrder(id) {
    return orders.find(order => order.id === id);
}


const server = http.createServer(async (req, res) => {

    const requestUrl = new URL(
        req.url,
        `http://${req.headers.host || 'localhost'}`
    );

    const pathname = requestUrl.pathname;
    const method = req.method;

    //lista pedidos
    if (method === 'GET' && pathname === '/orders') {

        const statusFilter = requestUrl.searchParams.get('status');

        const result = statusFilter
            ? orders.filter(order => order.status === statusFilter)
            : orders;

        sendJson(res, 200, result);
        return;
    }

    // cria pedido
    if (method === 'POST' && pathname === '/orders') {

        let body;

        try {
            body = await readRequestBody(req);
        } catch (error) {
            sendJson(res, 400, { error: error.message });
            return;
        }

        if (
            !body ||
            typeof body !== 'object' ||
            Array.isArray(body) ||
            typeof body.client !== 'string' ||
            !body.client.trim() ||
            typeof body.item !== 'string' ||
            !body.item.trim()
        ) {
            sendJson(res, 400, {
                error: 'Os campos client e item são obrigatórios.'
            });
            return;
        }

        const newOrder = {
            id: nextId++,
            client: body.client.trim(),
            item: body.item.trim(),
            status: 'pendente'
        };

        orders.push(newOrder);

        sendJson(res, 201, newOrder);
        return;
    }

    // busca pedido
    if (method === 'GET' && /^\/orders\/\d+$/.test(pathname)) {

        const id = Number(pathname.split('/')[2]);
        const order = findOrder(id);

        if (!order) {
            sendJson(res, 404, {
                error: 'Pedido não encontrado.'
            });
            return;
        }

        sendJson(res, 200, order);
        return;
    }

    // atualiza status
    if (
        method === 'PATCH' &&
        /^\/orders\/\d+\/status$/.test(pathname)
    ) {

        const id = Number(pathname.split('/')[2]);
        const order = findOrder(id);

        if (!order) {
            sendJson(res, 404, {
                error: 'Pedido não encontrado.'
            });
            return;
        }

        let body;

        try {
            body = await readRequestBody(req);
        } catch (error) {
            sendJson(res, 400, { error: error.message });
            return;
        }

        if (
            !body ||
            typeof body !== 'object' ||
            Array.isArray(body) ||
            !VALID_STATUSES.includes(body.status)
        ) {
            sendJson(res, 400, {
                error: 'Status inválido. Utilize: pendente, pronto ou cancelado.'
            });
            return;
        }

        order.status = body.status;

        sendJson(res, 200, order);
        return;
    }

    //  exclui pedido
    if (method === 'DELETE' && /^\/orders\/\d+$/.test(pathname)) {

        const id = Number(pathname.split('/')[2]);

        const index = orders.findIndex(order => order.id === id);

        if (index === -1) {
            sendJson(res, 404, {
                error: 'Pedido não encontrado.'
            });
            return;
        }

        orders.splice(index, 1);


        res.writeHead(204);
        res.end();
        return;
    }


    sendJson(res, 404, {
        error: 'Rota ou método não encontrado.',
        method: method,
        path: pathname
    });
});


server.listen(PORT, () => {
    console.log(`Dev Coffee API rodando em http://localhost:${PORT}`);
});

// tratando  erros do servidor
server.on('error', (error) => {
    console.error('Erro no servidor:', error);
});
