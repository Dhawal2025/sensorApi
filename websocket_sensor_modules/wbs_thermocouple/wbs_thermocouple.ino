#include <WiFi.h>
#include <WebSocketClient.h>
#include <max6675.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display0

const char* ssid     = "SIH2019 IITH";
const char* password = "11TH@2K19";
char path[] = "/echo?connectionType=sensor";
char host[] = "172.16.168.45";
int stit = 0;
float temp;
int thermoDO = 19;
int thermoCS = 23;
int thermoCLK = 5;
WebSocketClient webSocketClient;
MAX6675 thermocouple(thermoCLK, thermoCS, thermoDO);
// Use WiFiClient class to create TCP connections
WiFiClient client;

StaticJsonBuffer<200> jsonBuffer;
JsonObject& rt = jsonBuffer.createObject();

void setup() {
  lcd.init();
  lcd.backlight();
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


  lcd.setCursor(0, 0);
  lcd.print("Type= Furnace Temp");
  lcd.setCursor(0, 1);
  lcd.print("Sensor Index= 1");
  while (stit != 1) {
    if (!client.connect(host, 5000)) {
      Serial.println("Connection failed");
    }
    else {
      Serial.println("Connected.");
      temp = thermocouple.readCelsius();;
      Serial.println(temp);
      delay(1000);
      lcd.setCursor(0, 2);
      lcd.print("Temp=");
      lcd.print(temp);
      lcd.print(" C");
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
  delay(1000);
   temp = thermocouple.readCelsius();
  Serial.println(temp);
  lcd.setCursor(0, 2);
  lcd.print("temp=");
  lcd.print(temp);
  lcd.print(" C");
  
  
  if (client.connected()) {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& dat = jsonBuffer.createObject();
    
    dat["currentTemperature"] =  temp;
    dat["sensorType"] = 2;
    dat["sensorIndex"] = 1;
    dat.printTo(data);
    dat.printTo(Serial);
    webSocketClient.sendData(data);
    //delay(2000);


  }
  else {

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
  // wait to fully let the client disconnect
  delay(3000);
}
