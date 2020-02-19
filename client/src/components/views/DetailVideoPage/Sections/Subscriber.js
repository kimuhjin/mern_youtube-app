import React, { useEffect, useState } from "react";
import Axios from "axios";
import { set } from "mongoose";
function Subscriber(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  const userTo = props.userTo; // props로 받은 값을 사용하려면 props.XXX로 새로운 변수에 저장하여 사용한다.
  const userFrom = props.userFrom;

  let subscribeVariables = {
    userTo: userTo,
    userFrom: userFrom
  };

  const onSubscribe = () => {
    if (Subscribed) {
      Axios.post("/api/subscribe/unSubscribe", subscribeVariables).then(
        response => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1); // 구독자 Number - 1
            setSubscribed(!Subscribed); // 구독자 상태 반전
          } else {
            alert("Failed to unSubscribe");
          }
        }
      );
    } else {
      Axios.post("/api/subscribe/subscribe", subscribeVariables).then(
        response => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1); // 구독자 Number + 1
            setSubscribed(!Subscribed); // 구독자 상태 반전
          } else {
            alert("Failed to subscribe");
          }
        }
      );
    }
  };
  useEffect(() => {
    const subscribeNumberVariables = {
      userTo: userTo,
      userFrom: userFrom
    };
    Axios.post("/api/subscribe/subscribeNumber", subscribeNumberVariables).then(
      response => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber);
        } else {
          alert("Failed to get Subscribe Nubmer");
        }
      }
    );
    Axios.post("/api/subscribe/subscribed", subscribeNumberVariables).then(
      response => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert("Failed to get subscribed state");
        }
      }
    );
  }, []);

  return (
    <div>
      <button
        onClick={onSubscribe}
        style={{
          backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: "6px 14px", // 10px => 상하, 16px => 좌우.
          fontWeight: "500",
          fontSize: "0.9rem",
          textTransform: "uppercase"
        }}
      >
        {Subscribed ? `${SubscribeNumber}` : null}{" "}
        {Subscribed ? "Subscribed" : "Subcribe"}
      </button>
    </div>
  );
}

export default Subscriber;
