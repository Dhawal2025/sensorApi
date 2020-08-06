#include <WiFi.h>
#include <WebSocketClient.h>
#include <MPU6050_tockn.h>
#include <Wire.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 20, 4);
MPU6050 mpu6050(Wire);
//MPU6050 mpu60502(Wire);
const char* ssid     = "SIH2019 IITH";
const char* password = "11TH@2K19";
char path[] = "/echo?connectionType=sensor";
char host[] = "172.16.168.45";
long timer = 0;
int count = 0;
int stit = 0;
WebSocketClient webSocketClient;
WiFiClient client;

StaticJsonBuffer<200> jsonBuffer;
JsonObject& rt = jsonBuffer.createObject();

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  Wire.begin();
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);
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
  delay(3000);
  // Connect to the websocket server
  lcd.setCursor(0, 0);
  lcd.print("Type= Vibration");
  delay(2000);
  lcd.setCursor(0, 1);
  lcd.print("Sensor Index=1");
  while (stit != 1) {
    if (!client.connect(host, 5000)) {
      Serial.println("Connection failed");
    }
    else {
      Serial.println("Connected.");
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
  mpu6050.update();
  //mpu60502.update();
  String data;
  if (millis() - timer > 50) {




    timer = millis();

    if (client.connected()) {
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& dat = jsonBuffer.createObject();
      if (count < 32) {
        float x = mpu6050.getAccX();
        dat["currentX"] =  x;
        dat["sensorType"] = 3;
        dat["hundredReceived"] = false;
        dat["sensorIndex"] = 1;
        count++;
        Serial.println(count);

      }
      else {
        dat["hundredReceived"] = true;
        dat["sensorType"] = 3;
        dat["sensorIndex"] = 1;
        delay(1000);
        Serial.println("come in");
        count = 0;
      }
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
    }
    // wait to fully let the client disconnect

  }
