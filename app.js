const express = require('express');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const app = express();
const port = new SerialPort('COM3', { baudRate: 9600 }); // Replace 'COM3' with the correct serial port name
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Handle received data from the Arduino
parser.on('data', (data) => {
  console.log('Received data:', data);
});

// Serve the client-side code (index.html)
app.use(express.static('public'));

// Handle the label data from the client
app.post('/label', express.json(), (req, res) => {
  const { label } = req.body;
  console.log('Received label from client:', label);

  // Send the label to the Arduino
  port.write(label);

  res.sendStatus(200);
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
