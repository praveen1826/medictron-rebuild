from transformers import pipeline, TextStreamer, AutoTokenizer, AutoModelForCausalLM, TextIteratorStreamer
from langchain_community.llms.huggingface_pipeline import HuggingFacePipeline
from langchain.prompts import ChatPromptTemplate
from threading import Thread, Lock


class Medictron:
    def __init__(self) -> None:
        self.tokenizer = AutoTokenizer.from_pretrained(
            "praveen-reddy/Medictron-0.5B-Chat")
        self.streamer = TextIteratorStreamer(tokenizer=self.tokenizer)
        self.model = AutoModelForCausalLM.from_pretrained(
            "praveen-reddy/Medictron-0.5B-Chat",
            torch_dtype="auto",
            device_map="auto"
        )
        self.lock = Lock()

    def stream_response(self, prompt):
        with self.lock:
            messages = [
                {"role": "system", "content": "You are an AI Doctor That Diagnoses Patients"},
                {"role": "user", "content": prompt}
            ]
            text = self.tokenizer.apply_chat_template(
                messages, tokenize=False, add_generation_prompt=True)
            model_inputs = self.tokenizer([text], return_tensors="pt")

            generation_kwargs = dict(
                inputs=model_inputs.input_ids, streamer=self.streamer, max_new_tokens=40)
            thread = Thread(target=self.model.generate,
                            kwargs=generation_kwargs)
            thread.start()

            for chunk in self.streamer:
                print(chunk, end="", flush=True)
                yield f"data: {chunk}\n\n"
