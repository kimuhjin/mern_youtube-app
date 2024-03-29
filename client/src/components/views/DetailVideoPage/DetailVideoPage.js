import React, { useEffect, useState } from "react";
import { List, Avatar, Row, Col, Icon } from "antd";
import Axios from "axios";
import SideVideo from "../DetailVideoPage/Sections/SideVideo";
import Subscriber from "../DetailVideoPage/Sections/Subscriber";
import Comments from "../DetailVideoPage/Sections/Comments";
import LikeDislikes from "./Sections/LikeDislikes";

function DetailVideoPage(props) {
  const [Video, setVideo] = useState([]);
  const [CommentLists, setCommentLists] = useState([]);
  const videoId = props.match.params.videoId; // 현재 URL의 videoId 값 추출, '.videoId'인 이유는 App.js에 path에 /:videoId로 맞춰주었기 때문이다.

  const videoVariable = {
    videoId: videoId
  };
  useEffect(() => {
    Axios.post("/api/video/getVideo", videoVariable).then(response => {
      if (response.data.success) {
        setVideo(response.data.video);
      } else {
        alert("Failed to get video Info");
      }
    });

    Axios.post("/api/comment/getComments", videoVariable).then(response => {
      if (response.data.success) {
        console.log(response.data.comments);
        setCommentLists(response.data.comments);
      } else {
        alert("Failed to get video Info");
      }
    });
  }, []);

  const updateComment = newComment => {
    setCommentLists(CommentLists.concat(newComment)); // 밑에 <Comment/>에서 props로 받아온 데이터를 updateComment의 파라미터로 사용한다.
    // 파라미터로 받아온 데이터를 concat을 통해 commentLists에 추가해주고, 그 array들을 setCommentLists에 setState한다.
  };

  if (Video.writer) {
    /* if문으로 Return을 감싸준 이유는 밑에 <Subscribe>에서 Video.writer._id를 가져오는 속도가 '렌더링 되는 속도보다 느리기 때문에' 
  if문을 이용하여 Video.writer 데이터가 존재하면 그 다음에 Return이 동작하여 렌더링 하게 하였다. */
    return (
      <Row>
        <Col lg={18} xs={24}>
          <div
            className="postPage"
            style={{ width: "100%", padding: "3rem 1.5rem" }}
          >
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${Video.filePath}`}
              controls
            ></video>
            <List.Item //antd에서 actions를 통해 액션을 컨트롤 한다.
              actions={[
                <LikeDislikes
                  video
                  videoId={videoId}
                  userId={localStorage.getItem("userId")}
                />,
                <Subscriber
                  userTo={Video.writer._id}
                  userFrom={localStorage.getItem("userId")}
                />
              ]}
            >
              {/* 구독자 버튼, Video.writer._id를 userTo로 받아 props로 넘겨준다.*/}
              {/* 현재유저에 Id는 로그인 할 때 localStorage에 저장하도록 LoginPage에서 지정하였다. 
                localStorage안의 데이터에 접근할 시 localStorage.getItem( )을 사용하여 가져온다.*/}
              <List.Item.Meta
                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                title={<a href="https://www.naver.com">{Video.title}</a>}
                description={Video.description}
              />
            </List.Item>
            {/* 댓글 기능 섹션 */}
            <Comments
              CommentLists={CommentLists} // 위에서 새로 저장한 CommentLists array를 Comments props로 전달한다.
              postId={Video._id}
              refreshFunction={updateComment}
            />
            {/* Video._id를 postId에 담아 props로 넘겨준다. */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          {/* Side Video 화면 */}
          {/* lg사이즈일경우 3:'1' 비율로 Video화면 좌측에 위치하게 되고, xs사이즈일경우 Video화면 아래쪽에 위치하게 된다. */}
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return (
      <div>
        <Icon
          type="loading"
          style={{
            fontSize: 24
          }}
          spin
        />
      </div>
    );
  }
}

export default DetailVideoPage;
