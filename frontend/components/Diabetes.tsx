import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";

interface Attributes {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
  // Add more fields as needed
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

function Diabetes() {
  const [attributes, setAttributes] = useState<Attributes>({
    Pregnancies: 6,
    Glucose: 148,
    BloodPressure: 72,
    SkinThickness: 35,
    Insulin: 0,
    BMI: 33.6,
    DiabetesPedigreeFunction: 0.627,
    Age: 50,
  });

  // console.log(attributesArray);

  const postMessage = (formData: any) => {
    try {
      fetchEventSource("http://localhost:8000/diabetes", {
        method: "Post",
        body: formData,
        onmessage(ev) {
          console.log(ev.data);
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

  return (
    <div>
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
          <button type="submit" className="btn btn-primary m-3 ms-auto">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Diabetes;
