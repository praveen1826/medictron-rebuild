import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";

interface Attributes {
  Gender: number;
  Hemoglobin: number;
  MCH: number;
  MCHC: number;
  MCV: number;
}

type Props = {
  attribute: any;
  value: any;
  handleInputChange: (event: any) => void;
};

const FormItem: React.FC<Props> = ({ attribute, value, handleInputChange }) => {
  return (
    <div className="col-lg-4 d-flex flex-row justify-content-center align-items-center mb-2">
      <label
        htmlFor={attribute}
        className="form-label mb-0"
        style={{ marginRight: "5px" }}
      >
        {attribute}
      </label>
      <input
        type="text"
        className="form-control"
        id={attribute}
        name={attribute}
        placeholder={attribute}
        defaultValue={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

function Anemia() {
  const [attributes, setAttributes] = useState<Attributes>({
    Gender: 0,
    Hemoglobin: 14.8,
    MCH: 28.5,
    MCHC: 32.6,
    MCV: 87.3,
  });
  const [data, setData] = useState("");

  const removeContent = (text: string) => {
    return text.replace(/content="/g, "");
  };

  const postMessage = async (formData: any) => {
    let temp_data = "";
    try {
      await fetchEventSource("http://localhost:8000/anemia", {
        method: "Post",
        body: formData,
        openWhenHidden: true,
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

  const postDirectResult = (formData: any) => {
    try {
      fetchEventSource("http://localhost:8000/anemia-direct", {
        method: "POST",
        openWhenHidden: true,
        body: formData,
        onmessage(ev) {
          console.log(ev.data);
          setData(ev.data);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: any) => {
    setAttributes({ ...attributes, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let formData = new FormData();
    for (let key in attributes) {
      formData.append(key, String(attributes[key as keyof Attributes]));
    }
    console.log(formData);
    postMessage(formData);
  };

  const handleDirectResult = (e: any) => {
    e.preventDefault();
    let formData = new FormData();
    for (let key in attributes) {
      formData.append(key, String(attributes[key as keyof Attributes]));
    }
    console.log(formData);
    postDirectResult(formData);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFC7C7",
        flexGrow: 1,
        margin: "5px",
      }}
    >
      <form
        className="d-flex flex-column flex-wrap"
        style={{ width: "95vw" }}
        onSubmit={handleSubmit}
      >
        <div className="row gx-3 p-3 pb-0 ">
          {Object.entries(attributes).map((item, index) => (
            <FormItem
              key={index}
              attribute={item[0]}
              value={item[1]}
              handleInputChange={handleInputChange}
            />
          ))}
        </div>

        <div className="d-flex ms-auto">
          <button
            type="button"
            className="btn btn-primary m-3 ms-auto pt-0 pt-md-1"
            onClick={handleDirectResult}
          >
            Direct Result
          </button>
          <button
            type="submit"
            className="btn btn-primary m-3 ms-auto pt-0 pt-md-1"
          >
            Send
          </button>
        </div>
      </form>
      <div className="mb-3">
        <label htmlFor="answer" className="form-label">
          Answer
        </label>
        <textarea
          className="form-control"
          id="answer"
          rows={5}
          value={data}
          readOnly={true}
          style={{ width: "92vw" }}
        ></textarea>
      </div>
    </div>
  );
}

export default Anemia;
