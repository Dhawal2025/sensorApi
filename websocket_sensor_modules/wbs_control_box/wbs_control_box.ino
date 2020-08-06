#include <WiFi.h>
#include <WebSocketClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 20, 4);
const char* ssid     = "SIH2019 IITH";
const char* password = "11TH@2K19";
char path[] = "/echo?connectionType=sensor";
char host[] = "172.16.168.45";
WebSocketClient webSocketClient;
WiFiClient client;

void setup() {
  Serial.begin(115200);
  delay(10);

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
  } else {
    Serial.println("Handshake failed.");
    while (1) {
      // Hang on failure
    }
  }

}


void loop() {
  String data;
  lcd.init();
  lcd.backlight();
  if (client.connected()) {

    webSocketClient.getData(data);
    if (data.length() > 0) {
      Serial.print("Received data: ");
      Serial.println(data);
    }
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(data);
    if (!root.success()) {
      Serial.println("parseObject() failed");

    }
    const char* sensor = root["sensor"];
    int stat = root["status"];
    int device = root["device"];

    if (device == 1) {

      lcd.setCursor(0, 0);
      lcd.print(sensor);
      lcd.setCursor(0, 1);
      lcd.print(stat);
      if (stat == 1) {
        digitalWrite(32, HIGH);
        Serial.println("32 high");
      }
      else {
        digitalWrite(32, LOW);
        lcd.setCursor(0, 0);
        lcd.print("Everything OK!! ");
        Serial.println("32 low");
      }
      delay(100);
    }
    else if (device == 2) {
      lcd.setCursor(0, 0);
      lcd.print(sensor);
      lcd.setCursor(0, 1);
      lcd.print(stat);
      if (stat == 1) {
        digitalWrite(33, HIGH);
        Serial.println("33 high");
      }
      else {
        digitalWrite(33, LOW);
        lcd.setCursor(0, 0);
        lcd.print("Everything OK!!");
        Serial.println("33 low");
      }
    }
  }
  // capture the value of analog 1, send it along



 else {
  Serial.println("Client disconnected.");
  lcd.setCursor(0, 0);
  lcd.print("Not connected");
}

// wait to fully let the client disconnect
delay(3000);

}
