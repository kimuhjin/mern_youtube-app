const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    responseTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      type: String
    }
  },
  { timestamps: true }
); // 자동으로 App value를 Update or Create 한다.;

const Comment = mongoose.model("Subscriber", commentSchema);

module.exports = { Comment };
