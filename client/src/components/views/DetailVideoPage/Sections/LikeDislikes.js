import React, { useState, useEffect } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variable = {}; // variable을 빈 객체로 생성하고, 아래의 if문에 따라 해당 객체데이터를 저장한다. 항상 변할 수 있으니 let으로 할당 한다.
  if (props.video) {
    // variable이 두가지로 나뉠 수 있는데, props를 video로 받았을 때 (영상에관련된 좋아요/싫어요 버튼을 누를때) 아래의 variable 객체로 받고,
    variable = { videoId: props.videoOd, userId: props.userId };
  } else {
    //props를 video가 아닌 다른것 (comment)로 받았을 땐, 아래의 객체를 variable에 저장한다.
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    /// 좋아요 ///
    Axios.post("/api/like/getLikes", variable).then(response => {
      // server/routes/
      if (response.data.success) {
        // 비디오 혹은 댓글의 좋아요,싫어요 갯수
        setLikes(response.data.likes.length);

        // 좋아요 혹은 싫어요를 눌렀는지 판단
        response.data.likes.map(like => {
          if (like.userId === props.userId) {
            //like를 누른 유저와 현재 유저가 같을 경우 (현재 로그인한 유저가 누른 경우)
            setLikeAction("liked");
          }
        });
      } else {
        alert("Failed to get likes");
      }
    });
    /// 싫어요 ///
    Axios.post("/api/like/getDislikes", variable).then(response => {
      // server/routes/
      if (response.data.success) {
        // 비디오 혹은 댓글의 좋아요,싫어요 갯수
        setDislikes(response.data.dislikes.length);

        // 좋아요 혹은 싫어요를 눌렀는지 판단
        response.data.dislikes.map(dislike => {
          if (dislike.userId === props.userId) {
            //like를 누른 유저와 현재 유저가 같을 경우 (현재 로그인한 유저가 누른 경우)
            setDislikeAction("disliked");
          }
        });
      } else {
        alert("Failed to get dislikes");
      }
    });
  }, []);

  const onLike = () => {
    if (LikeAction === null) {
      // onlike를 누를 때, 좋아요 버튼이 안 눌려 있다면, Likes를 1 증가시키고, setlikeAction을 'liked'로 바꿔 아이콘을 채우고,
      // DisLikeAction을 'null'로 바꿔 싫어요 아이콘을 비운뒤, Dislikes를 1 감소시긴다.
      // routes에선 해당 variable의 Like 새 객체를 추가 하고, 해당 variable의 Dislike객체를 삭제한다.
      Axios.post("/api/like/upLike", variable).then(response => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked"); // 좋아요 아이콘 채우기
          // 만약 싫어요 버튼이 이미 눌려있다면
          if (DislikeAction !== null) {
            setDislikeAction(null); // null과 ' null'은 다른 값이다.
            setDislikes(Dislikes - 1);
          }
        } else alert("Failed to increase the like");
      });
    } else {
      // 만약 이미 눌려있다면, Likes를 1 감소 시키고, 좋아요 아이콘을 비운다(null).
      // routes에선 해당 variable의 Like 객체만 삭제한다.
      Axios.post("/api/like/unLike", variable).then(response => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null); // 좋아요 아이콘 비우기
        } else alert("Failed to decrease the like");
      });
    }
  };

  const onDisLike = () => {
    if (DislikeAction !== null) {
      Axios.post("/api/like/unDisLike", variable).then(response => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null); // 싫어요 아이콘 비우기
        } else {
          alert("Failed to decrease the Dislike");
        }
      });
    } else {
      Axios.post("/api/like/upDisLike", variable).then(response => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction("disliked"); // 좋아요 아이콘 비우기
          // 만약 싫어요 버튼이 이미 눌려있다면
          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("Failed to increase the Dislike");
        }
      });
    }
  };

  return (
    <React.Fragment>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"} // 위 likeAction값에 따라 아이콘 채움 혹은 비움 설정
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Dislikes}</span>
      </span>
    </React.Fragment>
  );
}

export default LikeDislikes;
