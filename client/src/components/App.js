import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import UploadVideoPage from "./views/UploadVideoPage/UploadVideoPage";
import DetailVideoPage from "./views/DetailVideoPage/DetailVideoPage";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          {/* URL 주소창에 보여지는 주소 (ex: localhost:3000/register) */}
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/video/upload"
            component={Auth(UploadVideoPage, true)}
            // 'path'는 url주소이다.(ex.localhost:3000/video/upload)
            // 'Auth' 두번째 파라미터 값 'null'은 인증절차 없이 누구나 접속 할 수 '있다'.
            // 'Auth' 두번째 파라미터 값 'true'는 로그인한 유저만 접속 할 수 '있다'.
            // 'Auth' 두번째 파라미터 값 'false'는 로그인한 유저만 접속 할 수 '없다'.
            // << Routh를 통해 UploadVideoPage의 경로를 만들어주고, 인증 여부 설정을 해준다. >>
          />
          <Route
            exact
            path="/video/:videoId" // path중 ':'를 붙이면 해당 쿼리값이 들어가게된다.
            component={Auth(DetailVideoPage, null)}
          />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
