from transformers import pipeline, TextStreamer, AutoTokenizer, AutoModelForCausalLM, TextIteratorStreamer
from langchain_community.llms.huggingface_pipeline import HuggingFacePipeline
from langchain.prompts import ChatPromptTemplate


class Medictron:
    def __init__(self, prompt) -> None:
        self.tokenizer = AutoTokenizer.from_pretrained(
            "praveen-reddy/Medictron-0.5B-Chat")
        self.streamer = TextIteratorStreamer(tokenizer=self.tokenizer)
        self.model = AutoModelForCausalLM.from_pretrained(
            "praveen-reddy/Medictron-0.5B-Chat",
            torch_dtype="auto",
            device_map="auto"
        )
        prompt = prompt
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        self.model_inputs = self.tokenizer([text], return_tensors="pt")
