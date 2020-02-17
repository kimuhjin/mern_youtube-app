const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId, //ObjectId를 통해 User 스키마에 있는 모든 데이터를 가져온다.
      ref: "User"
    },
    title: {
      type: String,
      maxlength: 50
    },
    description: {
      type: String
    },
    privacy: {
      type: Number // UploadVideoPage에서 0,1로 할당하여, Number로 지정.
    },
    filePath: {
      type: String
    },
    category: String,
    views: {
      type: Number,
      default: 0
    },
    duration: {
      type: String
    },
    thumbnail: {
      type: String
    }
  },
  { timestamps: true } // 자동으로 App value를 Update or Create 한다.
);

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video };
