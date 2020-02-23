const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    }
  },
  { timestamps: true }
); // 자동으로 App value를 Update or Create 한다.;

const Like = mongoose.model("Like", likeSchema);

module.exports = { Like };
