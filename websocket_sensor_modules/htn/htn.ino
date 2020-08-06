/**
   BasicHTTPClient.ino

    Created on: 24.05.2015

*/



#include <WiFi.h>
#include <WiFiMulti.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WebSocketClient.h>
#include <max6675.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#define USE_SERIAL Serial
LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line dis
WiFiMulti wifiMulti;

int st=0,prev=0;
//SSID and Password to your ESP Access Point

float temp;
int thermoDO = 19;
int thermoCS = 23;
int thermoCLK = 5;
//WebSocketClient webSocketClient;
MAX6675 thermocouple(thermoCLK, thermoCS, thermoDO);

// Use WiFiClient class to create TCP connections
WiFiClient client;

//StaticJsonBuffer<200> jsonBuffer;
//JsonObject& rt = jsonBuffer.createObject();
void setup() {

  Serial.begin(115200);

  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println("ESP node");
//  lcd.setCursor(0, 0);
//  lcd.print("Node-2-Node");
//  lcd.setCursor(0, 3);
//  lcd.print("Limit: 70 C");

  wifiMulti.addAP("ESPWebServer", "12345678");




  while (wifiMulti.run() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  delay(5000);
  // Connect to the websocket server





}

void loop() {
  // wait for WiFi connection
  temp = thermocouple.readCelsius();
  Serial.println(temp);
  if (temp > 70 ) {
//    lcd.setCursor(0, 1);
//    lcd.print(temp);
//    lcd.setCursor(0, 2);
//    lcd.print("Critical");
    if ((wifiMulti.run() == WL_CONNECTED)) {

      HTTPClient http;

      Serial.print("[HTTP] begin...\n");
      // configure traged server and url
      //http.begin("https://www.howsmyssl.com/a/check", ca); //HTTPS
      http.begin("http://192.168.4.1:80/"); //HTTP

      Serial.print("[HTTP] GET...\n");
      // start connection and send HTTP header
      int httpCode = http.GET();

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK) {
          String payload = http.getString();
          Serial.println(payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }

      http.end();
    }

  }
  else{
    if ((wifiMulti.run() == WL_CONNECTED)) {

      HTTPClient http;

      Serial.print("[HTTP] begin...\n");
      // configure traged server and url
      //http.begin("https://www.howsmyssl.com/a/check", ca); //HTTPS
      http.begin("http://192.168.4.1:80/ht"); //HTTP

      Serial.print("[HTTP] GET...\n");
      // start connection and send HTTP header
      int httpCode = http.GET();

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK) {
          String payload = http.getString();
          Serial.println(payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }

      http.end();
    }
  }
//  else {
//    String data;
//    StaticJsonBuffer<200> jsonBuffer;
//    JsonObject& dat = jsonBuffer.createObject();
////    lcd.setCursor(0, 1);
////    lcd.print(temp);
////    lcd.setCursor(0, 2);
////    lcd.print("Everything Ok!!");
//
//    dat["currentTemperature"] =  temp;
//    dat["sensorType"] = 2;
//    dat["sensorIndex"] = 1;
//    dat.printTo(data);
//    dat.printTo(Serial);
//    webSocketClient.sendData(data);
//  }
  delay(5000);
}
