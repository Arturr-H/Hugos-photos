## Imports
from PIL import Image
import os

## Constants
DEFAULT_FOLDER = "./frontend/src/assets/images/default/"
COMPRESSED_FOLDER = "./frontend/src/assets/images/compressed/"

## Functions
def compress(image_file):
    """Compresses the image file and saves it to the compressed folder"""
    image = Image.open(DEFAULT_FOLDER + image_file)

    ## Compresses the image and resize it to half its original size
    image = image.resize((image.width // 2, image.height // 2), Image.ANTIALIAS)
    image.save(COMPRESSED_FOLDER + image_file, optimize=True, quality=25)

## Main
if __name__ == "__main__":
    for image_file in os.listdir(DEFAULT_FOLDER):
        compress(image_file)
