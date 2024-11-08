from flask import Blueprint, request, jsonify
# from .model import predict
from .utils import preprocess_input, postprocess_output

main = Blueprint('main', __name__)


@main.route('/predict', methods=['POST'])
def predict_route():
    try:
        # 입력 데이터 가져오기
        input_data = request.get_json()

        # 전처리
        processed_data = preprocess_input(input_data)

        # 예측
        result = predict(processed_data)

        # 후처리
        response = postprocess_output(result)

        return jsonify({'result': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def helloWorld():
    return 'Hello, World!'