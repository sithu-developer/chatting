import { Box, IconButton, Typography } from '@mui/material'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import { formatTime } from '@/util/general';

interface Props {
  audioUrl: string
  isFromUser : boolean
  playersRef : RefObject<{ wavesurfer: WaveSurfer, setIsPlaying: (val: boolean) => void }[]>
}

function AudioWaveform({ audioUrl , isFromUser , playersRef }: Props) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingTime , setPlayingTime ] = useState<number>(0);
  const [totalTime , setTotalTime ] = useState<number>(0);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: (isFromUser ? '#B9D6F2' : "GrayText"),
      progressColor: '#2979FF',
      height: 30,
      barWidth: 2,
      barRadius : 3,
      normalize: true,
      interact: true,
    })

    wavesurferRef.current = wavesurfer;

    if (playersRef.current) {
      playersRef.current.push({ wavesurfer, setIsPlaying })
    }

    wavesurfer.load(audioUrl)

    wavesurfer.on('finish', () => {
        setIsPlaying(false);
    })

    wavesurfer.on('ready', () => {
      setTotalTime(wavesurfer.getDuration())
    })

    wavesurfer.on('audioprocess', (time) => {
      setPlayingTime(time)
    })

    return () => {
      if (playersRef.current) {
        playersRef.current = playersRef.current.filter((p) => p.wavesurfer !== wavesurfer)
      }
      setTimeout(() => {
        wavesurfer.destroy()
      }, 100)
    }
  }, [audioUrl , isFromUser , playersRef])

  const togglePlay = () => {
    const currentWS = wavesurferRef.current
    if (!currentWS) return

    playersRef.current?.forEach(({ wavesurfer, setIsPlaying }) => {
      if (wavesurfer !== currentWS) {
        wavesurfer.stop();
        setIsPlaying(false);
      }
    });

    currentWS.playPause()
    setIsPlaying(currentWS.isPlaying())
  }

  return (
    <Box sx={{ display : "flex" , gap : "5px" , alignItems : "center"}}  onClick={(e) => {
            e.stopPropagation();
        }} >
        <IconButton sx={{ width : "63px" , height : "63px"}} onClick={(e) => {
            e.stopPropagation();
            togglePlay();
        }}>
            {isPlaying ? 
            <PauseCircleFilledRoundedIcon sx={{ color : (isFromUser ? "white" : "info.main") , fontSize : "60px"}} />
            :<PlayCircleFilledRoundedIcon sx={{ color : (isFromUser ? "white" : "info.main") , fontSize : "60px"}} />}
        </IconButton>
        <Box>
            <Box ref={waveformRef} sx={{ maxWidth : "60vw" , minWidth : "40vw" , height : 40}} />
            <Typography sx={{ color : (isFromUser ? "white" : "GrayText") , fontSize : "13px" , lineHeight : 0.5}}>{playingTime ? formatTime(playingTime) : formatTime(totalTime)}</Typography>
        </Box>
    </Box>
  )
}

export default AudioWaveform;