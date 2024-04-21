FROM python:3.11-slim-bullseye

RUN mkdir -p /home/backend

WORKDIR /home/backend

COPY . .

RUN pip install -r requirements.txt

EXPOSE 8000

CMD uvicorn server:app --host 0.0.0.0 --reload


