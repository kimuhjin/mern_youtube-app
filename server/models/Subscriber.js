const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: "User" // 'User' 스키마에 있는 모든 데이터를 가져온다.
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
); // 자동으로 App value를 Update or Create 한다.;

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = { Subscriber };
