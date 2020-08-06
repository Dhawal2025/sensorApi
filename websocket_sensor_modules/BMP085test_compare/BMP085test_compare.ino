#include <Wire.h>
#include <Adafruit_BMP085.h>
#include <WiFi.h>
#include <WebSocketClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display0
/***************************************************
  This is an example for the BMP085 Barometric Pressure & Temp Sensor

  Designed specifically to work with the Adafruit BMP085 Breakout
  ----> https://www.adafruit.com/products/391

  These displays use I2C to communicate, 2 pins are required to
  interface
  Adafruit invests time and resources providing this open source code,
  please support Adafruit and open-source hardware by purchasing
  products from Adafruit!

  Written by Limor Fried/Ladyada for Adafruit Industries.
  BSD license, all text above must be included in any redistribution
 ****************************************************/

// Connect VCC of the BMP085 sensor to 3.3V (NOT 5.0V!)
// Connect GND to Ground
// Connect SCL to i2c clock - on '168/'328 Arduino Uno/Duemilanove/etc thats Analog 5
// Connect SDA to i2c data - on '168/'328 Arduino Uno/Duemilanove/etc thats Analog 4
// EOC is not used, it signifies an end of conversion
// XCLR is a reset pin, also not used here
const char* ssid     = "SIH2019 IITH";
const char* password = "11TH@2K19";
char path[] = "/echo?connectionType=sensor";
char host[] = "172.16.168.45";

Adafruit_BMP085 bmp1;
Adafruit_BMP085 bmp2;

long timer = 0;
int count = 0;
int stit = 0;
WebSocketClient webSocketClient;
WiFiClient client;
float pr1, pr2;
StaticJsonBuffer<200> jsonBuffer;
JsonObject& rt = jsonBuffer.createObject();
void setup() {
  delay(1000);
  lcd.init();
  lcd.backlight();
  Serial.begin(115200);
  if (!bmp1.begin()) {
    Serial.println("Could not find a valid BMP085 sensor, check wiring!");
    while (1) {}
  }
  if (!bmp2.begin()) {
    Serial.println("Could not find a valid BMP085 sensor, check wiring!");
    while (1) {}
  }
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  delay(5000);
  // Connect to the websocket server

  lcd.setCursor(0, 0);
  lcd.print("Type= Pressure");
  lcd.setCursor(0, 1);
  lcd.print("Sensor Index= 1");

  while (stit != 1) {
    if (!client.connect(host, 5000)) {
      Serial.println("Connection failed");
    }
    else {
      Serial.println("Connected.");
      delay(1000);
      pr1 = bmp1.readPressure();
      lcd.setCursor(0, 2);
      lcd.print("Pressure=");
      lcd.print(pr1);
 
      Serial.print("Pressure1 = ");
      Serial.print(pr1);
      Serial.println(" Pa");
      webSocketClient.path = path;
      webSocketClient.host = host;

      if (!webSocketClient.handshake(client)) {
        Serial.println("Handshake failed");

      }
      else {
        stit = 1;
      }
      // Hang on failure
    }
  }

}

void loop() {
  String data;
  //    Serial.print("Temperature = ");
  //    Serial.print(bmp.readTemperature());
  //    Serial.println(" *C");
  //
  pr1 = bmp1.readPressure() ;
  lcd.setCursor(0, 2);
  lcd.print("Pressure=");
  lcd.print(pr1);
  pr2 = bmp2.readPressure() ;
  Serial.print("Pressure1= ");
  Serial.print(pr1);
  Serial.println(" Pa");

  Serial.print("Pressure2 = ");
  Serial.print(pr2);
  Serial.println(" Pa");

  if (client.connected()) {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& dat = jsonBuffer.createObject();

    dat["currentPressure"] = pr1;


    dat["currentPressureComparer"] = pr2 ;
    dat["sensorType"] = 1;
    dat["sensorIndex"] = 1;

    dat.printTo(data);
    dat.printTo(Serial);
    webSocketClient.sendData(data);
  }
  else {

    Serial.println("Client disconnected.");
    Serial.println("Client disconnected.");
    if (client.connect(host, 5000)) {
      Serial.println("Connected");

    } else {
      Serial.println("Connection failed.");

    }
    // Handshake with the server
    webSocketClient.path = path;
    webSocketClient.host = host;
    if (webSocketClient.handshake(client)) {
      Serial.println("Handshake successful");
    }
    else {
      Serial.println("Handshake Failed.");
    }
  }
  //    Serial.println();
  delay(500);
}
