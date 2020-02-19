import React, { useState } from "react";
import { Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
const { TextArea } = Input;

function Comments() {
  const user = useSelector(state => state.user); //useSelector(state)를 통해 현재 state에 접근하고,(state=>state.user)를 통해 state안의 user에 접근한다.
  const [Comment, setComment] = useState("");

  const handleChange = e => {
    // event를 다룰 때는 항상 e를 props로 전달 해줘야한다.
    setComment(e.currentTarget.value); //e.currentTarget.value는 현재 입력중인 text를 받아온다.
  };
  const onSubmit = e => {
    e.preventDefault(); // Submit버튼이 동작한 뒤, 브라우져가 새로고침 되는 것을 방지 하기 위해, 꼭 e.preventDefault를 해준다.
    const variables = {
      content: Comment,
      writer: user.userData._id // 현재 브라우져의 user데이터를 가져오려면 useSelector를 통해 리덕스 스토어에 접근하고, 위 user로 받아와 그 안의 _id에 접근한다.
    };
    Axios.post("/api/comment/saveCommnet", variables); //onSubmit이 실행 되면, variables에 들어있는 데이터를 가지고 해당 api 주소로 post해준다.
  };
  return (
    <div>
      <br />
      <p>댓글</p>
      {/* 댓글 모음 */}
      {/* 최상위 댓글 폼 */}
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: "90%", borderRadius: "5px" }}
          onChange={handleChange}
          value={Comment} // TextArea의 value값은 e.currentTarget.value가 된다.
          placeholder="댓글을 입력해주세요"
        />
        <br />
        &nbsp;&nbsp;
        <Button style={{ width: "15%", height: "52px" }}>전송</Button>
      </form>
    </div>
  );
}

export default Comments;
