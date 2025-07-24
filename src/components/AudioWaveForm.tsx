import { Box, IconButton, Typography } from '@mui/material'
import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import { formatTime } from '@/util/general';
import { useWavesurfer } from '@wavesurfer/react'

interface Props {
  audioUrl: string
  isFromUser : boolean
  playersRef : RefObject<{ wavesurfer: WaveSurfer, setIsPlaying: (val: boolean) => void }[]>
}

function AudioWaveform({ audioUrl , isFromUser , playersRef }: Props) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingTime , setPlayingTime ] = useState<number>(0);
  const [totalTime , setTotalTime ] = useState<number>(0);

  
    const { wavesurfer } = useWavesurfer({
      container: waveformRef,
      waveColor: isFromUser ? '#B9D6F2' : 'GrayText',
      progressColor: '#2979FF',
      height: 30,
      barWidth: 2,
      barRadius: 3,
      normalize: true,
      interact: true, // url here is for create only
    })

  useEffect(() => {
    if (!wavesurfer || !audioUrl) return

    wavesurfer.load(audioUrl) // url here is for both create and reuse anytime

    if (playersRef.current) {
      playersRef.current.push({ wavesurfer, setIsPlaying })
    }

    const handleFinish = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleProcess = (time: number) => setPlayingTime(time)
    const handleReady = () => setTotalTime(wavesurfer.getDuration())

    wavesurfer.on('finish', handleFinish)
    wavesurfer.on('play', handlePlay)
    wavesurfer.on('pause', handlePause)
    wavesurfer.on('audioprocess', handleProcess)
    wavesurfer.on('ready', handleReady)

    return () => {
      if (playersRef.current) {
        playersRef.current = playersRef.current.filter(p => p.wavesurfer !== wavesurfer)
      }
      wavesurfer.un('finish', handleFinish)
      wavesurfer.un('play', handlePlay)
      wavesurfer.un('pause', handlePause)
      wavesurfer.un('audioprocess', handleProcess)
      wavesurfer.un('ready', handleReady)
    }
  }, [wavesurfer , playersRef , audioUrl])

  const togglePlay = useCallback(() => {
    if (!wavesurfer) return

    // Stop other players
    playersRef.current?.forEach(({ wavesurfer: otherWS, setIsPlaying }) => {
      if (otherWS !== wavesurfer) {
        otherWS.stop()
        setIsPlaying(false)
      }
    })

    wavesurfer.playPause();
    setIsPlaying(wavesurfer.isPlaying());
  }, [wavesurfer, playersRef])

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
            <Box ref={waveformRef} sx={{ maxWidth : "60vw" , minWidth : "40vw" , height : 40 , zIndex : 0}} />
            <Typography sx={{ color : (isFromUser ? "white" : "GrayText") , fontSize : "13px" , lineHeight : 0.5}}>{playingTime ? formatTime(playingTime) : formatTime(totalTime)}</Typography>
        </Box>
    </Box>
  )
}

export default AudioWaveform;