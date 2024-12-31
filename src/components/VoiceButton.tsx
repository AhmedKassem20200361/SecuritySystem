import { useEffect } from "react";
import {useSpeechRecognition} from "../hooks/useSpeechRecognition"
import Mic from "../img/microphone-black-shape.png"

interface VoiceButtonProps{
    handleSwitch: () => void;
    door:boolean;
    
}
export const VoiceButton = ({handleSwitch,door}:VoiceButtonProps) => {
    const { text, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();
    useEffect(()=>{
        if(text.toLowerCase().includes("open")&&!door) handleSwitch();
        if(text.toLowerCase().includes("close")&&door) handleSwitch();

    },
[text]
)
  
    return (
      <div className="font-minecraft flex items-center justify-center flex-col">
        {hasRecognitionSupport ? (
          <>
            <button
              onClick={isListening?stopListening:startListening}
              className="mt-4 bg-planks text-white p-2 w-16 h-16 rounded-full"
              
            >
                <img src={Mic} className="opacity-65"></img>
            </button>
          </>
        ) : (
          <p>Your browser does not support Voice recognition.</p>
        )}
        {isListening && <p>Your mic is currently listening...</p>}
        {text && <p className="bg-planks rounded-md px-2 mt-2 text-center text-black text-opacity-75">{text}</p>}
      </div>
    );
  };
  