from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model with absolute path
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../saved_models/final/final_model.h5")
try:
    MODEL = tf.keras.models.load_model(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model from {MODEL_PATH}: {str(e)}")

CLASS_NAMES = [
    'Black Scurf', 'Blackleg', 'Common Scab',
    'Dry Rot', 'Healthy Potatoes', 'Miscellaneous', 'Pink Rot'
]

IMAGE_SIZE = (224, 224)

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    try:
        image = Image.open(BytesIO(data))
        
        # Convert to RGB if needed (handle RGBA, grayscale, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize(IMAGE_SIZE, Image.Resampling.LANCZOS)
        
        image_array = np.array(image)
        return image_array
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image"
            )
        
        # Read and process image
        image = read_file_as_image(await file.read())
        img_batch = np.expand_dims(image, 0)
        
        # Make prediction
        predictions = MODEL.predict(img_batch, verbose=0)
        
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))
        
        return {
            'class': predicted_class,
            'confidence': confidence
        }
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
