#include <LiquidCrystal_I2C.h>
int lcdColumns = 16;
int lcdRows = 2;
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows); 
#include "max6675.h"
#include <WiFi.h>
const char* ssid     = "Redmi";
const char* password = "xyz10000";
const char* host = "sensorapiturings.herokuapp.com";


int thermoDO = 19;
int thermoCS = 23;
int thermoCLK = 5;
 
MAX6675 thermocouple(thermoCLK, thermoCS, thermoDO);
 
void setup()
{
 lcd.init();
  // turn on LCD backlight                      
 lcd.backlight();
Serial.begin(115200);
Serial.println("MAX6675 test");
delay(500);
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

}
 
void loop()
{
    //delay(2000);

    Serial.print("connecting to ");
    Serial.println(host);

    // Use WiFiClient class to create TCP connections
    WiFiClient client;
    const int httpPort = 80;
    if (!client.connect(host, httpPort)) {
        Serial.println("connection failed");
        return;
    }


  
// basic readout test, just print the current temp
 
Serial.print("C = ");
float furnaceCel = thermocouple.readCelsius();
Serial.println(furnaceCel);
Serial.print("F = ");
float furnaceFah = thermocouple.readFahrenheit();
Serial.println(furnaceFah);
 String url = "/sendFurnaceTemperature";
    url += "?furnaceCel=";
    url += furnaceCel;
    url += "&furnaceFah=";
    url += furnaceFah;
    Serial.print("Requesting URL: ");
    Serial.println(url);

    // This will send the request to the server
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n\r\n");
    unsigned long timeout = millis();
    while (client.available() == 0) {
        if (millis() - timeout > 5000) {
            Serial.println(">>> Client Timeout !");
            client.stop();
            return;
        }
    }
    while(client.available()) {
        String line = client.readStringUntil('\r');        
        Serial.print(line);
    }

     lcd.setCursor(0, 0);
     lcd.print("Furnace Temp");
     lcd.setCursor(0,1);
     lcd.print("C/");
     lcd.print(furnaceCel);
     lcd.print("  ");
     lcd.print("F/");
     lcd.print(furnaceFah);
delay(1000);
}
