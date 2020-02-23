import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";

function SingleComment(props) {
  const user = useSelector(state => state.user); // 리덕스 스토어에서 현재 스토어 상태값에 저장되어 있는 데이터 가져오기.
  const [CommentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false);
  const handleChange = e => {
    setCommentValue(e.currentTarget.value);
  };
  const openReply = () => {
    setOpenReply(!OpenReply);
  };
  const onSubmit = e => {
    e.preventDefault();
    const variables = {
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
      content: CommentValue
    };
    Axios.post("/api/comment/saveComment", variables).then(response => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue("");
        setOpenReply(!OpenReply);
        props.refreshFunction(response.data.result);
      } else {
        alert("Failed to save comment");
      }
    });
  };

  const action = [
    <LikeDislikes
      comment
      commentId={props.comment._id}
      userId={localStorage.getItem("userId")}
    />,
    <span onClick={openReply} key="comment-basic-reply-to">
      대댓글 달기
    </span>
  ];
  return (
    <div>
      <Comment
        actions={action}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      ></Comment>

      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: "flex%", borderRadius: "5px" }}
            onChange={handleChange}
            value={CommentValue}
            placeholder="댓글을 입력하세요."
          />
          <br />
          &nbsp;&nbsp;
          <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            전송
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
