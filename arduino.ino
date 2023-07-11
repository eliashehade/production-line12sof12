
#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

int duration;

const char* ssid = "quiet";                   //replace with your wifi ssid 
const char* password = "123456789";           // replace with your wifi pass
String serverUrl = "ipaddress";  // replace you api server url

const int relayPin = d;
const int lampPin = d;

void setup() {
  pinMode(relayPin, OUTPUT);
  pinMode(lampPin, OUTPUT);

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


void activHeat() {
  int lightIntensity = analogRead(lampPin);
  int pwmValue = map(lightIntensity, 0, 1023, 0, 255);

  digitalWrite(relayPin, pwmValue);
  // analogWrite(lampPin, 255); // Set maximum brightness

}

void deacteHeat() {
  digitalWrite(relayPin, LOW);
  digitalWrite(lampPin, 0); // Turn off the lamp
}
