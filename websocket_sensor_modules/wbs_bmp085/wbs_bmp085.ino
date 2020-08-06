#include <Adafruit_BMP085.h>
#include <WiFi.h>
Adafruit_BMP085 bmp;
#include <WebSocketClient.h>

#include <ArduinoJson.h>

const char* ssid     = "SIH2019 IITH";
const char* password = "11TH@2K19";
char path[] = "/echo?connectionType=sensor";
char host[] = "172.16.166.209";
//int st = 0;


WebSocketClient webSocketClient;

// Use WiFiClient class to create TCP connections
WiFiClient client;

StaticJsonBuffer<200> jsonBuffer;
JsonObject& rt = jsonBuffer.createObject();
float ti=1000;

void setup() {
  Serial.begin(115200);
  delay(10);
  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP085/BMP180 sensor, check wiring!");
    while (1) {}
  }

  // We start by connecting to a WiFi network

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
  if (client.connect(host, 5000)) {
    Serial.println("Connected");
  } else {
    Serial.println("Connection failed.");
    while (1) {
      // Hang on failure
    }
  }
  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  }
  else {
    Serial.println("Handshake failed.");
    delay(4000);
    ESP.restart();
  }
}


void loop() {
  String data;

  if (client.connected()) {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& dat = jsonBuffer.createObject();
    dat["currentPressure"] =  bmp.readPressure();
    dat["sensorType"] = 1;
    dat["sensorIndex"] = 1;
    dat.printTo(data);
    dat.printTo(Serial);
    webSocketClient.sendData(data);
    delay(10);
  }
  else {

    Serial.println("Client disconnected.");
    while (1) {
      // Hang on disconnect.
      delay(4000);
      ESP.restart();
    }
  }
  // wait to fully let the client disconnect
  delay(3000);
}
