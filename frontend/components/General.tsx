import { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

function General() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState("");

  let temp_data = "";

  const removeContent = (text: string) => {
    return text.replace(/content='/g, "");
  };

  const postMessage = async (message: any) => {
    try {
      fetchEventSource("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    postMessage(message);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        margin: "5px",
        backgroundColor: "#ffd23f",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="question" className="form-label">
            Query
          </label>

          <textarea
            className="form-control me-lg-5 mt-lg-2 mb-lg-2"
            id="question"
            rows={5}
            placeholder="Enter your query here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "90vw" }}
          ></textarea>
          <div className="d-flex ">
            <button
              type="submit"
              className="btn btn-primary btn-lg mb-3 mt-3 me-lg-5 ms-auto"
              style={{ paddingTop: "0px" }}
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
            className="form-control me-lg-5 mt-lg-2 mb-lg-2"
            id="answer"
            rows={5}
            value={data}
            readOnly={true}
            style={{ width: "90vw" }}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default General;
