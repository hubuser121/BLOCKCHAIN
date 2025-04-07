import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, GlobalAveragePooling2D, Dense, Dropout
from keras.optimizers import Adam
from keras.callbacks import ModelCheckpoint

# Paths
real_dir = "dataset/real"
fake_dir = "dataset/fake"

# Resize target
TARGET_SIZE = (300, 300)

def load_images_from_folder(folder, label):
    data = []
    for root, _, files in os.walk(folder):
        for file in files:
            if file.lower().endswith((".jpg", ".jpeg", ".png", ".bmp")):
                path = os.path.join(root, file)
                img = cv2.imread(path)
                if img is None:
                    print(f"⚠️ Skipping unreadable image: {path}")
                    continue
                img = cv2.resize(img, TARGET_SIZE)
                img = img / 255.0  # Normalize
                data.append((img, label))
    return data

# Load dataset
print("📥 Loading images...")
real_data = load_images_from_folder(real_dir, 1)
fake_data = load_images_from_folder(fake_dir, 0)

data = real_data + fake_data
if len(data) == 0:
    raise ValueError("❌ No images found in dataset! Please check 'dataset/real' and 'dataset/fake' folders.")

images, labels = zip(*data)
images = np.array(images, dtype="float32")
labels = np.array(labels, dtype="float32")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(images, labels, test_size=0.2, random_state=42)

# Model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(*TARGET_SIZE, 3)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(128, (3, 3), activation='relu'),
    GlobalAveragePooling2D(),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer=Adam(learning_rate=0.0005),
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Save best model
checkpoint = ModelCheckpoint("document_classifier.keras", save_best_only=True, monitor="val_accuracy", mode="max")

# Train
print("🚀 Training model...")
history = model.fit(X_train, y_train,
                    epochs=10,
                    batch_size=16,
                    validation_data=(X_test, y_test),
                    callbacks=[checkpoint])

print("✅ Training complete! Model saved as 'document_classifier.keras'")
