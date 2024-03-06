from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from diseases.diabetes import Diabetes
from diseases.parkinson import Parkinson
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


@app.post("/parkinson")
async def parkinson_chat(MDVP_Fo_Hz: float = Form(...),
                         MDVP_Fhi_Hz: float = Form(...),
                         MDVP_Flo_Hz: float = Form(...),
                         MDVP_Jitter_Percent: float = Form(...),
                         MDVP_Jitter_Abs: float = Form(...),
                         MDVP_RAP: float = Form(...),
                         MDVP_PPQ: float = Form(...),
                         Jitter_DDP: float = Form(...),
                         MDVP_Shimmer: float = Form(...),
                         MDVP_Shimmer_dB: float = Form(...),
                         Shimmer_APQ3: float = Form(...),
                         Shimmer_APQ5: float = Form(...),
                         MDVP_APQ: float = Form(...),
                         Shimmer_DDA: float = Form(...),
                         NHR: float = Form(...),
                         HNR: float = Form(...),
                         RPDE: float = Form(...),
                         DFA: float = Form(...),
                         spread1: float = Form(...),
                         spread2: float = Form(...),
                         D2: float = Form(...),
                         PPE: float = Form(...)
                         ):
    # body = await request.json()
    attributes = {
        "MDVP:Fo(Hz)": MDVP_Fo_Hz,
        "MDVP:Fhi(Hz)": MDVP_Fhi_Hz,
        "MDVP:Flo(Hz)": MDVP_Flo_Hz,
        "MDVP:Jitter(%)": MDVP_Jitter_Percent,
        "MDVP:Jitter(Abs)": MDVP_Jitter_Abs,
        "MDVP:RAP": MDVP_RAP,
        "MDVP:PPQ": MDVP_PPQ,
        "Jitter:DDP": Jitter_DDP,
        "MDVP:Shimmer": MDVP_Shimmer,
        "MDVP:Shimmer(dB)": MDVP_Shimmer_dB,
        "Shimmer:APQ3": Shimmer_APQ3,
        "Shimmer:APQ5": Shimmer_APQ5,
        "MDVP:APQ": MDVP_APQ,
        "Shimmer:DDA": Shimmer_DDA,
        "NHR": NHR,
        "HNR": HNR,
        "RPDE": RPDE,
        "DFA": DFA,
        "spread1": spread1,
        "spread2": spread2,
        "D2": D2,
        "PPE": PPE
    }

    print(attributes)

    parkinsonAgentExecutor = Parkinson(llm=llm).parkinsonAgentExecutor

    def parkinson_stream(attributes):
        output = parkinsonAgentExecutor.invoke(
            {"input": """"Use the diagnostic tool to check for parkinson using the given health details. 
              If the result is parkinson =[0], there’s no disease. If it’s parkinson =[1], the disease is present.
              After the analysis, respond with suitable information. Input: """ + str(attributes)})
        yield f"data: {output['output']}\n\n"

    return StreamingResponse(parkinson_stream(attributes=attributes), media_type="text/event-stream")
