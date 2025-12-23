import React, { useEffect, useRef, useState } from "react";
import { Button } from "../..";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export const Music: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
      });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source
          src="/year.mp3"
          type="audio/mp3"
        />
      </audio>

      <Button
        variant="secondary"
        onClick={toggleMusic}
        className="z-50 bg-0 hover:bg-0 p-0 [&_svg]:size-[25px]"
      >
        {isPlaying ? (
          <FaVolumeUp className="text-[#e7e7e7] dark:text-[#e7e7e7]" />
        ) : (
          <FaVolumeMute className="text-[#e7e7e7] dark:text-[#e7e7e7]" />
        )}
      </Button>
    </>
  );
};
