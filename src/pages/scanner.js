import React, { useState, useEffect, useRef } from "react";

import "./scanner.scss";

const Scanner = () => {
  const [buttonTakePictureDisabled, setButtonTakePictureDisabled] =
    useState(true);
  const [downloadPicture, setDownloadPicture] = useState(false);

  useEffect(async () => {
    // Prompt the user for permission to use the video camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const { current: video } = videoRef;

    video.srcObject = stream;
    video.play();

    setButtonTakePictureDisabled(false);
  }, []);

  const videoRef = useRef();
  const canvasRef = useRef();

  const takePicture = async () => {
    videoToCanvas();

    if (downloadPicture) {
      const blob = await canvasToBlob();

      download(blob);
    }
  };

  const videoToCanvas = () => {
    const { current: canvas } = canvasRef;

    const ctx = canvas.getContext("2d"); // Get canvas' 2D rendering context

    const { current: video } = videoRef;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
  };

  const canvasToBlob = async () =>
    await new Promise((resolve) => canvasRef.current.toBlob(resolve));

  const download = (blob) => {
    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "screenshot.jpg";

    document.body.appendChild(a);

    a.click();
    a.remove();
  };

  return (
    <div className="scanner">
      <div className="content">
        <video ref={videoRef} />
        <div>
          <button disabled={buttonTakePictureDisabled} onClick={takePicture}>
            Take picture
          </button>
          <input
            type="checkbox"
            checked={downloadPicture}
            onChange={() => setDownloadPicture(!downloadPicture)}
          />{" "}
          Download?
        </div>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Scanner;
