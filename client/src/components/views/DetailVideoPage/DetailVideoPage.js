import React, { useEffect, useState } from "react";
import { List, Avatar, Typography, Row, Col } from "antd";
import Axios from "axios";

function DetailVideoPage(props) {
  const [Video, setVideo] = useState([]);
  const videoId = props.match.params.videoId; // 현재 URL의 videoId 값 추출, '.videoId'인 이유는 App.js에 path에 /:videoId로 맞춰주었기 때문이다.

  const videoVariable = {
    videoId: videoId
  };
  useEffect(() => {
    Axios.post("/api/video/getVideo", videoVariable).then(response => {
      if (response.data.success) {
        console.log(response.data);
        setVideo(response.data.video);
      } else {
        alert("Failed to get video Info");
      }
    });
  }, []);
  console.log(Video);

  return (
    <Row>
      <Col lg={18} xs={24}>
        <div
          className="postPage"
          style={{ width: "100%", padding: "3rem 4em" }}
        >
          <video
            style={{ width: "100%" }}
            src={`http://localhost:5000/${Video.filePath}`}
            controls
          ></video>
          <List.Item actions={[]}>
            <List.Item.Meta
              avatar={<Avatar src={Video.writer && Video.writer.image} />}
              title={<a href="https://www.naver.com">{Video.title}</a>}
              description={Video.description}
            />
          </List.Item>
        </div>
      </Col>
      <Col lg={6} xs={24}>
        {/* Side Video 화면 */}
        {/* lg사이즈일경우 3:'1' 비율로 Video화면 좌측에 위치하게 되고, xs사이즈일경우 Video화면 아래쪽에 위치하게 된다. */}
        <div style={{ display: "flex", marginTop: "1rem", padding: "0 2rem" }}>
          <div>
            <a href>
              <img style={{ width: "100%" }} src />
            </a>
            <div>
              <a href>
                <span style={{ fontSize: "1rem", color: "black" }}>
                  video title
                </span>
                <br />
                <span>user name</span>
                <br />
                <span>view count</span>
                <br />
                <span>duration</span>
                <br />
              </a>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default DetailVideoPage;
