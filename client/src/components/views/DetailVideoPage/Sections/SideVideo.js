import React, { useEffect, useState } from "react";
import Axios from "axios";

function SideVideo() {
  const [SideVideos, setSideVideos] = useState([]);
  useEffect(() => {
    // useEffect를 사용하여 리액트 컴포넌트가 렌더링 될 때마다 특정 작업을 수행하도록 설정한다.
    Axios.get("/api/video/getVideos").then(response => {
      if (response.data.success) {
        setSideVideos(response.data.videos); // state에 저장
      } else {
        alert("Failed to get Videos");
      }
    });
  }, []);
  const SideVideoItem = SideVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60); // Math.floor는 소수점 이하를 버린다.
    var seconds = Math.floor(video.duration - minutes * 60);
    return (
      <div style={{ display: "flex", marginTop: "1rem", padding: "0 1rem" }}>
        <div style={{ width: "100%", marginRight: "1rem" }}>
          <a href={`/video/${video._id}`} style={{ color: "gray" }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>
        <div style={{ width: "50%" }}>
          <a
            href={`/video/${video._id}`}
            style={{ color: "gray", fontSize: "0.8rem" }}
          >
            <span style={{ fontSize: "1rem", color: "black" }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} views</span>
            <br />
            <span>
              {minutes}:{seconds}
            </span>
            <br />
          </a>
        </div>
      </div>
    );
  });
  return (
    <React.Fragment>
      <div style={{ marginTop: "3rem" }}></div>{" "}
      {/* DetailVideoPage의 mariginTop: '3rem'과 같게 margin을 맞춰줌 */}
      {SideVideoItem}
    </React.Fragment>
  );
}

export default SideVideo;
