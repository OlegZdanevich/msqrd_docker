import multiprocessing
import uuid

import pika

from core.image import Image

INPUT_QUEUE_NAME = "mask_request_queue"
LINKS = ["https://francesinwonderland.files.wordpress.com/2015/06/fight-club.jpg",
         "https://ewedit.files.wordpress.com/2018/01/end-of-the.jpg?crop=0px,0px,2700px,1417.5px&resize=1200,630",
         "https://i.ytimg.com/vi/XGAw_FzwLSM/maxresdefault.jpg",
         "https://francesinwonderland.files.wordpress.com/2015/06/fight-club.jpg"]

class MasksRpcClient(object):
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host='rabbitmq'))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True
        )

        self.corr_id = ''
        self.response = None

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, photo_link) -> Image:
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(
            exchange='',
            routing_key=INPUT_QUEUE_NAME,
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=photo_link
        )
        while self.response is None:
            self.connection.process_data_events()
        return Image.from_bytes(self.response)


def send_work(index):
    mask_rpc = MasksRpcClient()
    print(f"Send request to process {LINKS[index]}")
    response = mask_rpc.call(LINKS[index])
    response.save_to_file(f'tmp{index}.jpg')
    print(f"Saved result to tmp{index}.jpg")
    return response


with multiprocessing.Pool(4) as pool:
    promises = [pool.apply_async(send_work, (i, )) for i in range(4)]
    images = [res.get() for res in promises]
