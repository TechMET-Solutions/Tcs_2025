import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const EmpDashboard = () => {
  const webcamRef = useRef(null);

  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(""); // IN / OUT

  // 📸 Capture photo from webcam
  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  // 🟢 Punch In
  const punchIn = () => {
    capture();
    setStatus("IN");

    // 🔗 Later send image to backend for face verification
    console.log("Punch In Image:", image);
  };

  // 🔴 Punch Out
  const punchOut = () => {
    capture();
    setStatus("OUT");

    console.log("Punch Out Image:", image);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Employee Dashboard
      </h2>

      {/* Webcam */}
      <div className="border rounded-lg w-[350px] p-3 mb-4">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-md"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={punchIn}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Punch In
        </button>

        <button
          onClick={punchOut}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Punch Out
        </button>
      </div>

      {/* Status */}
      {status && (
        <p className="mt-4 font-semibold">
          Attendance Status:{" "}
          <span className="text-blue-600">{status}</span>
        </p>
      )}

      {/* Captured Image Preview */}
      {image && (
        <div className="mt-4">
          <p className="font-medium mb-2">Captured Image:</p>
          <img
            src={image}
            alt="Captured"
            className="w-40 border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default EmpDashboard;
