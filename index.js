const { createServer } = require('http')
const { Server } = require('socket.io')

const server = createServer()
const io = new Server(server)

const maxClients = 5
let clientId = []
let clientToPrices = []
io.on('connection', (socket) => {
        if (clientId.length < maxClients) {
            clientId.push(socket.id);
            console.log(`Client ${socket.id} is connected`);
            console.log("length is " + clientId.length);
            if (clientId.length === maxClients) {
                socket.emit('message', 'Clients can start bidding');
            }
        } else {
            socket.emit('message', 'Server is full');
            socket.disconnect(true);
        }
        socket.on('bid', (bid) => {
            clientToPrices.push(bid);
            console.log(clientToPrices);
            console.log(`Received bid from ${bid.clientId} with price: ${bid.price}`);
            if (clientToPrices.length === maxClients) {
                let maxPrice = 0;
                let maxClient = '';
                clientToPrices.forEach((client) => {
                    if (client.price > maxPrice) {
                        maxPrice = client.price;
                        maxClient = client.clientId;
                    }
                });
                console.log(`Client ${maxClient} won the auction with price ${maxPrice}`);
                io.emit('message', `Client ${maxClient} won the auction with price ${maxPrice}`);
                clientToPrices = [];
            }
        });
});

server.listen(3000, () => {
    console.log("Server is running on port 3000") 
});
