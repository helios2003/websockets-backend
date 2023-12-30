const io = require('socket.io-client');

function createClient() {
  const socket = io.connect('http://localhost:3000');
 
  socket.on('connect', () => {
    console.log(`Connected to server with socket ID: ${socket.id}`);
  });
  socket.on('message', (message) => {
    console.log(`Received message from server: ${JSON.stringify(message)}`);
  });
  return socket;
}

prices = [500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620];

let currentPrice = 0;
function BiddingClient(socket) {
  let validPrices = prices.filter((price) => price > currentPrice);
  if (validPrices.length > 0) {
    let chosenPrice = validPrices[Math.floor(Math.random() * validPrices.length)];
    socket.emit('bid', { clientId: socket.id, price: chosenPrice });
    currentPrice = chosenPrice;
  } else {
    socket.emit('bid', { clientId: socket.id, price: 'No valid price' });
  }
}

function StartBidding() {
  let j = 0;
  const biddingInterval = setInterval(() => {
    if (j < 5) {
      BiddingClient(clients[j]);
      j++;
    } else {
      clearInterval(biddingInterval);
    }
  }, 1000);
}

const clients = [];

// connect 5 clients to the server with the interval of 1 second
let i = 0;
const interval = setInterval(() => {
  if (i < 5) {
      clients[i] = createClient();
      i++;
  } else {
    clearInterval(interval);
    if (clients.length === 5) {
      StartBidding();
    }
}}, 1000);
