import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";

interface VoiceAttributes {
  MDVP_Fo_Hz: number;
  MDVP_Fhi_Hz: number;
  MDVP_Flo_Hz: number;
  MDVP_Jitter_Percent: number;
  MDVP_Jitter_Abs: number;
  MDVP_RAP: number;
  MDVP_PPQ: number;
  Jitter_DDP: number;
  MDVP_Shimmer: number;
  MDVP_Shimmer_dB: number;
  Shimmer_APQ3: number;
  Shimmer_APQ5: number;
  MDVP_APQ: number;
  Shimmer_DDA: number;
  NHR: number;
  HNR: number;
  RPDE: number;
  DFA: number;
  spread1: number;
  spread2: number;
  D2: number;
  PPE: number;
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

function Parkinson() {
  const [attributes, setAttributes] = useState<VoiceAttributes>({
    MDVP_Fo_Hz: 119.992,
    MDVP_Fhi_Hz: 157.302,
    MDVP_Flo_Hz: 74.997,
    MDVP_Jitter_Percent: 0.00784,
    MDVP_Jitter_Abs: 0.00007,
    MDVP_RAP: 0.0037,
    MDVP_PPQ: 0.00554,
    Jitter_DDP: 0.01109,
    MDVP_Shimmer: 0.04374,
    MDVP_Shimmer_dB: 0.426,
    Shimmer_APQ3: 0.02182,
    Shimmer_APQ5: 0.0313,
    MDVP_APQ: 0.02971,
    Shimmer_DDA: 0.06545,
    NHR: 0.02211,
    HNR: 21.033,
    RPDE: 0.414783,
    DFA: 0.815285,
    spread1: -4.813031,
    spread2: 0.266482,
    D2: 2.301442,
    PPE: 0.284654,
  });
  const [data, setData] = useState("");

  // console.log(attributesArray);

  const postMessage = async (formData: any) => {
    try {
      await fetchEventSource("http://localhost:8000/parkinson", {
        method: "Post",
        body: formData,
        openWhenHidden: true,
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
      formData.append(key, String(attributes[key as keyof VoiceAttributes]));
    }
    console.log(formData);
    postMessage(formData);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
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

        <div className="d-flex">
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
          className="form-control me-lg-5 mt-lg-2 mb-lg-2"
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

export default Parkinson;
