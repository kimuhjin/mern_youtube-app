const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");
const { auth } = require("../middleware/auth");

//=================================
//             Comment
//=================================
// 새로운 Routes를 만들면 반드시 server/index.js에서 app.use('')에 api경로와 require경로를 추가 해줘야 한다.

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });
    Comment.find({ _id: comment._id }) // Comment models에서 .find를 통해 위에 저장한 '_id'와 동일한 값을 가진 comment._id를 찾는다.
      .populate("writer") // 위에서 _id로 찾은 데이터들을 writer에 저장하여 보여준다.
      //ex.
      //(writer:
      //email:''
      //password:'')

      .exec((err, result) => {
        //comment save한 데이터를 'result'에 넣는다.
        if (err) return res.json({ success: false });
        return res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComments", (req, res) => {
  Comment.find({ postId: req.body.videoId }) // Comment Model에서 videoId로 검색해서 해당되는 데이터를,
    .populate("writer") // writer라는 이름으로 보여준다.
    .exec((err, comments) => {
      // 해당 데이터를 comments변수에 넣어서,
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments }); // status가 200이면 {success: true}와 함께 comments 데이터를 보내준다.
    });
});

module.exports = router;
