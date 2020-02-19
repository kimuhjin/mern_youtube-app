const express = require("express");
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================

router.post("/subscribeNumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, subscribeNumber: subscribe.length });
    //subscribeNumber를 받을 때 DB에 userTo에 해당되는 user들의 수를 전달하면 되기 때문에, subscribe.length를 이용하여 배열의 등록된 수 만큼을 전달한다.
  });
});

router.post("/subscribed", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo, userFrom: req.body.userTo }).exec(
    (err, subscribe) => {
      if (err) return res.status(400).send(err);

      let result = false; // 현재 유저가 구독을 하고 있는지 판단하기 위한 장치
      /*userFrom이 userTo의 구독자라면 Document가 있을것이고, 만약에 구독자가 아니라면 아무런 Document도 없으니,
       subscribe.length가 0 이라면 false, 0이 아니라면 true로 받아와 구독자인지 판단한다.*/
      if (subscribe.length !== 0) {
        result = true;
      }
      res.status(200).json({ success: true, subscribed: result });
      //subscribed를 result(T/F)로 리턴함.
    }
  );
});

router.post("/subscribe", (req, res) => {
  const subscribe = new Subscriber(req.body); // new를 통해 subscribe 인스턴스를 만들어준다.
  subscribe.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/unSubscribe", (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom
  })
    //findOneAndDelete를 통해 userTo와 userFrom이 존재하는 도큐먼트의 자료를 삭제한다.
    .exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, doc });
    });
});

module.exports = router;
