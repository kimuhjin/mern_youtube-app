const express = require("express");
const router = express.Router();
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg"); //썸네일 생성 라이브러리
const { User } = require("../models/User");
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");

//==============================//
//             User             //
//==============================//
//요청객체 req와 응답객체 res는 express.js 라우트의 속성이다.
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/"); // 최상위 디렉토리의 uploads폴더에 업로드한 file들이 저장된다.
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    // .mp4확장자의 파일만 업로드 할 수 있다.
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only mp4 file is allowed "), false);
    }
    cb(null, true);
  }
});

var upload = multer({ storage: storage }).single("file"); // .single('file')을 붙여, 한 번에 파일 하나씩만 upload 할 수 있게한다.

router.post("/uploadfiles", (req, res) => {
  // server/index.js 파일에 미리 server/routes/video.js의 정보를 등록했기 때문에
  // router.post의 경로를 /api/video/uploadfile이 아닌 /uploadfiles만 써도 된다.
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err });
      //만약 에러가 난다면 success: false를 json형식으로 response해준다.
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename
    });
  });
});

router.post("/thumbnail", (req, res) => {
  //Client UploadVideoPage의 Axios.post /api/video/thumbnail과 연결 된다.
  let thumbsFilePath = "";
  let fileDuration = ""; //thumbsFilePath와 fileDuration은 재할당이 가능한 let scope에 저장.

  ffmpeg.ffprobe(req.body.filePath, function(err, metadata) {
    console.dir(metadata); //console.'dir'로 객체의 속성, 메서드를 출력한다.
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.filePath)
    .on("filenames", function(filenames) {
      console.log("Will generate" + filenames.join(", ")); //.join을 사용하여 복수의 filenames사이를 ','를 사용하여 연결시켜 하나의 값으로 만든다.
      thumbsFilePath = "uploads/thumbnails/" + filenames[0]; //썸네일의 파일경로를 'uploads/...' + 생성된 캡쳐파일중 0번째 위치한 파일로 설정.
    })
    .on("end", function() {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration
      });
    })
    .screenshots({
      count: 3, //스크린샷 캡쳐횟수
      folder: "uploads/thumbnails", //지정경로
      size: "320x240", //이미지 사이즈
      filename: "thumbnail-%b.png" //%b 디렉토리명을 제외한 파일이름의 문자열
    });
});

router.get("/getVideos", (req, res) => {
  // 영상 데이터들을 렌딩페이지에서 렌더링 할 수 있게, DB에서 데이터를 가져옴.
  Video.find() // Video컬렉션의 모든 데이터를 검색
    .populate("writer") // writer의 아바타, 이름등 모든 정보를 가져옴
    .exec((err, videos) => {
      if (err) return res.status(400).end(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body); //new를 통해 새로운 객체로 생성한다.
  //req.body는 POST 방식으로 넘어오는 파라미터를 담고있다. HTTP의 BODY 부분에 담겨져있는데, 이 부분을 파싱하기 위해 body-parser와 같은 패키지가 필요하다.
  video.save((err, video) => {
    //video를 .save를 통해 저장한다.
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({
      success: true
    });
  });
});

router.post("/getVideo", (req, res) => {
  //DetailPage에서
  Video.findOne({ _id: req.body.videoId }) // Video DB에서 한가지 정보만 찾을 땐 '.findOne'을 사용한다. '_id'의 정보를 DetailPage에서 요청한 videoId에 담아준다.
    .populate("writer") // writer 하위 정보도 응답
    .exec((err, video) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, video }); // 담아온 정보를 video 변수에 담아 status 200이면 success: true와 함께 응답해준다.
    });
});

module.exports = router;
