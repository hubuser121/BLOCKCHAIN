import os
from PIL import Image, ImageFile
import shutil

ImageFile.LOAD_TRUNCATED_IMAGES = True

dataset_path = "C:\\Users\\karthik\\blockchain-doc-verification\\ai_model\\dataset"
corrupt_backup = os.path.join(dataset_path, "corrupt_backup")
os.makedirs(corrupt_backup, exist_ok=True)

valid_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff')

for root, _, files in os.walk(dataset_path):
    for file in files:
        file_path = os.path.join(root, file)

        # Check extension
        if not file.lower().endswith(valid_extensions):
            continue

        try:
            with Image.open(file_path) as img:
                img.verify()
        except (IOError, SyntaxError):
            print(f"⚠️ Corrupt image found: {file_path}")
            backup_path = os.path.join(corrupt_backup, os.path.basename(file_path))
            shutil.move(file_path, backup_path)  # Safely move instead of delete
            print(f"⏩ Moved to: {backup_path}")
