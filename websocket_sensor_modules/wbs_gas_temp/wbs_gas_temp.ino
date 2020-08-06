
#include <TroykaMQ.h>
#include "DHTesp.h"
#include <WiFi.h>
#include <WebSocketClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,20,4);  

#define PIN_MQ6  34
#define PIN_MQ135 36 
#define PIN_MQ2  39
const char* ssid     = "SIH2019 IITH";
const char* password = "11TH@2K19";
char path[] = "/echo?connectionType=sensor";
char host[] = "172.16.168.45";
WebSocketClient webSocketClient;
WiFiClient client;

StaticJsonBuffer<200> jsonBuffer;
JsonObject& rt = jsonBuffer.createObject();
// создаём объект для работы с датчиком и передаём ему номер пина
MQ135 mq135(PIN_MQ135);
MQ6 mq6(PIN_MQ6);
MQ2 mq2(PIN_MQ2);

#define DHTpin 23
DHTesp dht;
int stit=0;
void setup(){
  analogReadResolution(10);
  
  Serial.begin(115200);
  
  mq6.calibrate();
  mq135.calibrate();
  mq2.calibrate();
  
  Serial.print("Ro mq6= ");
  Serial.println(mq6.getRo());
  Serial.print("Ro mq2= ");
  Serial.println(mq2.getRo());
  Serial.print("Ro mq135= ");
  Serial.println(mq135.getRo());
  dht.setup(DHTpin, DHTesp::DHT11); //for DHT11 Connect DHT sensor to GPIO 17

  lcd.init();
  lcd.backlight();

  delay(10);
  float co2;

  

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

  lcd.setCursor(0, 0);
  lcd.print("Type= Air Quality");
  lcd.setCursor(0, 1);
  lcd.print("Air quality= 1");
  delay(100);
  // Connect to the websocket server
  while (stit !=1) {
    if (!client.connect(host, 5000)) {
      Serial.println("Connection failed");
    }  
    else {
      Serial.println("Connected.");
      delay(100);
      co2 = mq6.readLPG();
      Serial.println(co2);
      lcd.setCursor(0, 2);
      lcd.print("lpg=");
      lcd.print(co2);

      webSocketClient.path = path;
      webSocketClient.host = host;

      if (!webSocketClient.handshake(client)) {
        Serial.println("Handshake failed");
       
      }
      else{
        stit =1;
      }
      // Hang on failure
    }
  }
  // Handshake with the server


  Serial.println("Handshake successful.");
  delay(4000);


  }


void loop()
{ String data;
  
  Serial.print("Ratio  mq6: ");
  Serial.print(mq6.readRatio());
  Serial.print("Ratio  mq2: ");
  Serial.print(mq2.readRatio());
  Serial.print("Ratio  mq135: ");
  Serial.print(mq135.readRatio());
  // выводим значения газов в ppm
  Serial.print(" LPG: ");
  float lpg = mq6.readLPG();
  Serial.print(lpg);
  Serial.println(" ppm ");
  delay(100);
  Serial.print("CO2");
  float co2 = mq6.readLPG();
  Serial.print(co2);
  Serial.println(" ppm");
  lcd.setCursor(0, 2);
  lcd.print("lpg=");
  lcd.print(co2);
  lcd.print("ppm");
  delay(100);
  Serial.print("Methane: ");
  float meth = mq2.readMethane();
  Serial.print(meth);
  Serial.println(" ppm");
  Serial.print("Smoke: ");
  float smoke = mq2.readSmoke();
  Serial.print(smoke);
  Serial.println(" ppm");
  Serial.print("Hydrogen: ");
  float hydr = mq2.readHydrogen();
  Serial.print(hydr);
  Serial.println(" ppm");
  Serial.print("Temperature=");
  float temp = dht.getTemperature();
  Serial.println(temp);
  Serial.print("Humidity");
  float hum = dht.getHumidity();
  Serial.println(hum);
  if (client.connected()) {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& dat = jsonBuffer.createObject();


    dat["currentAirTemperature"] =  temp;
    dat["currentHumidity"] =  hum;
    dat["currentCO2"] =  co2;
    dat["currentLPG"] =  lpg;
    dat["currentSmoke"] =  smoke;
    dat["currentMethane"] =  meth;
    dat["currentHydrogen"] =  hydr;
    dat["sensorType"] = 5;
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
