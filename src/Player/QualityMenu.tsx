import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "./QualityMenu.css";

interface Props {
  dropUp: React.RefObject<HTMLDivElement>;
  quality: number[];
  hls: React.MutableRefObject<Hls>;
  setPlaybackRate: (arg0: number) => void;
}

function QualityMenu({ dropUp, quality, hls, setPlaybackRate }: Props) {
  const mainRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const pbrRef = useRef<HTMLDivElement>(null);
  const [activeQuality, setActiveQuality] = useState<String>("Auto");
  const [checked, setChecked] = useState<number>(-1);
  const [checkedPb, setCheckedPb] = useState<number>(3);
  const playbackrate = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.7, 2];

  const handleQuality = () => {
    qualityRef.current!.classList.add("open");
    mainRef.current!.classList.add("close");
  };
  const handleMain = () => {
    mainRef.current!.classList.remove("close");
    qualityRef.current!.classList.remove("open");
    pbrRef.current!.classList.remove("open");
  };
  const handlePbr = () => {
    mainRef.current!.classList.add("close");
    pbrRef.current!.classList.add("open");
  };

  return (
    <div ref={dropUp} className="dropup">
      <div ref={mainRef} className="main">
        <span onClick={handleQuality}>
          Quality <span>({activeQuality})</span>
          <svg className="main-icon">
            <path
              fill="currentColor"
              d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z"
            />
          </svg>
        </span>
        <span onClick={handlePbr}>
          Playback
          <span>
            {" "}
            {playbackrate[checkedPb] != 1 && (
              <span> (x{playbackrate[checkedPb]})</span>
            )}
            {playbackrate[checkedPb] == 1 && <span> (Normal)</span>}
          </span>
          <svg className="main-icon">
            <path
              fill="currentColor"
              d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z"
            />
          </svg>
        </span>
      </div>
      <div ref={qualityRef} className="qualitymenu">
        <div className="title" onClick={handleMain}>
          <svg className="menu-icon">
            <path
              fill="currentColor"
              d="m14 18-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6Z"
            />
          </svg>
          <p>Quality:</p>
        </div>
        {quality.length > 1 && (
          <>
            {quality
              .map((quality, index) => {
                return (
                  <label
                    key={index}
                    onChange={() => {
                      hls.current.levels.forEach((level, levelIndex) => {
                        if (level.height === quality) {
                          hls.current.currentLevel = levelIndex;
                        }
                        setChecked(index);
                        setActiveQuality(
                          hls.current.levels[index].height.toString() + "p"
                        );
                        qualityRef.current!.classList.remove("open");
                        mainRef.current!.classList.remove("close");
                      });
                    }}
                    className="radio"
                  >
                    <input type="radio" name="quality" />
                    <svg className="checked">
                      {checked == index && (
                        <path
                          fill="currentColor"
                          d="m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z"
                        />
                      )}
                    </svg>
                    <span>{quality}p</span>
                    <svg className="quality">
                      {quality == 2160 && (
                        <path
                          fill="currentColor"
                          d="M13 15h1.5v-2.25L16.25 15h1.825l-2.325-3 2.325-3H16.25l-1.75 2.25V9H13Zm-3.5 0H11v-1.5h1V12h-1V9H9.5v3H8V9H6.5v4.5h3ZM5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Zm0-2h14V5H5v14ZM5 5v14V5Z"
                        />
                      )}
                      {(quality == 1440 ||
                        quality == 1080 ||
                        quality == 720) && (
                        <path
                          fill="currentColor"
                          d="M6 15h1.5v-2h2v2H11V9H9.5v2.5h-2V9H6Zm7 0h4q.425 0 .712-.288Q18 14.425 18 14v-4q0-.425-.288-.713Q17.425 9 17 9h-4Zm1.5-1.5v-3h2v3ZM4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm0-2h16V6H4v12Zm0 0V6v12Z"
                        />
                      )}
                      {quality == 480 && (
                        <path
                          fill="currentColor"
                          d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm0-2h16V6H4v12Zm3-3h3q.425 0 .713-.288Q11 14.425 11 14v-1.5q0-.425-.287-.713-.288-.287-.713-.287H7.5v-1h2v.5H11v-1q0-.425-.287-.713Q10.425 9 10 9H7q-.425 0-.713.287Q6 9.575 6 10v1.5q0 .425.287.712.288.288.713.288h2.5v1h-2V13H6v1q0 .425.287.712Q6.575 15 7 15Zm6 0h4q.425 0 .712-.288Q18 14.425 18 14v-4q0-.425-.288-.713Q17.425 9 17 9h-4Zm1.5-1.5v-3h2v3ZM4 18V6v12Z"
                        />
                      )}
                    </svg>
                  </label>
                );
              })
              .reverse()}
            <label
              onChange={() => {
                hls.current.currentLevel = -1;
                setChecked(-1);
                setActiveQuality("Auto");
                qualityRef.current!.classList.remove("open");
                mainRef.current!.classList.remove("close");
              }}
              className="radio"
            >
              <input type="radio" name="quality" defaultChecked />
              <svg className="checked">
                {checked == -1 && (
                  <path
                    fill="currentColor"
                    d="m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z"
                  />
                )}
              </svg>
              <span>Auto</span>
            </label>
          </>
        )}
      </div>
      <div ref={pbrRef} className="playbackrate">
        <div className="title" onClick={handleMain}>
          <svg className="menu-icon">
            <path
              fill="currentColor"
              d="m14 18-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6Z"
            />
          </svg>
          <p>Playback Speed:</p>
        </div>
        {playbackrate.map((pbr, index) => (
          <div
            key={index}
            className="pbrates"
            onClick={() => {
              setPlaybackRate(pbr);
              setCheckedPb(index);
              pbrRef.current!.classList.remove("open");
              mainRef.current!.classList.remove("close");
            }}
          >
            <svg className="checked">
              {checkedPb == index && (
                <path
                  fill="currentColor"
                  d="m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z"
                />
              )}
            </svg>
            {pbr != 1 && <span>x{pbr}</span>}
            {pbr == 1 && <span>Normal</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QualityMenu;
