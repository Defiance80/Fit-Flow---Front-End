'use client'
import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import MuxPlayer from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'
import { useDispatch, useSelector } from 'react-redux'
import { previouslyCompletedCurriculumsIdsSelector, selectedCurriculumItemSelector, setIsCurriculumItemCompleted } from '@/redux/reducers/helpersReducer'
import { settingsSelector } from '@/redux/reducers/settingsSlice'



const VideoSect = () => {
  const dispatch = useDispatch();
  const selectedCurriculumItem = useSelector(selectedCurriculumItemSelector);
  const settings = useSelector(settingsSelector);
  const previouslyCompletedCurriculumsIds = useSelector(previouslyCompletedCurriculumsIdsSelector);
  const isIdIncludes = previouslyCompletedCurriculumsIds?.includes(selectedCurriculumItem?.id as number)
  const primaryColor = settings?.data?.system_color;

  const [progress, setProgress] = useState(0);
  const youtubePlayerRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<MuxPlayerElement | null>(null);
  const hasDispatchedCompletion = useRef(false);

  // console.log("hasDispatchedCompletion from variable : ", hasDispatchedCompletion.current);

  // const handleProgress = (event: React.SyntheticEvent<HTMLVideoElement>) => {
  //   console.log("funtion calling", event);
  //   const progress = (event.target as HTMLVideoElement).currentTime / (event.target as HTMLVideoElement).duration;
  //   const currentProgress = progress * 100;
  //   setProgress(Number(currentProgress.toFixed(0)));
  // }


  const handleTimeUpdate = () => {
    // console.log("handleTimeUpdate function calling");
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      const duration = playerRef.current.duration;

      if (duration > 0) {
        const currentProgress = (currentTime / duration) * 100;
        // console.log("currentProgress : ", currentProgress);
        setProgress(Number(currentProgress.toFixed(0)));
      }
    }
  }
  // const handleEnded = () => {
  // setProgress(100); // Ensure it locks to 100%
  // }

  // const handleDurationChange = (event: React.SyntheticEvent<HTMLVideoElement>) => {
  //   const duration = (event.target as HTMLVideoElement).duration;
  //   console.log("Duration changed: ", duration);
  // }

  const handleYoutubeTimeUpdate = () => {
    if (youtubePlayerRef.current) {
      const currentTime = youtubePlayerRef.current.currentTime;
      const duration = youtubePlayerRef.current.duration;

      if (duration > 0) {
        const currentProgress = (currentTime / duration) * 100;
        setProgress(Number(currentProgress.toFixed(0)));
      }
    }
  }

  useEffect(() => {
    hasDispatchedCompletion.current = false;
  }, [selectedCurriculumItem?.id]);

  useEffect(() => {
    if (!isIdIncludes && progress >= 90 && !hasDispatchedCompletion.current) {
      hasDispatchedCompletion.current = true;
      dispatch(setIsCurriculumItemCompleted({ completed: true }));
    }
    // console.log("progress : ", progress);
  }, [progress]);

  const videoUrl = selectedCurriculumItem?.youtube_url || selectedCurriculumItem?.url || selectedCurriculumItem?.file || '';

  const isYoutubeUrl = selectedCurriculumItem?.youtube_url

  return (
    <div className="relative aspect-video w-full min-h-[356px] sm:min-h-[486px] md:min-h-[686px] customScrollbar">
      {
        isYoutubeUrl ?
          <ReactPlayer
            controls
            src={selectedCurriculumItem?.youtube_url || selectedCurriculumItem?.url || selectedCurriculumItem?.file || ''}
            className='w-full h-full rounded-lg'
            ref={youtubePlayerRef}
            onTimeUpdate={handleYoutubeTimeUpdate}
          />
          :
          <MuxPlayer
            ref={playerRef}
            src={videoUrl}
            className='w-full h-full rounded-lg'
            onTimeUpdate={handleTimeUpdate}
            style={{ width: '100%', height: '100%' }}
            accent-color={primaryColor}
          />
      }
    </div>
  )
}

export default VideoSect