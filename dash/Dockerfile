FROM python:3.10.12-slim-bullseye

RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt

EXPOSE 9009

CMD ["python3", "main.py"]
