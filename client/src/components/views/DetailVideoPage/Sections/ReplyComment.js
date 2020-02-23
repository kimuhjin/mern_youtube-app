import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [View, setView] = useState(false);
  const handleChange = () => {
    setView(!View); // 댓글 더보기 토글
  };
  useEffect(() => {
    let commentNumber = 0;
    props.CommentLists.map(comment => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      } // 현재 comment의 responseTo와 상위 parentCommnetId가 같다면 (상위 댓글의 _id와 하위 댓글의 responseTo가 같다면),
      //commnetNumber를 1씩 증가 시켜 대댓글 갯수를 파악한다.
    });
    setChildCommentNumber(commentNumber);
  }, [props.CommentLists, props.parentCommentId]);
  // useEffect를 사용할때, 두번째 파라미터 값 []을 공백으로 두면, DOM이 처음 렌더링 될 때만 실행 되는데,
  // []에 해당 값을 넣어주면, []에 해당 되는 값이 변경 될 때마다 실행 되게 된다.
  // 그러므로 지금 코드에선 CommentLists가 변경되면 commnetNumber가 증가 하게 되고, 이에 따라 return의 p태그가 실행 되게 된다.

  let renderReplyComment = parentCommentId =>
    props.CommentLists.map((comment, index) => (
      <React.Fragment>
        {comment.responseTo === parentCommentId && ( //상위 댓글의 _id와 하위 댓글의 responseTo가 같을 경우에만 화면에 렌더링
          <div style={{ marginLeft: "40px", width: "80%" }}>
            <SingleComment
              comment={comment}
              postId={props.postId}
              refreshFunction={props.refreshFunction}
            />
            <ReplyComment
              CommentLists={props.CommentLists}
              postId={props.postId}
              refreshFunction={props.refreshFunction}
              parentCommentId={comment._id}
            />
          </div>
        )}
      </React.Fragment>
    ));

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <span
          style={{ fontSize: "12px", margin: 0, color: "gray" }}
          onClick={handleChange}
          key="comment-basic-reply-to"
          cursor="pointer"
        >
          {ChildCommentNumber}개 댓글 더보기
        </span>
      )}
      {View && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

/* variable을 실행 할 때는 '{ }', 컴포넌트를 실행 할 떄는 '< />' */

export default ReplyComment;
