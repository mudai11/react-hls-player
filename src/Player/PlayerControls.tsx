import React from "react";
import "./PlayerControls.css";

interface Props {
  playButton: React.RefObject<HTMLButtonElement>;
  togglePlay: () => void;
  muteButton: React.RefObject<HTMLButtonElement>;
  toggleMute: () => void;
  volumeSlider: React.RefObject<HTMLInputElement>;
  handleVolume: (e: any) => void;
  currentTime: React.RefObject<HTMLDivElement>;
  totalTime: React.RefObject<HTMLDivElement>;
  title: string | undefined;
  quality: number[];
  settingsButton: React.RefObject<HTMLButtonElement>;
  handleSettings: () => void;
  miniPlayerButton: React.RefObject<HTMLButtonElement>;
  toggleMiniPlayerMode: () => void;
  fullScreenButton: React.RefObject<HTMLButtonElement>;
  toggleFullScreenMode: () => void;
}

function PlayerControls({
  playButton,
  togglePlay,
  muteButton,
  toggleMute,
  volumeSlider,
  handleVolume,
  currentTime,
  totalTime,
  title,
  quality,
  settingsButton,
  handleSettings,
  miniPlayerButton,
  toggleMiniPlayerMode,
  fullScreenButton,
  toggleFullScreenMode,
}: Props) {
  return (
    <div className="controls">
      <button ref={playButton} className="play-pause-btn" onClick={togglePlay}>
        <svg className="play-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        </svg>
        <svg className="pause-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
        </svg>
      </button>
      <div className="volume-container">
        <button ref={muteButton} className="mute-btn" onClick={toggleMute}>
          <svg className="volume-high-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
            />
          </svg>
          <svg className="volume-low-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
            />
          </svg>
          <svg className="volume-muted-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
            />
          </svg>
        </button>
        <input
          className="volume-slider"
          ref={volumeSlider}
          type="range"
          min="0"
          max="1"
          step="any"
          defaultValue="1"
          onChange={handleVolume}
        />
      </div>
      <div className="duration-container">
        <div ref={currentTime} className="current-time">
          0:00
        </div>
        /<div ref={totalTime} className="total-time"></div>
        {title && (
          <>
            | <div className="video-title">{title}</div>
          </>
        )}
      </div>
      {quality.length > 1 && (
        <button
          ref={settingsButton}
          className="settings-btn"
          onClick={handleSettings}
        >
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m9.7 21.5-.4-3.05q-.4-.125-.812-.375-.413-.25-.763-.525L4.9 18.75l-2.3-4 2.45-1.85q-.05-.225-.062-.45-.013-.225-.013-.45 0-.2.013-.425.012-.225.062-.475L2.6 9.25l2.3-3.975L7.725 6.45q.35-.275.763-.512Q8.9 5.7 9.3 5.55l.4-3.05h4.6l.4 3.05q.45.175.812.387.363.213.738.513l2.85-1.175 2.3 3.975-2.475 1.875q.05.25.05.45V12q0 .2-.013.412-.012.213-.062.488l2.45 1.85-2.3 4-2.8-1.2q-.375.3-.762.525-.388.225-.788.375l-.4 3.05ZM12 15q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15Z"
            />
          </svg>
        </button>
      )}
      <button
        ref={miniPlayerButton}
        className="mini-player-btn"
        onClick={toggleMiniPlayerMode}
      >
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
          />
        </svg>
      </button>
      <button
        ref={fullScreenButton}
        className="full-screen-btn"
        onClick={toggleFullScreenMode}
      >
        <svg className="open" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
          />
        </svg>
        <svg className="close" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
          />
        </svg>
      </button>
    </div>
  );
}

export default PlayerControls;
