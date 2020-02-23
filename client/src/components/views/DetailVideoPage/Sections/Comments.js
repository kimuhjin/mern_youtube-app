import React, { useState } from "react";
import { Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";
const { TextArea } = Input;

function Comments(props) {
  const user = useSelector(state => state.user); //useSelector(state)를 통해 현재 state에 접근하고,(state=>state.user)를 통해 state안의 user에 접근한다.
  const [Comment, setComment] = useState("");

  const handleChange = e => {
    // event를 다룰 때는 항상 e를 파라미터로 전달 해줘야한다.
    setComment(e.currentTarget.value); //e.currentTarget.value는 현재 입력중인 text를 받아온다.
  };
  const onSubmit = e => {
    e.preventDefault(); // Submit버튼이 동작한 뒤, 브라우져가 새로고침 되는 것을 방지 하기 위해, 꼭 e.preventDefault를 해준다.
    const variables = {
      content: Comment,
      writer: user.userData._id, // 현재 브라우져의 user데이터를 가져오려면 useSelector를 통해 리덕스 스토어에 접근하고, 위 user로 받아와 그 안의 _id에 접근한다.
      postId: props.postId
    };
    Axios.post("/api/comment/saveComment", variables) //onSubmit이 실행 되면, variables에 들어있는 데이터를 가지고 해당 api 주소로 post해준다.
      .then(response => {
        if (response.data.success) {
          setComment(""); // empty value로 초기화 해준다.
          props.refreshFunction(response.data.result); // save한 데이터를 부모 컨포넌트로 Update하기 위해서,
          //props로 받아온 refreshFunction에 route에서 받아온 result값을 넘겨준다.
        } else {
          alert("Failed to save Comment");
        }
      });
  };
  return (
    <div>
      <br />
      <p>댓글</p>
      <hr />
      {/* 댓글 모음 */}
      {console.log(props.CommentLists)}
      {props.CommentLists && // DetailVideoPage에서 props로 받아온 CommentLists가 존재하면 <SingleComment/>를 실행한다.
        props.CommentLists.map(
          (comment, index) =>
            !comment.responseTo && ( // 상위 위치의 댓글에는 responseTo라는 스키마 데이터가 없기때문에, 이것의 유무로 상,하위 위치의 댓글을 판단한다.
              <React.Fragment>
                <SingleComment
                  comment={comment}
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  CommentLists={props.CommentLists} //ReplyComment에 필요한 Props들을 넘겨준다.
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                  parentCommentId={comment._id}
                />
              </React.Fragment>
            )
        )}
      {/* 최상위 댓글 폼 */}
      <hr />
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: "90%", borderRadius: "5px" }}
          onChange={handleChange}
          value={Comment} // TextArea의 value값은 e.currentTarget.value가 된다.
          placeholder="댓글을 입력해주세요"
        />
        <br />
        &nbsp;&nbsp;
        <Button style={{ width: "15%", height: "52px" }} onClick={onSubmit}>
          전송
        </Button>
      </form>
    </div>
  );
}

export default Comments;
