// C++ code

#include <Servo.h>

const int analogPin = A0;    // analog input pin
const int threshold = 512;   // threshold value
const int servoPin = 9;      // servo control pin
const int redLedPin = 10;    // red LED pin
const int greenLedPin = 11;  // green LED pin

Servo myservo;               // create servo object to control a servo
boolean servoRunning = false; // flag to keep track of servo state
boolean enemyDetected = false; // flag to keep track of enemy detection
unsigned long ledTimer = 0; // timer to keep track of LED duration

void setup() {
  Serial.begin(9600);        // initialize serial communication
  myservo.attach(servoPin);  // attaches the servo on pin 9 to the servo object
  pinMode(redLedPin, OUTPUT);   // set red LED pin as output
  pinMode(greenLedPin, OUTPUT); // set green LED pin as output
}

void loop() {
  int analogValue = analogRead(analogPin);  // read the analog input value
  Serial.println(analogValue);              // print the value to serial monitor
  
  if(Serial.available()) {
    String label = Serial.readString();
    
    if(label == "friend") {
      digitalWrite(greenLedPin, HIGH);
      ledTimer = millis();
    } else if(label == "enemy") {
      enemyDetected = true;
      digitalWrite(redLedPin, HIGH);
      ledTimer = millis();
    }
  }
  
  if(enemyDetected) {
    if(!servoRunning) {
      myservo.write(200);   // move the servo to 90 degrees
      delay(1000);          // wait for the servo to reach the position
      servoRunning = true;
    }
    
    if(millis() - ledTimer >= 5000) { // turn off LED after 5 seconds
      digitalWrite(redLedPin, LOW);
      enemyDetected = false;
      servoRunning = false;
      myservo.write(0); // move the servo back to 0 degrees
    }
  } else {
    digitalWrite(greenLedPin, LOW);
  }
}
