import pika
import os

from init_core import (generate_mask_worker, init_face_detector,
                       init_marks_detector, init_service, load_mask_lib)
from rabbit_mq_utils import generate_callback

INPUT_QUEUE_NAME = "msqrd-mq-1"
HOST = os.environ.get('MQ_HOST', 'localhost')

# SERVICES INITIALIZATION BEGIN
face_detector = init_face_detector()
marks_detector = init_marks_detector()
mask_lib = load_mask_lib(face_detector, marks_detector)
service = init_service(face_detector, marks_detector, mask_lib)
mask_worker = generate_mask_worker(service)
# SERVICES INITIALIZATION END

# RABBIT_MQ LAUNCH BEGIN
credentials = pika.PlainCredentials('admin', 'admin')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=HOST,credentials=credentials)
)
channel = connection.channel()
channel.queue_declare(queue=INPUT_QUEUE_NAME, durable=True)
channel.basic_qos(prefetch_count=1)
channel.basic_consume(
    queue=INPUT_QUEUE_NAME,
    on_message_callback=generate_callback(mask_worker)
)
print("Waiting for requests ...")
channel.start_consuming()
# RABBIT_MQ LAUNCH END
