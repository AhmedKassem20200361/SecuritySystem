import { useEffect, useState } from "react";
import { Provider } from "./components/ui/provider";
import { Alert } from "@/components/ui/alert";
import { Door } from "./components/door";
import open from "./audio/open.wav";
import close from "./audio/close.wav";
import skeleton from "./audio/skeleton.wav";
import spider from "./audio/spider.wav";
import villager from "./audio/villager.wav";
import zombie from "./audio/zombie.wav";
import enderman from "./audio/enderman.wav";

const mobSounds = [
  skeleton,
  spider,
  villager,
  zombie,
  enderman
]

function App() {
  const [sensorState, setSensorState] = useState<boolean | null>(null);
  const [door, setDoor] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null); // Track WebSocket connection
  const [showAlert, setShowAlert] = useState<boolean>(false); // State to manage alert visibility
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false); // Track WebSocket connection status
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
  }

  useEffect(() => {
    // Try to connect to the WebSocket server
    const socketConnection = new WebSocket("ws://192.168.173.189/ws");
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
        setShowAlert(newSensorState); // Show alert if sensor state is true
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
  }, []);

  useEffect(() => {
    if (sensorState) {
      const randomMobSound = mobSounds[Math.floor(Math.random() * mobSounds.length)];
      const mobAudio = new Audio(randomMobSound);
      mobAudio.play();
    }
  }, [sensorState]);

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
      {isSocketConnected && <Door open={door} handleSwitch={handleSwitch}/>}
      </div>
    </Provider>
  );
}

export default App;
