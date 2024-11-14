import tensorflow as tf
import matplotlib.pyplot as plt
import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, ZeroPadding2D
from PIL import Image
import numpy as np
import re

# train_image_path = "../../data/train"
# test_image_path = "../../data/test"

os.environ["CUDA_VISIBLE_DEVICES"] = "0"
os.environ['CUDA_HOME'] = '/home/j-k11c102/.conda/envs/chokiAi'
os.environ['LD_LIBRARY_PATH'] = '/home/j-k11c102/.conda/envs/chokiAi/'

train_image_path = "../../aihub/datasets/train"
test_image_path = "../../aihub/datasets/test"

import tensorflow as tf
import os
from PIL import Image
import numpy as np
import re

tfrecord_train_path = "train_dataset.tfrecord"
tfrecord_test_path = "test_dataset.tfrecord"


def create_tfrecord(image_path, tfrecord_path, target_size=(224, 224)):
    with tf.io.TFRecordWriter(tfrecord_path) as writer:
        folders = sorted(os.listdir(image_path),
                         key=lambda x: int(re.match(r'(\d+)\.', x).group(1)) if re.match(r'(\d+)\.', x) else float(
                             'inf'))

        for folder in folders:
            parsed = re.match(r'(\d+)\.', folder)
            if parsed:
                class_num = int(parsed.group(1))
                folder_path = os.path.join(image_path, folder)
                if os.path.isdir(folder_path):
                    for filename in os.listdir(folder_path):
                        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                            img_path = os.path.join(folder_path, filename)
                            try:
                                img = Image.open(img_path)
                                if img.mode != 'RGB':
                                    img = img.convert('RGB')
                                img = img.resize(target_size)
                                img_array = np.array(img)
                                img_bytes = tf.io.encode_jpeg(img_array).numpy()

                                feature = {
                                    'image': tf.train.Feature(bytes_list=tf.train.BytesList(value=[img_bytes])),
                                    'label': tf.train.Feature(int64_list=tf.train.Int64List(value=[class_num]))
                                }
                                example = tf.train.Example(features=tf.train.Features(feature=feature))
                                writer.write(example.SerializeToString())
                            except Exception as e:
                                print(f"Error processing {filename}: {str(e)}")


def parse_tfrecord_fn(example):
    feature_description = {
        'image': tf.io.FixedLenFeature([], tf.string),
        'label': tf.io.FixedLenFeature([], tf.int64),
    }
    example = tf.io.parse_single_example(example, feature_description)
    image = tf.io.decode_jpeg(example['image'], channels=3)
    image = tf.image.convert_image_dtype(image, tf.float32)  # 0~1로 스케일링
    label = example['label']
    return image, label


def load_tfrecord_dataset(tfrecord_path, batch_size=32):
    dataset = tf.data.TFRecordDataset(tfrecord_path)
    dataset = dataset.map(parse_tfrecord_fn, num_parallel_calls=tf.data.experimental.AUTOTUNE)
    dataset = dataset.shuffle(1000).batch(batch_size).prefetch(tf.data.experimental.AUTOTUNE)
    return dataset


train_dataset = load_tfrecord_dataset(tfrecord_train_path)
test_dataset = load_tfrecord_dataset(tfrecord_test_path)

# Train 및 Test 데이터셋을 TFRecord로 변환
create_tfrecord(train_image_path, tfrecord_train_path)
create_tfrecord(test_image_path, tfrecord_test_path)
print("TFRecord 파일 생성 완료")


def load_tfrecord_dataset(tfrecord_path, target_size=(224, 224), batch_size=32):
    # TFRecord 파싱을 위한 특성 설명
    feature_description = {
        'image': tf.io.FixedLenFeature([], tf.string),
        'label': tf.io.FixedLenFeature([], tf.int64)
    }

    # 단일 예제를 파싱하는 함수
    def parse_tfrecord_fn(example_proto):
        parsed_features = tf.io.parse_single_example(example_proto, feature_description)
        # JPEG 바이트 스트링을 이미지로 디코딩
        image = tf.io.decode_jpeg(parsed_features['image'], channels=3)
        # 이미지 크기 조정
        image = tf.image.resize(image, target_size)
        # 이미지 정규화 (0-1 범위로)
        image = tf.cast(image, tf.float32) / 255.0
        # 레이블
        label = tf.cast(parsed_features['label'], tf.int32)
        return image, label

    # TFRecord 데이터셋 생성 및 설정
    dataset = tf.data.TFRecordDataset(tfrecord_path)
    dataset = dataset.map(parse_tfrecord_fn, num_parallel_calls=tf.data.AUTOTUNE)
    dataset = dataset.shuffle(1000)
    dataset = dataset.batch(batch_size)
    dataset = dataset.prefetch(tf.data.AUTOTUNE)

    # 데이터셋 정보 출력을 위한 첫 번째 배치 검사
    for images, labels in dataset.take(1):
        print("\n데이터셋 정보:")
        print("이미지 데이터 dtype:", images.dtype)
        print("레이블 데이터 dtype:", labels.dtype)
        print(f"배치 이미지 형태: {images.shape}")
        print(f"배치 레이블 형태: {labels.shape}")

        # 전체 데이터셋의 크기와 클래스 수를 계산
        total_batches = tf.data.experimental.cardinality(dataset).numpy()
        if total_batches > 0:
            total_examples = total_batches * batch_size
            print(f"총 데이터 수(추정): {total_examples}")

            # 유니크한 클래스 수 계산
            all_labels = []
            for _, batch_labels in dataset:
                all_labels.extend(batch_labels.numpy())
            unique_classes = len(np.unique(all_labels))
            print(f"클래스 개수: {unique_classes}")

    return dataset


# # GPU 사용을 명시
# GPU:0만 사용하도록 설정
physical_device = tf.config.list_physical_devices('GPU')[0]
tf.config.set_visible_devices(physical_device, 'GPU')

# 메모리 증가를 동적으로 설정
# try:
#     tf.config.experimental.set_memory_growth(physical_device, True)
#     print("GPU 메모리 설정 완료")
# except RuntimeError as e:
#     print(f"GPU 설정 오류: {e}")

# 세션 초기화
tf.keras.backend.clear_session()

# 혼합 정밀도 정책 설정
from tensorflow.keras import mixed_precision

mixed_precision.set_global_policy('mixed_float16')

# 모델 정의
model = Sequential([
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
    Dense(units=10, activation="softmax")
])

# 데이터 로드
train_dataset = load_tfrecord_dataset(tfrecord_train_path)
test_dataset = load_tfrecord_dataset(tfrecord_test_path)

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
history = model.fit(train_dataset,
                    epochs=5,
                    validation_data=test_dataset,
                    batch_size=32,
                    callbacks=callbacks)

# 평가
test_loss, test_acc = model.evaluate(test_dataset)
print(f"Test accuracy: {test_acc:.4f}")

# 학습된 모델 저장
model.save("../models/trained_model.keras")
print("모델이 'trained_model.keras'로 저장되었습니다.")

# 학습 과정 시각화 저장
# plt.figure(figsize=(12, 4))

# plt.subplot(1, 2, 1)
# plt.plot(history.history['accuracy'], label='accuracy')
# plt.plot(history.history['val_accuracy'], label='val_accuracy')
# plt.title('Model accuracy')
# plt.xlabel('Epoch')
# plt.ylabel('Accuracy')
# plt.legend()

# plt.subplot(1, 2, 2)
# plt.plot(history.history['loss'], label='loss')
# plt.plot(history.history['val_loss'], label='val_loss')
# plt.title('Model loss')
# plt.xlabel('Epoch')
# plt.ylabel('Loss')
# plt.legend()

# # 그래프 이미지로 저장
# plt.savefig("../models/training_history.png")
# print("학습 과정 시각화가 'training_history.png'로 저장되었습니다.")
# plt.show()
