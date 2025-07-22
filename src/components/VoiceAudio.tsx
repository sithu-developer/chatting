import { useAppDispatch } from '@/store/hooks';
import { createChat } from '@/store/slices/chatsSlice';
import { NewChat } from '@/types/chats';
import { uploadAudioToBlob } from '@/util/upload';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import { Box, Button, Fade, IconButton, Typography } from "@mui/material";
import { useRef, useState } from "react";
import SendRoundedIcon from '@mui/icons-material/SendRounded';

interface Props {
  newChat : NewChat;
}

const defTime = {min : 0 , sec : 0}

 function VoiceRecorder({ newChat } : Props) {
  const [ isRecording, setIsRecording] = useState(false);
  const [ recordingTime , setRecordingTime ] = useState<{ min : number , sec : number }>(defTime);
  const [ fadeRedDot , setFadeRedDot ] = useState<boolean>(true);
  const recordRef = useRef<NodeJS.Timeout>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const dispatch = useAppDispatch();
  const wasCancelledRef = useRef(false);


  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // request permission from chrome
    const mediaRecorder = new MediaRecorder(stream);  // get permission or made an audio
    mediaRecorder.start();    // start the audio

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {  // record voice to an array
      audioChunksRef.current.push(event.data);
    };
    

    mediaRecorder.onstop = async() => {      // when stop audio , make an audioBlob in the function
      if (wasCancelledRef.current) {
        wasCancelledRef.current = false;
        return; // skip upload and dispatch
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      //upload audioBlob to server here
      const voiceUrl = await uploadAudioToBlob(audioBlob);
      dispatch(createChat({...newChat , voiceMessageUrl : voiceUrl}))
    };
    
    setIsRecording(true);
    recordRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if(prev.sec < 59) {
          return { min : prev.min , sec : prev.sec + 1};
        } else {
          return { min : prev.min + 1 , sec : 0 };
        }
      })
      setFadeRedDot((prev) => !prev)
    } , 1000)
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); // stop the audio
    setIsRecording(false);
    if(recordRef.current) {
      clearInterval(recordRef.current);
    }
    setRecordingTime(defTime)
  };

  return (
    <Box>
      {isRecording ? 
      <Box sx={{ bgcolor : "secondary.main" , position : "absolute" , bottom : 0  , left : 0  , width : "100vw" , display : "flex" , justifyContent : "space-between" , alignItems : "center"}} >
        <Box sx={{ display : "flex" , gap : "10px" , alignItems : "center"}}>
            <Fade in={fadeRedDot} >
              <Box sx={{ bgcolor : "red" , width : "10px" , height : "10px" , borderRadius : "10px", ml : "15px"}} />
            </Fade>
            <Typography sx={{ color : "white" }}>{recordingTime.min + ":" + recordingTime.sec}</Typography>
        </Box>
        <Button sx={{ color : "info.main"}} onClick={() => {
            wasCancelledRef.current = true;
            mediaRecorderRef.current?.stop();
            audioChunksRef.current = [];
            setIsRecording(false);
            if(recordRef.current) {
              clearInterval(recordRef.current);
            }
            setRecordingTime(defTime)
        }}>Cancel</Button>
        <IconButton onClick={stopRecording}> 
            <SendRoundedIcon sx={{color : "info.main" }} />
        </IconButton> 
      </Box> 
      :undefined}
      {!isRecording ? <IconButton onClick={startRecording}
      >
          <KeyboardVoiceOutlinedIcon sx={{ color : "GrayText"}} />
      </IconButton>
      :undefined}
    </Box>
  );
}

export default VoiceRecorder;
