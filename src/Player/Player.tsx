import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Config from "hls.js";
import "./Player.css";
import QualityMenu from "./QualityMenu";
import PlayerControls from "./PlayerControls";

export interface HlsPlayerProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  hlsConfig?: Config;
  src: string;
  width?: string;
  autoPlay?: boolean;
  title?: string;
  color?: string;
}

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

function formateDuration(time: number) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

function TheosPlayer({
  hlsConfig,
  src,
  autoPlay,
  width,
  title,
  color,
}: HlsPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const hls = useRef<Hls>(new Hls());
  const videoContainer = useRef<HTMLDivElement>(null);
  const waitingRef = useRef<HTMLDivElement>(null);
  const pauseIcon = useRef<HTMLDivElement>(null);
  const videoContainerControls = useRef<HTMLDivElement>(null);
  const thumbIndicator = useRef<HTMLDivElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const fullScreenButton = useRef<HTMLButtonElement>(null);
  const miniPlayerButton = useRef<HTMLButtonElement>(null);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const muteButton = useRef<HTMLButtonElement>(null);
  const volumeSlider = useRef<HTMLInputElement>(null);
  const currentTime = useRef<HTMLDivElement>(null);
  const totalTime = useRef<HTMLDivElement>(null);
  const timeLineContainer = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);
  const dropUp = useRef<HTMLDivElement>(null);
  const hasQuality = useRef<boolean>(false);
  const isWaiting = useRef<boolean>(false);
  let isScrubbing = false;
  let wasPaused: any;
  const [quality, setQuality] = useState<number[]>([]);
  const [playbackRate, setPlaybackRate] = useState(1);

  function skip(duration: number) {
    if (video.current === null) {
      return;
    } else {
      video.current!.currentTime += duration;
    }
  }
  function toggleScrubbing(e: any) {
    const rect = timeLineContainer.current!.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.current!.classList.toggle("scrubbing", isScrubbing);
    if (isScrubbing) {
      wasPaused = video.current!.paused;
      video.current!.pause();
    } else {
      video.current!.currentTime = percent * video.current!.duration;
      if (!wasPaused) video.current!.play();
    }
    handleTimeLineUpdate(e);
  }

  const togglePlay = () => {
    if (video.current != null) {
      video.current.paused ? video.current.play() : video.current.pause();
      playButton.current!.blur();
      if (dropUp.current!.classList.contains("open")) {
        dropUp.current!.classList.remove("open");
      }
      if (settingsButton.current!.classList.contains("active")) {
        settingsButton.current!.classList.remove("active");
      }
    }
  };
  const toggleFullScreenMode = () => {
    if (document.fullscreenElement == null) {
      if (videoContainer.current == null && fullScreenButton.current == null)
        return;
      videoContainer.current!.requestFullscreen();
      fullScreenButton.current!.blur();
      if (dropUp.current != null) {
        if (dropUp.current!.classList.contains("open")) {
          dropUp.current!.classList.remove("open");
        }
      }
      if (settingsButton.current!.classList.contains("active")) {
        settingsButton.current!.classList.remove("active");
      }
    } else {
      if (fullScreenButton.current == null) return;
      document.exitFullscreen();
      fullScreenButton.current!.blur();
      if (dropUp.current != null) {
        if (dropUp.current!.classList.contains("open")) {
          dropUp.current!.classList.remove("open");
        }
      }
      if (settingsButton.current!.classList.contains("active")) {
        settingsButton.current!.classList.remove("active");
      }
    }
  };
  const toggleMiniPlayerMode = () => {
    if (videoContainer.current != null) {
      if (videoContainer.current!.classList.contains("mini-player")) {
        document.exitPictureInPicture();
        miniPlayerButton.current!.addEventListener("focus", () => {
          miniPlayerButton.current!.blur();
        });
        if (dropUp.current != null) {
          if (dropUp.current!.classList.contains("open")) {
            dropUp.current!.classList.remove("open");
          }
        }
        if (settingsButton.current!.classList.contains("active")) {
          settingsButton.current!.classList.remove("active");
        }
      } else {
        video.current!.requestPictureInPicture();
        miniPlayerButton.current!.addEventListener("focus", () => {
          miniPlayerButton.current!.blur();
        });
        if (dropUp.current != null) {
          if (dropUp.current!.classList.contains("open")) {
            dropUp.current!.classList.remove("open");
          }
        }
        if (settingsButton.current!.classList.contains("active")) {
          settingsButton.current!.classList.remove("active");
        }
      }
    } else {
      return;
    }
  };
  const toggleMute = () => {
    if (video.current == null) return;
    video.current!.muted = !video.current!.muted;
    if (dropUp.current != null) {
      if (dropUp.current!.classList.contains("open")) {
        dropUp.current!.classList.remove("open");
      }
    }
    if (settingsButton.current!.classList.contains("active")) {
      settingsButton.current!.classList.remove("active");
    }
  };
  const handleVolume = (e: any) => {
    video.current!.volume = e.target.value;
    video.current!.muted = e.target.value === 0;
    if (dropUp.current != null) {
      if (dropUp.current!.classList.contains("open")) {
        dropUp.current!.classList.remove("open");
      }
    }
    if (settingsButton.current!.classList.contains("active")) {
      settingsButton.current!.classList.remove("active");
    }
  };
  const handleTimeLineUpdate = (e: any) => {
    const rect = timeLineContainer.current!.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    timeLineContainer.current!.style.setProperty(
      "--preview-position",
      percent.toString()
    );

    if (isScrubbing) {
      e.preventDefault();
      timeLineContainer.current!.style.setProperty(
        "--progress-position",
        percent.toString()
      );
    }
  };
  const handleTime = (e: any) => {
    const rect = timeLineContainer.current!.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    video.current!.currentTime = percent * video.current!.duration;
  };
  const onProgress = () => {
    if (!video.current!.buffered.length || !bufferRef.current) return;
    const bufferedEnd = video.current!.buffered.end(
      video.current!.buffered.length - 1
    );
    if (bufferRef.current! && video.current!.duration > 0) {
      const width = (bufferedEnd / video.current!.duration) * 100;
      bufferRef.current!.style.width = `${width}%`;
    }
  };
  const handleSettings = () => {
    dropUp.current!.classList.toggle("open");
    settingsButton.current!.classList.toggle("active");
    settingsButton.current!.blur();
  };

  const useHls = () => {
    function _initPlayer() {
      if (hls != null) {
        hls.current.destroy();
      }

      const newHls = new Hls({
        enableWorker: false,
        ...hlsConfig,
      });

      if (video.current != null) {
        newHls.attachMedia(video.current);
      }

      newHls.loadSource(src);

      newHls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video?.current
            ?.play()
            .catch(() =>
              console.log(
                "Unable to autoplay prior to user interaction with the dom."
              )
            );
        }
        if (hasQuality.current) {
          return;
        } else {
          const levels = newHls.levels;
          setQuality(levels.map((level) => level.height));

          hasQuality.current = true;
        }
      });

      newHls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              newHls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              newHls.recoverMediaError();
              break;
            default:
              _initPlayer();
              break;
          }
        }
      });

      hls.current = newHls;
    }

    if (Hls.isSupported()) {
      _initPlayer();
    }

    return () => {
      if (hls != null) {
        hls.current.destroy();
      }
    };
  };

  useEffect(() => {
    if (!video.current) {
      return;
    }
    if (src.includes(".m3u8")) {
      useHls();
    }
    if (color != null) {
      videoContainer.current!.style.setProperty("--theos-main-color", color);
    }
    window.addEventListener("keydown", (e) => {
      if (e.key == " " && e.target == document.body) {
        e.preventDefault();
      }
    });

    document.addEventListener("keydown", (e) => {
      const tagName = document.activeElement?.tagName.toLowerCase();
      if (tagName === "input") {
        return;
      } else if (isWaiting.current) {
        return;
      } else {
        switch (e.key.toLocaleLowerCase()) {
          case " ":
            if (tagName === "button") {
              return;
            } else {
              togglePlay();
              if (dropUp.current != null) {
                if (dropUp.current!.classList.contains("open")) {
                  dropUp.current!.classList.remove("open");
                }
              }
              if (settingsButton.current!.classList.contains("active")) {
                settingsButton.current!.classList.remove("active");
              }
            }
            break;
          case "k":
            togglePlay();
            if (dropUp.current != null) {
              if (dropUp.current!.classList.contains("open")) {
                dropUp.current!.classList.remove("open");
              }
              if (settingsButton.current!.classList.contains("active")) {
                settingsButton.current!.classList.remove("active");
              }
            }
            break;
          case "m":
            toggleMute();
            if (dropUp.current != null) {
              if (dropUp.current!.classList.contains("open")) {
                dropUp.current!.classList.remove("open");
              }
            }
            if (settingsButton.current!.classList.contains("active")) {
              settingsButton.current!.classList.remove("active");
            }
            break;
          case "arrowleft":
          case "j":
            skip(-5);
            if (dropUp.current != null) {
              if (dropUp.current!.classList.contains("open")) {
                dropUp.current!.classList.remove("open");
              }
            }
            if (settingsButton.current!.classList.contains("active")) {
              settingsButton.current!.classList.remove("active");
            }
            break;
          case "arrowright":
          case "l":
            skip(5);
            if (dropUp.current != null) {
              if (dropUp.current!.classList.contains("open")) {
                dropUp.current!.classList.remove("open");
              }
            }
            if (settingsButton.current!.classList.contains("active")) {
              settingsButton.current!.classList.remove("active");
            }
            break;
        }
      }
    });
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        if (video.current != null)
          videoContainer.current!.classList.add("full-screen");
      } else {
        if (video.current != null)
          videoContainer.current!.classList.remove("full-screen");
      }
    });
    document.addEventListener("mouseup", (e) => {
      if (isScrubbing) toggleScrubbing(e);
    });
    document.addEventListener("mousemove", (e) => {
      if (isScrubbing) handleTimeLineUpdate(e);
    });
    // Play-Pause:
    video.current!.addEventListener("play", () => {
      videoContainer.current!.classList.remove("paused");
    });
    video.current!.addEventListener("pause", () => {
      videoContainer.current!.classList.add("paused");
    });

    // Waiting:
    video.current!.addEventListener("waiting", () => {
      waitingRef.current!.classList.add("waiting");
      isWaiting.current = true;
    });
    video.current!.addEventListener("playing", () => {
      waitingRef.current!.classList.remove("waiting");
      isWaiting.current = false;
    });

    // PictureInPicture:
    video.current!.addEventListener("enterpictureinpicture", () => {
      videoContainer.current!.classList.add("mini-player");
    });

    video.current!.addEventListener("leavepictureinpicture", () => {
      videoContainer.current!.classList.remove("mini-player");
    });

    // Volume:
    video.current!.addEventListener("volumechange", () => {
      volumeSlider.current!.value = video.current!.volume.toString();
      let volumeLevel;
      if (video.current!.muted || video.current!.volume === 0) {
        volumeSlider.current!.value = "0";
        volumeLevel = "muted";
      } else if (video.current!.volume >= 0.5) {
        volumeLevel = "high";
      } else {
        volumeLevel = "low";
      }
      videoContainer.current!.dataset.volumeLevel = volumeLevel;
    });

    // Duration:
    video.current!.addEventListener("loadeddata", () => {
      totalTime.current!.textContent = formateDuration(
        video.current!.duration
      )!;
    });

    video.current!.addEventListener("timeupdate", () => {
      currentTime.current!.textContent = formateDuration(
        video.current!.currentTime
      );
      if (video.current!.currentTime > 0) {
        const percent = video.current!.currentTime / video.current!.duration;
        timeLineContainer.current!.style.setProperty(
          "--progress-position",
          percent.toString()
        );
      } else {
        timeLineContainer.current!.style.setProperty(
          "--progress-position",
          "0"
        );
      }
      onProgress();
    });

    // TimeLine:
    timeLineContainer.current!.addEventListener(
      "mousemove",
      handleTimeLineUpdate
    );
    timeLineContainer.current!.addEventListener(
      "mousedown",
      handleTimeLineUpdate
    );
    timeLineContainer.current!.addEventListener("click", handleTime);
    thumbIndicator.current!.addEventListener("mousedown", toggleScrubbing);
    video.current!.addEventListener("progress", onProgress);
  }, [autoPlay, hlsConfig, video.current, src]);

  // This is where the playback rate is set on the video element.
  useEffect(() => {
    if (!video.current) return;
    if (video.current.playbackRate === playbackRate) return;
    video.current.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <div
      ref={videoContainer}
      className="player-container paused"
      data-volume-level="high"
      style={{ width: width }}
    >
      <div ref={waitingRef} className="player-waiting">
        <div className="loading" />
      </div>
      <div ref={pauseIcon} className="player-play-icon" onClick={togglePlay}>
        <div className="play" />
      </div>
      <div ref={videoContainerControls} className="player-controls-container">
        <QualityMenu
          dropUp={dropUp}
          quality={quality}
          hls={hls}
          setPlaybackRate={setPlaybackRate}
        />
        <div ref={timeLineContainer} className="timeline-container">
          <div className="timeline"></div>
          <div className="progress"></div>
          <div ref={bufferRef} className="buffer"></div>
          <div ref={thumbIndicator} className="thumb-indicator"></div>
        </div>
        <PlayerControls
          playButton={playButton}
          togglePlay={togglePlay}
          muteButton={muteButton}
          toggleMute={toggleMute}
          volumeSlider={volumeSlider}
          handleVolume={handleVolume}
          currentTime={currentTime}
          totalTime={totalTime}
          title={title}
          quality={quality}
          settingsButton={settingsButton}
          handleSettings={handleSettings}
          miniPlayerButton={miniPlayerButton}
          toggleMiniPlayerMode={toggleMiniPlayerMode}
          fullScreenButton={fullScreenButton}
          toggleFullScreenMode={toggleFullScreenMode}
        />
      </div>
      <video ref={video} onClick={togglePlay} />
    </div>
  );
}

export default TheosPlayer;
