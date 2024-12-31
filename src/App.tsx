import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { CircleSpinner } from "react-spinners-kit";
import { Provider } from "./components/ui/provider";
import { Alert } from "@/components/ui/alert";
import { Door } from "./components/door";
import { VoiceButton } from "./components/VoiceButton";
import open from "./audio/open.wav";
import close from "./audio/close.wav";
import skeleton from "./audio/skeleton.wav";
import spider from "./audio/spider.wav";
import villager from "./audio/villager.wav";
import zombie from "./audio/zombie.wav";
import enderman from "./audio/enderman.wav";

const mobSounds = [skeleton, spider, villager, zombie, enderman];

function App() {
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null); // MQTT client
  const [isConnected, setIsConnected] = useState(false); // MQTT connection status
  const [sensorState, setSensorState] = useState<boolean | null>(null);
  const [door, setDoor] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false); // Alert visibility
  const [isSwitchDisabled, setIsSwitchDisabled] = useState<boolean>(false); // Disable switch
  
  const openAudio = new Audio(open);
  const closeAudio = new Audio(close);
  const mqttBroker = import.meta.env.VITE_REACT_MQTT_BROKER || "";
  const mqttUsername = import.meta.env.VITE_REACT_MQTT_USERNAME || "";
  const mqttPassword = import.meta.env.VITE_REACT_MQTT_PASSWORD || "";
  const topicCommand = "door/command";
  const topicSensor = "sensor/status";
  const topicStatus = "door/status";

  // Handle switch toggle
  const handleSwitch = () => {
    if (isSwitchDisabled || !mqttClient) return;

    const newDoorState = !door;
    setDoor(newDoorState);

    // Publish the new door state
    mqttClient.publish(topicCommand, newDoorState ? "open" : "close");
    console.log(`Published door state: ${newDoorState ? "open" : "close"}`);

    // Play the appropriate audio
    if (newDoorState) {
      openAudio.play();
    } else {
      closeAudio.play();
    }

    // Disable the switch for 2.25 seconds
    setIsSwitchDisabled(true);
    setTimeout(() => {
      setIsSwitchDisabled(false);
    }, 2250);
  };

  // Initialize MQTT client
  useEffect(() => {
    const options = {
      clean: true,
      connectTimeout: 4000,
      clientId: `react-${Math.random().toString(16).slice(2)}`,
      username: mqttUsername, // Replace with your HiveMQ username
      password: mqttPassword, // Replace with your HiveMQ password
    };
    const client = mqtt.connect(mqttBroker,options);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);

      // Subscribe to relevant topics
      client.subscribe(topicSensor, (err) => {
        if (err) console.error("Failed to subscribe to sensor topic", err);
      });

      client.subscribe(topicStatus, (err) => {
        if (err) console.error("Failed to subscribe to status topic", err);
      });
    });

    client.on("message", (topic, message) => {
      console.log(`Message received on ${topic}: ${message.toString()}`);
      if (topic === topicSensor) {
        setSensorState(message.toString() === "true");
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    client.on("close", () => {
      console.log("Disconnected from MQTT broker");
      setIsConnected(false);
    });

    setMqttClient(client);

    return () => {
      client.end(); // Disconnect the client when the component unmounts
    };
  }, []);

  // Handle sensor state changes
  useEffect(() => {
    if (sensorState && !door) {
      const randomMobSound = mobSounds[Math.floor(Math.random() * mobSounds.length)];
      const mobAudio = new Audio(randomMobSound);
      mobAudio.play();
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [sensorState]);

  return (
    <Provider>
      {showAlert && (
        <Alert
          status="info"
          className="font-minecraft"
          style={{ position: "fixed", top: "10px", right: "10px", zIndex: 1000 }}
        >
          You cannot rest now; there are monsters nearby
        </Alert>
      )}
      {!isConnected && (
        <Alert
          status="error"
          className="font-minecraft"
          style={{ position: "fixed", top: "10px", left: "10px", zIndex: 1000 }}
        >
          MQTT is not connected
        </Alert>
      )}
      <div className="w-full flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center h-[120px]">
          <p className="text-black font-minecraft font-bold text-3xl">
            {isSwitchDisabled && `Door is ${door ? "opening" : "closing"}...`}
          </p>
          <CircleSpinner size={50} color="black" loading={isSwitchDisabled} />
        </div>
        {isConnected && <Door open={door} handleSwitch={handleSwitch} isSwitchDisabled={isSwitchDisabled} />}
        {isConnected && <VoiceButton handleSwitch={handleSwitch} door={door} />}
      </div>
    </Provider>
  );
}

export default App;
