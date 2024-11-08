import tensorflow as tf
import matplotlib.pyplot as plt
import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D
from tensorflow.keras.layers import Flatten, Dense, ZeroPadding2D
from PIL import Image
import numpy as np
import re

train_image_path = "../../data/train"
test_image_path = "../../data/test"
# (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()


# def load_custom_dataset(image_path, target_size = (224, 224)):
#     images = []
#     labels = []
#
#     # 폴더 정렬 (숫자.이름 형식의 폴더명 기준)
#     folders = sorted(os.listdir(image_path),
#                      key=lambda x: int(re.match(r'(\d+)\.', x).group(1)) if re.match(r'(\d+)\.', x) else float('inf'))
#
#     for folder in folders:
#         # 숫자 추출 (예: "1.iron" -> 1)
#         class_num = int(re.match(r'(\d+)\.', folder).group(1))
#         folder_path = os.path.join(image_path, folder)
#
#         if os.path.isdir(folder_path):
#             # print(f"클래스 {class_num}: {folder}")
#
#             # 폴더 내의 모든 이미지 파일 처리
#             for filename in os.listdir(folder_path):
#                 if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
#                     try:
#                         # 이미지 로드 및 전처리
#                         img_path = os.path.join(folder_path, filename)
#                         img = Image.open(img_path)
#
#                         # RGB로 변환 (이미지가 RGBA 또는 다른 모드인 경우 대비)
#                         if img.mode != 'RGB':
#                             img = img.convert('RGB')
#
#                         # 이미지 크기 조정
#                         img = img.resize(target_size)
#
#                         # 이미지를 numpy 배열로 변환
#                         img_array = np.array(img)
#
#                         # 이미지와 레이블 저장
#                         images.append(img_array)
#                         labels.append(class_num)
#
#                     except Exception as e:
#                         print(f"Error processing {filename}: {str(e)}")
#
#     # 리스트를 numpy 배열로 변환
#     x_train = np.array(images)
#     y_train = np.array(labels)
#
#     # 픽셀값을 0-1 범위로 정규화
#     x_train = x_train.astype('float32') / 255.0
#
#     print("\n데이터셋 정보:")
#     print(f"이미지 데이터 형태: {x_train.size}")
#     print(f"레이블 데이터 형태: {y_train.size}")
#     print(f"클래스 개수: {len(np.unique(y_train))}")
#
#     return x_train, y_train
#
# model = Sequential()
# # 0 패딩 적용하기
# model.add(ZeroPadding2D(padding=2))
# model.add(Conv2D(filters=6, kernel_size=5, padding="valid", strides=1, activation="relu"))
# model.add(MaxPooling2D(pool_size=2, strides=2))
# model.add(Conv2D(filters=16, kernel_size=5, padding="valid", strides=1, activation="relu"))
# model.add(MaxPooling2D(pool_size=2, strides=2))
# model.add(Flatten())
# model.add(Dense(units=120, activation="relu"))
# model.add(Dense(units=84, activation="relu"))
# model.add(Dense(units=10, activation="softmax"))
# model.build(input_shape=(None,224,224,1))
# # model.summary() # 모델의 요약을 볼 수 있음.
#
# (x_train, y_train) = load_custom_dataset(train_image_path, target_size = (224, 224))
# (x_test, y_test) = load_custom_dataset(test_image_path, target_size = (224, 224))
#
# # optimizer=Adam, loss function: sparse_categorical_crossentropy 레이블이 정수형태로 표현되는 경우, 주로 사용함
# model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
# model.fit(x_train, y_train, epochs=5)
# test_loss, test_acc = model.evaluate(x_test, y_test) # Test Data evaluate
# # test_loss, test_acc = model.evaluate(image_arrays, image_labels) # Test Data evaluate
# print(test_acc) # 정확도 출력
#
# # load_custom_dataset(image_path)

def load_custom_dataset(image_path, target_size=(224, 224)):
    images = []
    labels = []

    folders = sorted(os.listdir(image_path),
                     key=lambda x: int(re.match(r'(\d+)\.', x).group(1)) if re.match(r'(\d+)\.', x) else float('inf'))

    for folder in folders:
        class_num = int(re.match(r'(\d+)\.', folder).group(1))
        folder_path = os.path.join(image_path, folder)

        if os.path.isdir(folder_path):
            for filename in os.listdir(folder_path):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                    try:
                        img_path = os.path.join(folder_path, filename)
                        # RGB로 이미지 로드
                        img = Image.open(img_path)
                        if img.mode != 'RGB':
                            img = img.convert('RGB')
                        img = img.resize(target_size)
                        img_array = np.array(img)

                        images.append(img_array)
                        labels.append(class_num)

                    except Exception as e:
                        print(f"Error processing {filename}: {str(e)}")

    x_train = np.array(images)
    y_train = np.array(labels)
    x_train = x_train.astype('float32') / 255.0

    print("\n데이터셋 정보:")
    print(f"이미지 데이터 형태: {x_train.shape}")
    print(f"레이블 데이터 형태: {y_train.shape}")
    print(f"클래스 개수: {len(np.unique(y_train))}")

    return x_train, y_train


# 모델 정의 - 3채널(RGB) 입력을 받도록 수정
model = Sequential([
    # input_shape를 (224, 224, 3)으로 변경
    ZeroPadding2D(padding=2, input_shape=(224, 224, 3)),
    Conv2D(filters=32, kernel_size=5, padding="valid", strides=1, activation="relu"),
    MaxPooling2D(pool_size=2, strides=2),
    Conv2D(filters=64, kernel_size=5, padding="valid", strides=1, activation="relu"),
    MaxPooling2D(pool_size=2, strides=2),
    Conv2D(filters=128, kernel_size=3, padding="valid", strides=1, activation="relu"),
    MaxPooling2D(pool_size=2, strides=2),
    Flatten(),
    Dense(units=256, activation="relu"),
    Dense(units=128, activation="relu"),
    Dense(units=10, activation="softmax")  # 클래스 수에 맞게 조정
])

# 데이터 로드
(x_train, y_train) = load_custom_dataset(train_image_path, target_size=(224, 224))
(x_test, y_test) = load_custom_dataset(test_image_path, target_size=(224, 224))

# 모델 컴파일
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# 학습 과정 모니터링을 위한 콜백
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=2)
]

# 학습
history = model.fit(x_train, y_train,
                    epochs=5,
                    validation_split=0.2,
                    batch_size=32,
                    callbacks=callbacks)

# 평가
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test accuracy: {test_acc:.4f}")

# 학습 과정 시각화 (선택사항)
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='accuracy')
plt.plot(history.history['val_accuracy'], label='val_accuracy')
plt.title('Model accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='loss')
plt.plot(history.history['val_loss'], label='val_loss')
plt.title('Model loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.show()

