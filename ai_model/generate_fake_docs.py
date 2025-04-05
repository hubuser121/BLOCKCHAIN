import os
import cv2
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def pick_random_template(folder_path):
    if not os.path.exists(folder_path):
        print(f"Folder not found: {folder_path}")
        return None
    templates = [os.path.join(folder_path, f) for f in os.listdir(folder_path)
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    if not templates:
        print(f"No templates found in: {folder_path}")
        return None
    return random.choice(templates)

def generate_fake_documents(template_folder, output_folder, doc_type, num_docs=10):
    os.makedirs(output_folder, exist_ok=True)
    template_path = pick_random_template(template_folder)
    
    if not template_path:
        print(f"❌ Skipping {doc_type}: No valid template found.")
        return

    template = cv2.imread(template_path)

    for i in range(num_docs):
        image_pil = Image.fromarray(cv2.cvtColor(template, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(image_pil)

        try:
            font = ImageFont.truetype("arial.ttf", random.randint(25, 35))
        except:
            font = ImageFont.load_default()

        fake_name = random.choice(["John Doe", "Alice Smith", "Robert Brown", "Emily Johnson"])
        fake_id = str(random.randint(100000000, 999999999))
        fake_dob = f"{random.randint(1, 28):02d}-{random.randint(1, 12):02d}-{random.randint(1990, 2005)}"

        draw.text((100, 150), f"Name: {fake_name}", font=font, fill=(0, 0, 0))
        draw.text((100, 200), f"ID: {fake_id}", font=font, fill=(0, 0, 0))
        draw.text((100, 250), f"DOB: {fake_dob}", font=font, fill=(0, 0, 0))

        fake_doc = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
        noise = np.random.randint(0, 30, fake_doc.shape, dtype=np.uint8)
        fake_doc = cv2.add(fake_doc, noise)
        fake_doc = cv2.GaussianBlur(fake_doc, (3, 3), 0)

        filename = f"{doc_type}_fake_{i+1}.jpg"
        save_path = os.path.join(output_folder, filename)
        cv2.imwrite(save_path, fake_doc)
        print(f"✅ Generated: {save_path}")


base_template_path = "templates"
output_path = "dataset/fake"

generate_fake_documents(os.path.join(base_template_path, "mark_sheets"), output_path, "marksheet", 50)
generate_fake_documents(os.path.join(base_template_path, "degree_certificates"), output_path, "degree", 50)
generate_fake_documents(os.path.join(base_template_path, "bonafide_certificate"), output_path, "bonafide", 50)
