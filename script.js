const video = document.getElementById('video');
let label = '';

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();

  ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/MEU7tunuK/model.json', (classifier) => {
    setInterval(() => {
      classifier.classify(video, (error, results) => {
        if (error) {
          console.error('Error:', error);
          return;
        }

        label = results[0].label;
        console.log('Label:', label);
        port.write(label);
      });
    }, 1000);
  });
}).catch((err) => {
  console.error('Error:', err);
});

SerialPort.list().then((ports) => {
  console.log('Available serial ports:');
  console.log(ports);
  const arduinoPort = ports.find((port) => port.manufacturer && port.manufacturer.includes('Arduino'));
  
  if (arduinoPort) {
    console.log(`Connecting to Arduino at ${arduinoPort.path}...`);
    const port = new SerialPort(arduinoPort.path, { baudRate: 9600 });

    port.on('open', () => {
      console.log('Serial port opened');
    });

    port.on('error', (err) => {
      console.error('Error:', err.message);
    });

    port.on('data', (data) => {
      console.log('Received:', data.toString());
    });
  } else {
    console.log('No Arduino found');
  }
});


