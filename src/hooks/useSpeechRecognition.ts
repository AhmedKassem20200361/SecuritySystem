import { useEffect, useState } from "react";
let recognition:any = null;
if("webkitSpeechRecognition" in window){
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
}

export const useSpeechRecognition = () => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);
  
    useEffect(() => {
      if (!recognition) return;
  
      // Handle the results of speech recognition
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results) // Convert to array
          .map(result => result[0].transcript) // Get transcript from each result
          .join(" "); // Join all parts
  
        setText(transcript); // Update the text state
        recognition.stop(); // Stop recognition
        setIsListening(false);
      };
  
      // Handle errors or stopping
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
  
    }, []);
  
    const startListening = () => {
      setText(""); // Clear the text before starting
      setIsListening(true);
      recognition.start(); // Start speech recognition
    };
  
    const stopListening = () => {
      setIsListening(false);
      recognition.stop(); // Stop speech recognition
    };
  
    return {
      text,
      isListening,
      startListening,
      stopListening,
      hasRecognitionSupport: !!recognition,
    };
  };
  