import { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const GeneralChat = ({ ChatModel, func, msg, funcSub, dt }: any) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        margin: "5px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h4>{ChatModel}</h4>
      <form onSubmit={funcSub}>
        <div className="mb-3">
          <label htmlFor="question" className="form-label">
            Query
          </label>

          <textarea
            className="form-control"
            id="question"
            rows={7}
            placeholder="Enter your query here"
            value={msg}
            onChange={(e) => func(e.target.value)}
            style={{ width: "45vw" }}
          ></textarea>

          <div className="d-flex ">
            <button
              type="submit"
              className="btn btn-primary btn-lg mb-3 mt-3  ms-auto pt-0 pt-md-1"
            >
              Send
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="answer" className="form-label">
            Answer
          </label>
          <textarea
            className="form-control"
            id="answer"
            rows={7}
            value={dt}
            readOnly={true}
            style={{ width: "45vw" }}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

function General() {
  const [message, setMessage] = useState("");
  const [medictronMessage, setMedictronMessage] = useState("");
  const [data, setData] = useState("");
  const [medictronData, setMedictronData] = useState("");

  let temp_data = "";

  const removeContent = (text: string) => {
    return text.replace(/content='/g, "");
  };
  const removeMedictronContent = (text: string) => {
    return text.replace(/<|im_start|>system/g, "");
  };

  const postMessage = async (
    message: any,
    url: any,
    setData: any,
    removeContent: any
  ) => {
    try {
      fetchEventSource(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        openWhenHidden: true,
        body: JSON.stringify({
          message: message,
        }),
        onmessage(ev) {
          console.log(ev.data);
          temp_data += removeContent(String(ev.data));
          console.log(temp_data);
          setData(temp_data);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    postMessage(message, "http://localhost:8000/chat", setData, removeContent);
  };
  const handleMedictronSubmit = (event: any) => {
    event.preventDefault();
    postMessage(
      medictronMessage,
      "http://localhost:8000/medictron-chat",
      setMedictronData,
      removeMedictronContent
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        margin: "5px",
        backgroundColor: "#ffd23f",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GeneralChat
        ChatModel="Gemini Pro"
        func={setMessage}
        msg={message}
        funcSub={handleSubmit}
        dt={data}
      />
      <GeneralChat
        ChatModel="Medictron 0.5B"
        func={setMedictronMessage}
        msg={medictronMessage}
        funcSub={handleMedictronSubmit}
        dt={medictronData}
      />
    </div>
  );
}

export default General;
