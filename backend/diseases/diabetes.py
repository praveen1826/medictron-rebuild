from langchain.agents import tool, create_react_agent, AgentExecutor
from langchain.prompts import ChatPromptTemplate
from langchain import hub
import numpy as np
from sklearn.preprocessing import StandardScaler
import pickle
import ast


class Diabetes:

    def __init__(self, llm) -> None:
        self.llm = llm
        self.tool_list = [self.diabetes]
        self.diabetesPrompt = ChatPromptTemplate.from_template(
            template="""Use a tool and check if there is diabetes or not
             input: {attributes}""")
        prompt = hub.pull("hwchase17/react")

        self.diabetesAgent = create_react_agent(
            llm=self.llm, tools=self.tool_list, prompt=prompt)

        template = """context:
                        If the result is diabetes =[0], there’s no disease. If it’s diabetes =[1], the disease is present.
                        Result: {result}
                        "based on the context reply appropriately to the patient"""

        self.diabetesPrompt = ChatPromptTemplate.from_template(
            template=template)

        self.diabetesChain = self.diabetesPrompt | self.llm

        self.diabetesAgentExecutor = AgentExecutor(agent=self.diabetesAgent, tools=self.tool_list, handle_parsing_errors=True,
                                                   max_iterations=5,
                                                   verbose=True)

    @tool(return_direct=True)
    def diabetes(query: str) -> str:
        """Takes in a dictionary of key value pairs in this order {
        'Pregnancies': 6,
        'Glucose': 148,
        'BloodPressure': 72,
        'SkinThickness': 35,
        'Insulin': 0,
        'BMI': 33.6,
        'DiabetesPedigreeFunction': 0.627,
        'Age': 50
        } and returns diabetes(1) or not(0)"""

        query = ast.literal_eval(query)

        values = [float(value) for value in query.values()]

        test_value = np.array(values)
        sc = StandardScaler()

        best_model = "models/diabetes/Diabetes_AdaBoostClassifier_model.pkl"

        with open(best_model, 'rb') as file:
            Best_model = pickle.load(file)

        output = Best_model.predict(sc.fit_transform([test_value]))

        return "diabetes =" + str(output)
