import React, { useEffect, useState } from "react";
import { Typography, Form, Button, Input, Icon, message } from "antd";
import Dropzone from "react-dropzone"; //Dropzone, File을 drag&drop하여 upload해주는 Library.
import Axios from "axios";
import { useSelector } from "react-redux"; //리덕스 스토어의 상태에 접근하기 위한 Hook.

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" }
];

const Catogory = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: "Music" },
  { value: 0, label: "Pets & Animals" },
  { value: 0, label: "Sports" }
];

function UploadVideoPage(props) {
  const user = useSelector(state => state.user); //현재 리덕스 스토어의 user 상태에 접근.
  //---------------------------상태값--------------------------------//
  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Privacy, setPrivacy] = useState(0);
  //Privacy를 0, Public을 1로 설정한다.
  const [Catogories, setCatogories] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState("");
  //----------------------------------------------------------------//

  //-------------------------handleChange---------------------------//
  const handleChangeTitle = event => {
    // 'title' Input의 값을 event.currentTarget.value으로 받아와 settitle에 넣어 상태값을 바꿔준다.
    setTitle(event.currentTarget.value);
  };

  const handleChangeDecsription = event => {
    // 'Description' Input의 값을 event.currentTarget.value으로 받아와 setDescription에 넣어 상태값을 바꿔준다.
    setDescription(event.currentTarget.value);
  };

  const handleChangeOne = event => {
    // select 값도 event.currentTarget.value로 받아온다.
    setPrivacy(event.currentTarget.value);
  };
  const handleChangeTwo = event => {
    setCatogories(event.currentTarget.value);
  };

  const onSubmit = event => {
    event.preventDefault(); // submit같은 동작을 할 때, 페이지 전체가 새로고침 되면 안되기 때문에 꼭 preventDefault를 통해 브라우져 기본동작을 통제한다.
    if (user.userData && !user.userData.isAuth) {
      // useSeletor의 리덕스 스토어를 통해 state중 isAuth(로그인상태)를 확인하여, 비로그인 상태에서 업로드를 방지한다.
      return alert("로그인 후 이용 가능합니다.");
    }
    if (
      // 입력항목이 하나라도 비어있을경우 업로드 불가.
      title === "" ||
      Description === "" ||
      Catogories === "" ||
      FilePath === "" ||
      Duration === "" ||
      Thumbnail === ""
    ) {
      return alert("항목이 입력되지 않았습니다.");
    }

    const variables = {
      writer: user.userData._id,
      title: title,
      description: Description,
      privacy: Privacy,
      filePath: FilePath,
      category: Catogories,
      duration: Duration,
      thumbnail: Thumbnail
    };
    Axios.post("/api/video/uploadVideo", variables) // Axios.post를 통해 server/routes/video의 router.post('/uploadVideo')에 variables를 전송.
      .then(response => {
        if (response.data.success) {
          alert("Video Uploaded Successfully");
          props.history.push("/"); //Axios.post를 하고나면 '/' 최상위경로, 홈화면으로 이동.
        } else {
          alert("Failed to upload video");
        }
      });
  };
  //----------------------------------------------------------------//

  //--------------------Dropzone의 onDrop function------------------//
  const onDrop = files => {
    let formData = new FormData(); // new를 통해 새로운 객체를 만든 후에 이를 리턴한다. 함수에 new를 붙이면 객체가 된다.
    const config = {
      header: { "content-type": "multipart/form-data" }
    };
    console.log(files);
    formData.append("file", files[0]); // append를 통해 data끝에 새로운 콘텐츠를 추가한다.
    Axios.post("/api/video/uploadfiles", formData, config) //Axios.post를 통해 "/api/video/uploadfiles"에 formData와 config를 전송한다.
      // "/api/video/uploadfiles"는 server/routes/users.js파일에 있음
      .then(response => {
        if (response.data.success) {
          //response한 데이터의 data.success가 success일 때,
          // router.post에서 filePath와 fileName을 넘겨준다.
          let variable = {
            filePath: response.data.filePath,
            fileName: response.data.fileName
          };
          setFilePath(response.data.filePath);
          //-------------------썸네일 생성-------------------------//
          Axios.post("/api/video/thumbnail", variable) // '/api/video/thumbnail router로 부터 filePath와 Name을 가지고 axios post요청을 한다
            .then(response => {
              if (response.data.success) {
                setDuration(response.data.fileDuration);
                setThumbnail(response.data.thumbsFilePath); // 리스폰이 성공적으로 이뤄지면 Duration과 Thumbnail Data값이 설정된다.
              } else {
                alert("Failed to save the video in server");
              }
            });
          //-----------------------------------------------------//
        } else {
          //response한 데이터의 data.success가 success가 아니면,
          alert("failed to save the video in server");
        }
      }); //server에서 처리하고 response를 통해 피드백을 한다.
  };

  //----------------------------------------------------------------//
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> 비디오 업로드 </Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropzone
            onDrop={onDrop} //UpLoad한 File을 Server에 보내는 function
            multiple={false}
            maxSize={800000000}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/* 썸네일 이미지 */}
          {Thumbnail !== "" && (
            <div>
              <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
              {/* Thumbnail은 server/uploads/thumbnails 디렉토리의 현재 동영상 캡쳐파일이다.*/}
            </div>
          )}
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input
          onChange={handleChangeTitle} //handleChangeTile function이 Trigger가 된다.
          //Input창에 text를 넣고 Enter를 누르면 onChange={handleChangeTitle}이 실행 됨.
          value={title}
        />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={handleChangeDecsription} value={Description} />
        <br />
        <br />

        {/* Private Select  */}
        <select onChange={handleChangeOne}>
          {Private.map((item, index) => (
            //위의 Private 배열의 값을 map해와서 option에 넣는다.
            //map 할 때 첫번째 인자값을 item으로 받아오고, option의 이름을 item.label로 받아와 화면에 출력한다.
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        {/* Catogory Select  */}
        <select onChange={handleChangeTwo}>
          {Catogory.map((item, index) => (
            //위의 Private 배열의 값을 map해와서 option에 넣는다.
            //map 할 때 첫번째 인자값을 item으로 받아오고, option의 이름을 item.label로 받아와 화면에 출력한다.
            <option key={index} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          {/* onClick을 했을 때 onsubmit을 동작하게 하고, Form의 onSubmit이 동작되게 된다.  */}
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideoPage;
