import React, { useEffect, useState, useRef } from "react";

function Landing() {
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const divHeight = document.querySelector(".landing").offsetHeight;
    setImageHeight(divHeight);
  }, []);

  return (
    <div className="landing grid grid-cols-2 px-20" style={{ height: "87vh" }}>
      <div className="flex justify-center items-center">
        <img
          ref={imageRef}
          src="bg_chesspanel.png"
          alt="chesspanel"
          className="rounded-lg py-3 ml-10"
          style={{ height: imageHeight, objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col justify-center p-10">
        <button className="m-2 py-5 border border-gray-700 rounded-lg flex-1">
          Play Online
        </button>
        <button className="m-2 py-5 border border-gray-700 rounded-lg flex-1">
          Challenge AI
        </button>
        <button className="m-2 py-5 border border-gray-700 rounded-lg flex-1">
          Tournaments
        </button>
        <button className="m-2 py-5 border border-gray-700 rounded-lg flex-1">
          Chess Ranking
        </button>
      </div>
    </div>
  );
}

export default Landing;
