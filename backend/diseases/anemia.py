from langchain.agents import tool, create_react_agent, AgentExecutor
from langchain.prompts import ChatPromptTemplate
from langchain import hub
import numpy as np
from sklearn.preprocessing import StandardScaler
import pickle
import ast


class Anemia:
    def __init__(self, llm) -> None:
        self.llm = llm
        self.tool_list = [self.anemia]
        self.anemiaPrompt = ChatPromptTemplate.from_template(
            template="""Use a tool and check if there is anemia or not input: {attributes}""")
        prompt = hub.pull("hwchase17/react")
        self.anemiaAgent = create_react_agent(
            llm=self.llm, tools=self.tool_list, prompt=prompt)
        template = """context: If the result is anemia =[0], there's no disease. If it's anemia =[1], the disease is present. Result: {result} "based on the context reply appropriately to the patient"""
        self.anemiaPrompt = ChatPromptTemplate.from_template(
            template=template)
        self.anemiaChain = self.anemiaPrompt | self.llm
        self.anemiaAgentExecutor = AgentExecutor(
            agent=self.anemiaAgent, tools=self.tool_list, handle_parsing_errors=True, max_iterations=5, verbose=True)

    @tool(return_direct=True)
    def anemia(query: str) -> str:
        """Takes in a dictionary of key value pairs in this order { 'Gender': 1, 'Hemoglobin': 11.4, 'MCH': 22.7, 'MCHC': 29.1, 'MCV': 83.7 } and returns anemia(1) or not(0)"""
        query = ast.literal_eval(query)
        values = [float(value) for value in query.values()]

        test_value = np.array(values)
        sc = StandardScaler()
        best_model = "models/anemia/XG_model.pkl"
        with open(best_model, 'rb') as file:
            Best_model = pickle.load(file)
        output = Best_model.predict(sc.fit_transform([test_value]))
        return "anemia =" + str(output)
