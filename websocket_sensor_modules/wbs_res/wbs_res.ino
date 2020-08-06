
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
//#include <ESPmDNS.h>
LiquidCrystal_I2C lcd(0x27, 20, 4);
// Constants
const char* ssid = "SIH2019 IITH";
const char* password = "11TH@2K19";
//char path[] = "/echo?connectionType=alarm";
//char host[] = "172.16.168.29";
// Globals
WebSocketsServer webSocket = WebSocketsServer(80);
const char* sensor ;
int statit ;
int device;
int prev_statit = 0, prev_statit_r = 0;
void onWebSocketEvent(uint8_t num,
                      WStype_t type,
                      uint8_t * payload,
                      size_t length) {
  String str;

  // Figure out the type of WebSocket event


  // Client has disconnected
  if (type == WStype_DISCONNECTED) {
    Serial.printf("[%u] Disconnected!\n", num);
  }

  // New client has connected
  if (type == WStype_CONNECTED)
  {
    IPAddress ip = webSocket.remoteIP(num);
    Serial.printf("[%u] Connection from ", num);
    Serial.println(ip.toString());
  }


  // Echo text message back to client
  if (type == WStype_TEXT)
  {
    Serial.printf("[%u] Text: %s\n", num, payload);

    str = (char*)payload;
    Serial.println(str);
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(str);
    if (!root.success()) {
      Serial.println("parseObject() failed");

    }
    sensor = root["sensor"];
    statit = root["status"];
    device = root["device"];
    
    if (device == 1) {



      if (prev_statit == 0 && statit == 1 ) {
        digitalWrite(32, HIGH);
      
        Serial.println("32 HIGH");
        prev_statit = statit;
      }
      else if (prev_statit == 1 && statit == 0) {
        digitalWrite(32, LOW);
        Serial.println("32 LOW");
        prev_statit = statit;
      }
      delay(100);
    }
    else if (device == 2) {
      if (prev_statit_r == 0 && statit == 1 ) {
        digitalWrite(33, HIGH);
        Serial.println("33 HIGH");
        prev_statit_r = statit;
      }
      else if (prev_statit_r == 1 && statit == 0) {
        digitalWrite(33, LOW);
        Serial.println("33 LOW");
        prev_statit_r = statit;
      }
    }
    else {}


    //     For everything else: do nothing
    //  case WStype_BIN:
    //  case WStype_ERROR:
    //  case WStype_FRAGMENT_TEXT_START:
    //  case WStype_FRAGMENT_BIN_START:
    //  case WStype_FRAGMENT:
    //  case WStype_FRAGMENT_FIN:
    //

  }
}
void setup() {

  // Start Serial port
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  pinMode(32, OUTPUT);
  pinMode(33, OUTPUT);
  digitalWrite(32,LOW);
  digitalWrite(33,LOW);
  // Connect to access point
  Serial.println("Connecting");
  WiFi.begin(ssid, password);
  while ( WiFi.status() != WL_CONNECTED ) {
    delay(500);
    Serial.print(".");
  }

  // Print our IP address
  Serial.println("Connected!");
  Serial.print("My IP address: ");
  Serial.println(WiFi.localIP());
  lcd.setCursor(0,2);
  lcd.print(WiFi.localIP());
//  if (!MDNS.begin("esp32")) {
//        Serial.println("Error setting up MDNS responder!");
//        while(1) {
//            delay(1000);
//        }
//    }
//    Serial.println("mDNS responder started");
//
//    // Start TCP (HTTP) server
    webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);

//    Serial.println("TCP server started");
//
//    // Add service to MDNS-SD
//    MDNS.addService("http", "tcp", 80);
 
  // Start WebSocket server and assign callback

}

void loop() {
       lcd.setCursor(0, 0);
    lcd.print("Alarm is ");
    if(prev_statit == 1){
    lcd.print("ON "); 
    }
    else if (prev_statit == 0){
      lcd.print("OFF");}
    lcd.setCursor(0, 1);
    lcd.print("Exha. is ");
    if(prev_statit_r == 1){
    lcd.print("ON "); 
    }
    else if (prev_statit_r == 0){
      lcd.print("OFF");}

  // Look for and handle WebSocket data
  webSocket.loop();
}
