#include <WiFi.h>
#include <WebSocketClient.h>
#include "DHTesp.h"
#include <ArduinoJson.h>

const char* ssid     = "SIH2019 IITH";
const char* password = "11TH@2K19";
char path[] = "/echo?connectionType=sensor";
char host[] = "172.16.166.209";


#define DHTpin 15
WebSocketClient webSocketClient;
DHTesp dht;
// Use WiFiClient class to create TCP connections
WiFiClient client;

StaticJsonBuffer<200> jsonBuffer;
JsonObject& rt = jsonBuffer.createObject();

void setup() {
  Serial.begin(115200);
  delay(10);
  dht.setup(DHTpin, DHTesp::DHT11);

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
    dat["currentAirTemperature"] =  dht.getTemperature
    dat["currentHumidity"] = dht.getHumidity();
    dat["sensorType"] = 5;
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
