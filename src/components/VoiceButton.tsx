import { useEffect } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import Mic from "../img/microphone-black-shape.png";

interface VoiceButtonProps {
  handleSwitch: () => void;
  door: boolean;
}

export const VoiceButton = ({ handleSwitch, door }: VoiceButtonProps) => {
  const { text, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();

  useEffect(() => {
    if (text.toLowerCase().includes("open") && !door) handleSwitch();
    if (text.toLowerCase().includes("close") && door) handleSwitch();
  }, [text]);

  return (
    <div className="font-minecraft flex items-center justify-center flex-col">
      {hasRecognitionSupport ? (
        <>
            <div
              className="flex items-center justify-center flex-col w-16 h-16"
              style={{
                transform: isListening ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.3s",
              }}
            >
              <button
                onClick={isListening ? stopListening : startListening}
                className="bg-planks text-white p-2 rounded-full w-full h-full"
              >
                <div
                  style={{
                    backgroundImage: `url(${Mic})`,
                    backgroundBlendMode: "normal",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated",
                  }}
                  className="w-full h-full"
                />
              </button>
            </div>


        </>
      ) : (
        <p>Your browser does not support Voice recognition.</p>
      )}
      <div className="mt-4 h-8 text-2xl">
      {isListening && <p>Your mic is currently listening...</p>}
      {text && <p className="bg-planks rounded-md px-2 mt-2 text-center text-[#282219]">{text}</p>}
      </div>
    </div>
  );
};
