import tensorflow as tf
import numpy as np

IMAGE_SIZE = (224, 224)
class_names = [
    'Black Scurf', 'Blackleg', 'Common Scab',
    'Dry Rot', 'Healthy Potatoes', 'Miscellaneous', 'Pink Rot'
]

def predict_image(img_path):
    model = tf.keras.models.load_model('saved_models/final/final_model.h5')
    img = tf.keras.utils.load_img(img_path, target_size=IMAGE_SIZE)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    pred = model.predict(img_array, verbose=0)
    idx = np.argmax(pred[0])
    
    result = {
        'prediction': class_names[idx],
        'confidence': float(pred[0][idx] * 100)
    }
    return result

if __name__ == '__main__':
    result = predict_image('training/testing_data/potato_black_scurf.png')
    print(f"Prediction: {result['prediction']}")
    print(f"Confidence: {result['confidence']:.2f}%")