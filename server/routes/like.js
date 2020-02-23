const express = require("express");
const router = express.Router();
const { Like } = require("../models/Like"); // 필요한 models의 정보를 require해준다.
const { Dislike } = require("../models/Dislike");
const { auth } = require("../middleware/auth");

// /server/ index.js에 app.use("/api/like", require("./routes/like"))를 추가해주면,
// 밑 routes.post('/getLike')의 상위 경로인 /like를 자동으로 추가해준다.

//=================================
//             Likes DisLikes
//=================================
router.post("/getLikes", (req, res) => {
  let variable = {}; // LikeDislikes와 같이 variable을 let으로 만들어준뒤,
  if (req.body.videoId) {
    // 만약 req.body.videoId면 variable에 videoId 객체를 저장
    variable = { videoId: req.body.videoId };
  } else {
    // 만약 req.body.commentId면 variable에 commentId 객체를 저장
    variable = { commentId: req.body.commentId };
  }

  Like.find(variable).exec((err, likes) => {
    // /models/Like에서 videoId 혹은 commentId를 찾는다면 likes에 받아서 Axios쪽으로 전송해준다.
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, likes });
  });
});

router.post("/getDislikes", (req, res) => {
  let variable = {}; // LikeDislikes와 같이 variable을 let으로 만들어준뒤,
  if (req.body.videoId) {
    // 만약 req.body.videoId면 variable에 videoId 객체를 저장
    variable = { videoId: req.body.videoId };
  } else {
    // 만약 req.body.commentId면 variable에 commentId 객체를 저장
    variable = { commentId: req.body.commentId };
  }

  Dislike.find(variable).exec((err, dislikes) => {
    // /models/Like에서 videoId 혹은 commentId를 찾는다면 likes에 받아서 Axios쪽으로 전송해준다.
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, dislikes });
  });
});

router.post("/upLike", (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }
  const like = new Like(variable);
  // Mongo DB에 좋아요 관련 데이터 저장
  like.save((err, likeResult) => {
    // like객체를 저장한다. (좋아요 갯수는 like객체 수로 판단한다.)
    if (err) return res.json({ success: false, err });
    //만약 싫어요 버튼이 눌려있다면, 싫어요 갯수 1개 줄인다.
    Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      //Dislike models에서 variable과 같은 값을 조회 한 후 삭제한다.
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

router.post("/unLike", (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }
  Like.findOneAndDelete(variable).exec((err, result) => {
    // variable에 해당 되는 Like객체 삭제
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/unDisLike", (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }
  Dislike.findOneAndDelete(variable).exec((err, result) => {
    // variable에 해당 되는 Like객체 삭제
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/upDisLike", (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }
  const disLike = new Dislike(variable);
  // Mongo DB에 좋아요 관련 데이터 저장
  disLike.save((err, dislikeResult) => {
    // like객체를 저장한다. (좋아요 갯수는 like객체 수로 판단한다.)
    if (err) return res.json({ success: false, err });
    //만약 싫어요 버튼이 눌려있다면, 싫어요 갯수 1개 줄인다.
    Like.findOneAndDelete(variable).exec((err, likeResult) => {
      //Dislike models에서 variable과 같은 값을 조회 한 후 삭제한다.
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});
module.exports = router;
