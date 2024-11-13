from flask import Flask, request
from src import classify
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://choki.co.kr"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "Content-Length",
            "Content-Disposition",
            "Accept",
            "X-Requested-With"
        ]
    }
})

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/ai/classify', methods=['POST'])
def classify_recycle():
    # 클라이언트가 보낸 파일 받기
    if 'file' not in request.files:
        return "이미지가 포함되지 않았습니다.", 400

    file = request.files['file']

    # 파일이 비어 있는지 확인
    if file.filename == '':
        return "이미지가 비어있습니다.", 400

    class_num = int(classify.classify_image(file)[0])

    classes = ["", "철캔", "알루미늄캔", "종이", "플라스틱", "스티로폼", "비닐", "유리", "건전지", "형광등"]

    # 이미지 파일을 받아서 base64로 인코딩
    try:
        result = {"status" : 200, "class" : class_num, "name" : classes[class_num]}
        # result = {"status" : 200}
        return result
    except Exception as e:
        return {"status" : 200, "message" : "오류 발생"}


if __name__ == '__main__':
    app.run()
