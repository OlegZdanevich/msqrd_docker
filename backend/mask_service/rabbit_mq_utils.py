from typing import Callable

import pika

from core.image import Image


def generate_callback(mask_worker: Callable[[str], Image]):
    def callback(channel, method, properties, body):
        print(f"Received {body}")

        masked_image = mask_worker(
            body.decode('utf-8')
        )

        channel.basic_publish(
            exchange='',
            routing_key=properties.reply_to,
            properties=pika.BasicProperties(
                correlation_id=properties.correlation_id
            ),
            body=masked_image.to_bytes()
        )

        print(f"Processed request.")

        channel.basic_ack(delivery_tag=method.delivery_tag)

    return callback
