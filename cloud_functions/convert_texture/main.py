import io
from PIL import Image
from google.cloud.storage import Client

client = Client()


def convert(event, context):
    """Triggered by a change to a Cloud Storage bucket.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    """

    if not event['name'].startswith('textures/') or not event['name'].endswith('.tga') or\
            event['name'].endswith('_small.tga'):
        return

    print(f"Converting file: {event['name']}")

    bucket = client.get_bucket(event['bucket'])
    blob = bucket.get_blob(event['name'])
    image_data = blob.download_as_string()
    image = Image.open(io.BytesIO(image_data))

    with io.BytesIO() as output:
        new_name = event['name'].replace('.tga', '.png')
        print(f'Uploading {new_name}')
        image.save(output, format="PNG")
        output.seek(0)
        new_blob = bucket.blob(new_name)
        new_blob.upload_from_file(output, content_type='image/png')

    small_size = (image.size[0] / 2, image.size[1] / 2)
    image.thumbnail(small_size, Image.CUBIC)

    with io.BytesIO() as output:
        new_name = event['name'].replace('.tga', '_small.png')
        print(f'Uploading {new_name}')
        image.save(output, format="PNG")
        output.seek(0)
        new_blob = bucket.blob(new_name)
        new_blob.upload_from_file(output, content_type='image/png')

    with io.BytesIO() as output:
        new_name = event['name'].replace('.tga', '_small.tga')
        print(f'Uploading {new_name}')
        image.save(output, format="TGA")
        output.seek(0)
        new_blob = bucket.blob(new_name)
        new_blob.upload_from_file(output, content_type='application/octet-stream')
