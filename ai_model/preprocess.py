import os
import cv2
import numpy as np

# Paths
real_path = "dataset/real"
fake_path = "dataset/fake"

# Set a fixed size (e.g., 256x256)
IMG_SIZE = (256, 256)

real_images = []
fake_images = []

# Process real images
print("Processing real images...")
for category in os.listdir(real_path):
    category_path = os.path.join(real_path, category)

    if os.path.isdir(category_path):  # Ensure it's a directory
        for img_name in os.listdir(category_path):
            img_path = os.path.join(category_path, img_name)
            img = cv2.imread(img_path)

            if img is not None:
                img = cv2.resize(img, IMG_SIZE)
                real_images.append(img)
            else:
                print(f"[WARNING] Failed to load {img_path}")

# Process fake images
print("\nProcessing fake images...")
for category in os.listdir(fake_path):
    category_path = os.path.join(fake_path, category)

    if os.path.isdir(category_path):
        for img_name in os.listdir(category_path):
            img_path = os.path.join(category_path, img_name)
            img = cv2.imread(img_path)

            if img is not None:
                img = cv2.resize(img, IMG_SIZE)
                fake_images.append(img)
            else:
                print(f"[WARNING] Failed to load {img_path}")

# Final checks before converting
print(f"\n✅ Loaded {len(real_images)} real images.")
print(f"✅ Loaded {len(fake_images)} fake images.")

# Convert to NumPy arrays only if both lists have images
if real_images and fake_images:
    real_images = np.array(real_images, dtype=np.uint8)
    fake_images = np.array(fake_images, dtype=np.uint8)

    # Save the datasets
    print("\nSaving processed images...")
    np.save("real_images.npy", real_images)
    np.save("fake_images.npy", fake_images)
    print("✅ Dataset preprocessing completed successfully!")
else:
    print("\n❌ Error: One of the datasets is empty. Please check your image folders.")
