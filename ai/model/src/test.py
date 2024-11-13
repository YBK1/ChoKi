import h5py, numpy as np

try:
    # 파일을 새로 만들 때 'w' 모드를 사용
    with h5py.File('test.h5', 'w') as f:
        # 데이터셋을 4-byte 정수 형식으로 저장
        f.create_dataset('test', data=np.array([1, 2, 3]), dtype='i4')
    print("h5py write test: Success")

    # 파일을 읽을 때는 'r' 모드를 사용
    with h5py.File('test.h5', 'r') as f:
        data = f['test'][:]
        print(f"h5py read test: Success (read data: {data})")
except Exception as e:
    print(f"h5py test failed: {str(e)}")