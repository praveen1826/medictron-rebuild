from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from diseases.diabetes import Diabetes
from langchain.globals import set_debug

load_dotenv()

set_debug(True)

template = """Answer the question in short and conscise format
            Question: {question}
            Answer:
            """

prompt = ChatPromptTemplate.from_template(template=template)

llm = ChatGoogleGenerativeAI(model="gemini-pro", streaming=True)

chain = prompt | llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_credentials=True,
    allow_methods=["*"]
)


@app.post("/chat")
async def general_chat(request: Request):
    body = await request.json()
    print(body)

    def stream_text(body):
        for chunk in chain.stream({"question": str(body["message"])}):
            print(chunk)
            yield f"data: {chunk}\n\n"
    return StreamingResponse(stream_text(body), media_type="text/event-stream")


@app.post("/diabetes")
async def diabetes_chat(Pregnancies: int = Form(...),
                        Glucose: int = Form(...),
                        BloodPressure: int = Form(...),
                        SkinThickness: int = Form(...),
                        Insulin: int = Form(...),
                        BMI: float = Form(...),
                        DiabetesPedigreeFunction: float = Form(...),
                        Age: int = Form(...)):
    # body = await request.json()
    attributes = {
        "Pregnancies": Pregnancies,
        "Glucose": Glucose,
        "BloodPressure": BloodPressure,
        "SkinThickness": SkinThickness,
        "Insulin": Insulin,
        "BMI": BMI,
        "DiabetesPedigreeFunction": DiabetesPedigreeFunction,
        "Age": Age
    }
    print(attributes)

    diabetesAgentExecutor = Diabetes(llm=llm).diabetesAgentExecutor

    def diabetes_stream(attributes):
        output = diabetesAgentExecutor.invoke(
            {"input": """"Use the diagnostic tool to check for diabetes using the given health details. 
              If the result is diabetes =[0], there’s no disease. If it’s diabetes =[1], the disease is present.
              After the analysis, respond with suitable information. Input: """ + str(attributes)})
        yield f"data: {output['output']}\n\n"

    return StreamingResponse(diabetes_stream(attributes=attributes), media_type="text/event-stream")
