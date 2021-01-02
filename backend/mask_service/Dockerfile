FROM python:3.8-slim

WORKDIR /usr/src/app
ENV MQ_HOST=rabbitmq
RUN apt-get update
RUN apt-get install build-essential -y
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install opencv-python
RUN pip install numpy
RUN pip install opencv-contrib-python
RUN pip install scikit-image
RUN pip install pika
RUN apt-get install ffmpeg libsm6 libxext6  -y

COPY . .
HEALTHCHECK --interval=20s --timeout=15s --retries=10 CMD curl -sS 127.0.0.1:15672 || exit 1
CMD [ "python", "./__main__.py" ]