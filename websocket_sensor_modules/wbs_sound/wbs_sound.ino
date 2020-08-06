#include <WiFi.h>
#include <WebSocketClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display0

const char* ssid     = "SIH2019 IITH";
const char* password = "11TH@2K19";
char path[] = "/echo?connectionType=sensor";
char host[] = "172.16.168.45";


int soundPin = 32;
float sound;
WebSocketClient webSocketClient;

// Use WiFiClient class to create TCP connections
WiFiClient client;

StaticJsonBuffer<200> jsonBuffer;
JsonObject& rt = jsonBuffer.createObject();

void setup() {
  analogReadResolution(10);
  delay(1000);
  lcd.init();
  lcd.backlight();
  Serial.begin(115200);
  delay(10);
  float sound1;
    lcd.setCursor(0,0 );
  lcd.print("Sensor=");
  lcd.print("Sound");
  lcd.setCursor(0,1);
  lcd.print("Sensor Index=1");
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
  if (!client.connect(host, 5000)) {
    Serial.println("Connection failed");
     while (1) {
      // Hang on failure
       sound1 = analogRead(soundPin);
       float db = (sound1+83.2073) / 11.003;
  Serial.println(db);
  lcd.setCursor(0, 2);
  lcd.print("Sound=");
  lcd.print(db);
  lcd.print(" db");
    }
  } else {
    Serial.println("Connected.");
 
  }
  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;
  while(!webSocketClient.handshake(client)) {
    Serial.println("Handshake failed");
  delay(500);
  sound1 = analogRead(soundPin);
  float db = (sound1+83.2073) / 11.003;
  Serial.println(db);
  lcd.setCursor(0, 2);
  lcd.print("Sound=");
  lcd.print(db);
  lcd.print(" db");
  delay(100);
  }
  
    Serial.println("Handshake successful.");
    delay(4000);
  //  ESP.restart();
  
 
}


void loop() {
  String data;
  float sound = analogRead(soundPin);
  float db = (sound+83.2073) / 11.003;
  delay(500);
  Serial.println(db);
  lcd.setCursor(0, 2);
  lcd.print("Sound=");
  lcd.print(db);
  lcd.print(" db");
  if (client.connected()) {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& dat = jsonBuffer.createObject();

    dat["currentSound"] =  db;
    dat["sensorType"] = 4;
    dat["sensorIndex"] = 1;
    dat.printTo(data);
    dat.printTo(Serial);
    webSocketClient.sendData(data);
    delay(10);

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
  if(webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  }
  else{
    Serial.println("Handshake Failed.");
  }
  }
  // wait to fully let the client disconnect
  delay(3000);
}
