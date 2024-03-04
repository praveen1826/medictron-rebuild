from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from diseases.diabetes import Diabetes

load_dotenv()

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

    def fake_stream():
        for i in range(10):
            yield f"data: {i}\n\n"
    return StreamingResponse(fake_stream(), media_type="text/event-stream")
