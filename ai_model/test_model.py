import os
import cv2
import numpy as np
import shutil
from keras.models import load_model

# Load trained model
model = load_model("document_classifier.keras")

# Define paths
test_dir = "test_documents"
real_folder = os.path.join(test_dir, "predicted_real")
fake_folder = os.path.join(test_dir, "predicted_fake")

# Create output folders if they don't exist
os.makedirs(real_folder, exist_ok=True)
os.makedirs(fake_folder, exist_ok=True)

# Prediction stats
total = 0
correct = 0  # Only meaningful if ground truth is known
real_count = 0
fake_count = 0

# Iterate through all files
for filename in os.listdir(test_dir):
    file_path = os.path.join(test_dir, filename)

    # Skip folders
    if os.path.isdir(file_path):
        continue

    # Read the image
    img = cv2.imread(file_path)
    if img is None:
        print(f"⚠️ Skipping unreadable image: {filename}")
        continue

    # Get model input shape (excluding batch size)
    input_shape = model.input_shape[1:]

    try:
        if len(input_shape) == 3:
            # CNN model: (height, width, channels)
            img = cv2.resize(img, (input_shape[1], input_shape[0]), interpolation=cv2.INTER_AREA)
            img_array = img / 255.0
            img_array = np.expand_dims(img_array, axis=0)

        elif len(input_shape) == 1:
            # Flattened input model
            total_pixels = input_shape[0]
            width = int((total_pixels // 3) ** 0.5)
            height = total_pixels // (3 * width)
            img = cv2.resize(img, (width, height), interpolation=cv2.INTER_AREA)
            img_array = img / 255.0
            img_array = img_array.reshape((1, -1))

        else:
            print(f"❌ Unsupported input shape for model: {input_shape}")
            continue

        # Make prediction
        prediction = model.predict(img_array)[0][0]
        predicted_label = "real" if prediction >= 0.5 else "fake"

        # Move to predicted folder
        dest = os.path.join(real_folder if predicted_label == "real" else fake_folder, filename)
        shutil.copy(file_path, dest)

        # Update counters
        total += 1
        if predicted_label == "real":
            real_count += 1
        else:
            fake_count += 1

        print(f"[{filename}] ➜ Predicted: {predicted_label.upper()} ({prediction:.2f})")

    except Exception as e:
        print(f"❌ Error processing {filename}: {str(e)}")
        continue

# Summary
print("\n📊 Prediction Summary:")
print(f"🔢 Total evaluated: {total}")
print(f"✅ Predicted Real: {real_count}")
print(f"❌ Predicted Fake: {fake_count}")

if total > 0:
    print(f"🎯 Prediction Accuracy (classifier confidence based): {(real_count + fake_count) / total * 100:.2f}%")
else:
    print("⚠️ No valid images evaluated.")
