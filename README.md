# react-hls-player

A custom react hls player inspired by Youtube with bitrate options if avaiblable.

## Introduction

`react-hls-player` is a simple HLS live stream player.
It uses [hls.js](https://github.com/video-dev/hls.js) to play your hls live stream if your browser supports `html 5 video` and `MediaSource Extension`.

```javascript
npm install @aka_theos/react-hls-player@1.0.0
```

## Examples

### Using the TheosPlayer component

```javascript
import React from "react";
import ReactDOM from "react-dom";
import TheosPlayer from "@aka_theos/react-hls-player";

ReactDOM.render(
  <TheosPlayer
    src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    autoPlay={false}
  />,
  document.getElementById("app")
);
```

### Using hlsConfig (advanced use case)

All available config properties can be found on the [Fine Tuning](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning) section of the Hls.js API.md

```javascript
import React from "react";
import ReactDOM from "react-dom";
import TheosPlayer from "@aka_theos/react-hls-player";

ReactDOM.render(
  <TheosPlayer
    src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    hlsConfig={{
      maxLoadingDelay: 4,
      minAutoBitrate: 0,
      lowLatencyMode: true,
    }}
  />,
  document.getElementById("app")
);
```

## Props

All [video properties](https://www.w3schools.com/tags/att_video_poster.asp) are supported and passed down to the underlying video component

| Prop                     | Description                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| src `String`, `required` | The hls url that you want to play                                                                                       |
| autoPlay `Boolean`       | Autoplay when component is ready. Defaults to `false`                                                                   |
| hlsConfig `Object`       | `hls.js` config, you can see all config [here](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning) |
| width `String`           | Determines the width of the video player. note that if you leave this empty the video player is responsive.             |
| title `String`           | give the video a title and it will appear in the video player.                                                          |
| color `String`           | give the video player a color and it will change the color theme of the player.                                         |

### Additional Notes

By default, the HLS config will have `enableWorker` set to `false`. There have been issues with the HLS.js library that breaks some React apps, so I've disabled it to prevent people from running in to this issue. If you want to enable it and see if it works with your React app, you can simply pass in `enableWorker: true` to the `hlsConfig` prop object. [See this issue for more information](https://github.com/video-dev/hls.js/issues/2064)
