# 0. 사용할 패키지 불러오기
from tensorflow.python.keras.utils import np_utils
from tensorflow.python.keras.models import Sequential
from tensorflow.python.keras.layers import Dense, Activation
import numpy as np
from numpy import argmax
from PIL import Image
import numpy as np
import keras
import os

def classify_image(image):
    image_numpy = load_single_image(image)

    # Model 불러오기
    # from tensorflow.python.keras.models import load_model
    # model = load_model('./trained_model.h5')
    import os
    absolute_path = os.path.abspath('./apps/trained_model.keras')

    model = keras.models.load_model(absolute_path)

    # Model 사용하기
    result = model.predict(image_numpy)

    predicted_class = np.argmax(result, axis=1)

    return predicted_class

def load_single_image(image, target_size=(224, 224)):
    try:
        # 이미지가 PIL 이미지가 아니라면, 이미지를 열어줍니다.
        if not isinstance(image, Image.Image):
            image = Image.open(image)

        # 이미지가 RGB가 아니라면 RGB로 변환
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # 이미지 리사이즈
        img_resized = image.resize(target_size)

        # 이미지를 numpy 배열로 변환
        img_array = np.array(img_resized)

        # 0-255 범위의 값을 0-1로 정규화
        img_array = img_array.astype('float32') / 255.0

        # 차원 추가 (이미지 배치 크기를 1로 설정)
        img_array = np.expand_dims(img_array, axis=0)

        print(f"변환된 이미지 형태: {img_array.shape}")

        return img_array

    except Exception as e:
        print(f"이미지 처리 중 오류 발생: {e}")
        return None