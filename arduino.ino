

#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

int duration;

const char* ssid = "wifiname";                   //replace with your wifi ssid 
const char* password = "passwodwifi";           // replace with your wifi pass
String serverUrl = "ipaddress";  // replace you api server url

const int relay = 2;
const int sensor = 9;

void setup() {
  pinMode(relay, OUTPUT);
  pinMode(sensor, OUTPUT);

  Serial.begin(9600);

  connectToWiFi();
}

void loop() {
  int duration = fetchDurationFromServer();

  if (duration > 2) {
    activateHeating();
    delay(duration * 1000);
    deactivateHeating();
    delay(2000);
  }
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected to WiFi");
}

int fetchDurationFromServer() {

  long rnd = random(1, 10);
  HTTPClient client;
  client.begin(serverUrl + String(rnd));
  
  // Send HTTP GET request
  int httpCode = client.GET();

  if (httpCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(String(httpCode));
    String payload = client.getString();
    Serial.println(payload);
    
    


    char json[500];
    payload.replace(" ", "");
    payload.replace("\n", "");
    payload.trim();
    payload.toCharArray(json, 500);


    StaticJsonDocument<200> doc;
    deserializeJson(doc, json);
    duration = doc["duration"];

    Serial.println(duration);
    
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpCode);
  }
  // Free resources
  client.end();

  return duration;

  
}


void activ() {
  int lightIntensity = analogRead(sensor);
  int pwmValue = map(lightIntensity, 0, 1023, 0, 255);

  digitalWrite(relayPin, pwmValue);
  // analogWrite(lampPin, 255); // Set maximum brightness

}

void deactiv() {
  digitalWrite(relay, LOW);
  digitalWrite(sensor, 0); // Turn off the lamp
}
