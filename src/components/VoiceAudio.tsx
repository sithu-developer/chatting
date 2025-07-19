
import { useEffect, useRef, useState } from "react";

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // request permission from chrome
    const mediaRecorder = new MediaRecorder(stream);  // get permission or made an audio
    mediaRecorder.start();    // start the audio

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {  // record voice to an array
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {      // when stop audio , make an audioBlob in the function
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      // You can upload audioBlob to server here
    };

    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); // stop the audio
    setIsRecording(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && (
        <div className="mt-4">
          <p>Recorded Audio:</p>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
}
