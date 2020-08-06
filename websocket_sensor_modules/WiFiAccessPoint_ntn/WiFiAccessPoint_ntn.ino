/*
   Hello world web server
   circuits4you.com
*/
#include <WiFi.h>
//#include <WiFiClient.h>
#include <WebServer.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>

WiFiMulti wifiMulti;

//SSID and Password to your ESP Access Point
const char* ssid = "ESPWebServer";
const char* password = "12345678";
//WebSocketClient webSocketClient;

WebServer server(80); //Server on port 80
WiFiClient client;
// it wil set the static IP address to 192, 168, 1, 184

//==============================================================
//     This rutine is exicuted when you open its IP in browser
//==============================================================
void handleRoot() {
  server.send(200, "text/plain", "critical");
  digitalWrite(LED_BUILTIN, LOW);
  digitalWrite(5,HIGH);
}

void handleht() {
  server.send(200, "text/plain", "evvok");
  digitalWrite(LED_BUILTIN, HIGH);
  digitalWrite(5,LOW);
}

//===============================================================
//                  SETUP
//===============================================================
void setup(void) {
  Serial.begin(115200);
  float temp;
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(5,OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  digitalWrite(5,LOW);
  Serial.println("");
  WiFi.mode(WIFI_AP_STA);           //Only Access point
  delay(1000);

  WiFi.softAP(ssid, password);  //Start HOTspot removing password will disable security

  IPAddress myIP = WiFi.softAPIP(); //Get IP address
  Serial.print("HotSpt IP:");
  Serial.println(myIP);

  server.on("/", handleRoot);      //Which routine to handle at root location
  server.on("/ht",handleht);
  server.begin();                  //Start server
  Serial.println("HTTP server started");

  // We start by connecting to a WiFi network
  

  


}
//===============================================================
//                     LOOP
//===============================================================
void loop() {
  server.handleClient();          //Handle client requests
  

}
