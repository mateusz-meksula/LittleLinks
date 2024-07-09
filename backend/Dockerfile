FROM python:3.12-slim-bullseye

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install -r requirements.txt --no-cache-dir

EXPOSE 8000

CMD uvicorn api.main:app --reload --host 0.0.0.0 --port 8000