import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from "antd";
import Axios from "axios";
import moment from "moment";
const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [Videos, setVideos] = useState([]); //array형식으로 데이터를 받아오기 때문에, 초기값을 빈 배열로 설정.
  let variable = {
    userFrom: localStorage.getItem("userId")
  };
  useEffect(() => {
    // useEffect를 사용하여 리액트 컴포넌트가 렌더링 될 때마다 특정 작업을 수행하도록 설정한다.
    Axios.post("/api/video/getSubscriptionVideos", variable).then(response => {
      if (response.data.success) {
        setVideos(response.data.videos); // 받아온 데이터들을 state에 저장한다.
      } else {
        alert("Failed to get Subscription Videos");
      }
    });
  }, []);
  const renderCards = Videos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60); // Math.floor는 소수점 이하를 버린다.
    var seconds = Math.floor(video.duration - minutes * 60);
    return (
      <Col lg={6} md={8} xs={24}>
        {/* 반응형 웹 디자인. 스크린 사이즈의 전체 크기는 24이며, 스크린의 크기가 lg일경우 해당 박스를 6만큼 차지하게 한다.(24/6 => 4개의 박스를 스크린에 띄울수 있다.)
md일 경우 해당 박스가 8만큼 차지한다.(24/8 => 3개의 박스를 띄울수 있다.) xs일경우 해당 박스가 24만큼 차지한다.(24/24 => 1개의 박스만 스크린에 띄울수 있다.) */}
        <div style={{ position: "relative" }}>
          <a href={`/video/${video._id}`}>
            {/* 이미지를 클릭해서 해당 DetailPage에 접근하게 한다. */}
            <img
              style={{ width: "100%" }}
              alt="thumbnail"
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div
              className="duration"
              style={{
                bottom: 0, // 해당 이미지 영역에서 가장 밑 부분에 해당.
                right: 0, // 해당 이미지 영역에서 가장 오른쪽 부분에 해당.
                position: "absolute",
                margin: "4px",
                color: "#fff",
                backgroundColor: "rgba(17,17,17,0.8)",
                opacity: 0.8,
                padding: "2px 4px",
                borderRadius: "2px",
                // letterSpacing: "0.5px",
                fontWeight: "500",
                lineHeight: "12px"
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={
            <a style={{ color: "black" }} href={`/video/${video._id}`}>
              {video.title}
            </a>
          }
        />
        <span>{video.writer.name}</span>
        <br />
        <span style={{ marginLeft: "3rem" }}>
          조회수 {video.views} &nbsp; &nbsp;업로드&nbsp;
        </span>
        <span>{moment(video.createdAt).format("MMM Do")}</span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2} style={{ color: "gray" }}>
        구독된 영상
      </Title>
      <hr />
      <Row gutter={16}>{renderCards}</Row> {/* gutter는 Row간의 간격 */}
    </div>
  );
}

export default SubscriptionPage;
