import { useEffect, useState } from "react";
import { Provider } from "./components/ui/provider";
import { Alert } from "@/components/ui/alert";
import { Door } from "./components/door";
import { Spinner } from "@chakra-ui/react"
import open from "./audio/open.wav";
import close from "./audio/close.wav";
import skeleton from "./audio/skeleton.wav";
import spider from "./audio/spider.wav";
import villager from "./audio/villager.wav";
import zombie from "./audio/zombie.wav";
import enderman from "./audio/enderman.wav";
import {VoiceButton} from "./components/VoiceButton";

const mobSounds = [
  skeleton,
  spider,
  villager,
  zombie,
  enderman
]

function App() {
  const [ESPIp, setESPIp] = useState<string|null>(null);
  const [sensorState, setSensorState] = useState<boolean | null>(null);
  const [door, setDoor] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null); // Track WebSocket connection
  const [showAlert, setShowAlert] = useState<boolean>(false); // State to manage alert visibility
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false); // Track WebSocket connection status
  const [isSwitchDisabled, setIsSwitchDisabled] = useState<boolean>(false); // State to manage switch disable
  const openAudio = new Audio(open);
  const closeAudio = new Audio(close);

  // Function to send the door state over WebSocket
  const sendDoorState = (doorState: boolean) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(doorState ? "open" : "close");
      console.log(`Sent door state: ${doorState ? "open" : "close"}`);
    } else {
      console.error("WebSocket is not open, cannot send door state");
    }
  };

  // Handle switch toggle
  function handleSwitch() {
    if (isSwitchDisabled) return; // Prevent switching if disabled

    const newDoorState = !door;
    setDoor(newDoorState);

    // Play the appropriate audio based on door state
    if (newDoorState) {
      openAudio.play();
      console.log("open");
    } else {
      closeAudio.play();
      console.log("close");
    }

    // Send the new door state to the ESP via WebSocket
    sendDoorState(newDoorState);

    // Disable the switch for 2 seconds
    setIsSwitchDisabled(true);
    setTimeout(() => {
      setIsSwitchDisabled(false);
    }, 2250);
  }

  useEffect(() => {
    // Try to connect to the WebSocket server
    if(ESPIp) {
      const socketConnection = new WebSocket(ESPIp+"/ws"); // Create a new WebSocket connection
      setSocket(socketConnection); // Store the WebSocket connection

      socketConnection.onopen = () => {
        console.log("WebSocket connection established");
        setIsSocketConnected(true); // Set connection status to true
        socketConnection.send("Hello from the React client!");
      };

      socketConnection.onmessage = (event) => {
        console.log("Message from server:", event.data);
        if (event.data === "true" || event.data === "false") {
          const newSensorState = event.data === "true";
          setSensorState(newSensorState);
        }
      };

      socketConnection.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socketConnection.onclose = () => {
        console.log("WebSocket connection closed");
        setIsSocketConnected(false); // Set connection status to false
      };

      // Clean up the socket connection when the component unmounts
      return () => {
        if (socketConnection.readyState === WebSocket.OPEN) {
          socketConnection.close();
        }
      };
    }
  }, [ESPIp]);

  useEffect(() => {
    if (sensorState && !door) {
      const randomMobSound = mobSounds[Math.floor(Math.random() * mobSounds.length)];
      const mobAudio = new Audio(randomMobSound);
      mobAudio.play();
      setShowAlert(true);
    }
    else {
      setShowAlert(false);
    }
  }, [sensorState]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setESPIp("ws://" + (event.target as HTMLInputElement).value);
    }
  };

  return (
    <Provider>
      {showAlert && (
      <Alert status="info" className="font-minecraft" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
        You cannot rest now; there are monsters nearby
      </Alert>
      )}
      {!isSocketConnected && (
      <Alert status="error" className="font-minecraft" style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}>
        Socket is not connected
      </Alert>
      )}
      <div className="w-full flex flex-col items-center justify-center h-screen">
      {!isSocketConnected && <Door open={door} handleSwitch={handleSwitch} isSwitchDisabled={isSwitchDisabled} />}
      {!ESPIp &&
      <div className="flex flex-col items-center">
        <input
          type="text"
          className="rounded-md border border-gray-300 p-2"
          placeholder="ESP8266 IP Address"
          onKeyPress={handleKeyPress}
        />
        <button onClick={() => setESPIp("ws://" + (document.querySelector("input") as HTMLInputElement).value)} className="mt-4 bg-blue-500 text-white p-2 rounded-md">Connect</button>
        {<VoiceButton handleSwitch={handleSwitch} door={door}/>}
      </div>
      }
      </div>
      
    </Provider>
  );
}

export default App;
