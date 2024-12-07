from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from datetime import datetime
from sqlalchemy import text
import os
import jwt
import datetime as dt
from dotenv import load_dotenv
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

model = DecisionTreeClassifier(random_state=42)

load_dotenv('.env')

SQLURL = os.environ.get('SQLURL')
SECRET_KEY = os.environ.get('SECRET_KEY')

print("SQLURL:", SQLURL) 

app = Flask(__name__)

# CORS 설정
CORS(app)

# MySQL 데이터베이스 설정
# JWT 비밀 키 설정
app.config['SECRET_KEY'] = SECRET_KEY  # 변경할 비밀 키

app.config['SQLALCHEMY_DATABASE_URI'] = SQLURL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


KS = pd.read_csv('KS_DSPSN_SVCH_UTILIIZA_CRSTAT_INFO_202410.csv')
KS2 = pd.read_csv('KS_SVCH_UTILIIZA_CRSTAT_INFO_202410.csv')

KS = KS[['FCLTY_NM', 'ITEM_NM','TROBL_TY_NM','COURSE_PRC','COURSE_NM','COURSE_NO','CTPRVN_NM','SIGNGU_NM']]

KS.fillna("0", inplace=True)

KS['TROBL_TY_NM'] = KS['TROBL_TY_NM'].apply(lambda x: 0 if x == '0' else 1)

KS2 = KS2[['FCLTY_NM', 'ITEM_NM','COURSE_PRC','COURSE_NM','COURSE_NO','CTPRVN_NM','SIGNGU_NM']]

KS2['TROBL_TY_NM'] = 0

KS_sum = pd.concat([KS,KS2])

KS_sum.drop_duplicates(subset="COURSE_NO",keep='first',inplace=True)
item_nm = LabelEncoder()
trobl_ty = LabelEncoder()
CTPRVN_NM = LabelEncoder()

X = KS_sum[['ITEM_NM','TROBL_TY_NM','CTPRVN_NM']]
y = KS_sum[['COURSE_NO']]



# 사용자 모델 정의
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    user_type = db.Column(db.Enum('장애인', '비장애인', name='user_type_enum'), nullable=False)

# 사용자 선택 항목 모델 정의
class userselection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    selected_item = db.Column(db.String(255), nullable=False)
    user = db.relationship('User', back_populates='selections')

# User 모델에 관계 추가
User.selections = db.relationship('userselection', back_populates='user', cascade="all, delete-orphan")

# 데이터베이스 연결 테스트 엔드포인트
@app.route('/db_test', methods=['GET'])
def db_test():
    try:
        result = db.session.execute(text('SELECT 1')).fetchone()
        return jsonify({'message': 'DB 연결 성공', 'result': result[0]}), 200
    except Exception as e:
        return jsonify({'error': f'DB 연결 실패: {str(e)}'}), 500

# 회원가입 엔드포인트
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    birth_date_str = data.get('birth_date')
    user_type = data.get('user_type')

    if not (name and email and password and birth_date_str and user_type):
        return jsonify({'error': '모든 필드를 입력해야 합니다.'}), 400

    # 이메일 중복 체크
    if User.query.filter_by(email=email).first():
        return jsonify({'error': '이미 존재하는 이메일입니다.'}), 400

    try:
        # 문자열을 날짜로 변환
        birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': '잘못된 생년월일 형식입니다. 형식은 YYYY-MM-DD 여야 합니다.'}), 400

    # 비밀번호 해싱 및 사용자 저장
    hashed_password = generate_password_hash(password)
    new_user = User(
        name=name, email=email, password=hashed_password, 
        birth_date=birth_date, user_type=user_type
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': '회원가입 성공'}), 201

# 로그인 엔드포인트
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': '이메일과 비밀번호를 입력해야 합니다.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': '등록된 이메일이 없습니다.'}), 400

    # 비밀번호 확인
    if not check_password_hash(user.password, password):
        return jsonify({'error': '비밀번호가 잘못되었습니다.'}), 400

    # JWT 토큰 생성
    token = jwt.encode({
        'user_id': user.id,
        'exp': dt.datetime.utcnow() + dt.timedelta(hours=1)  # 1시간 후 만료
    }, app.config['SECRET_KEY'], algorithm='HS256')

    # 선택 항목 확인
    selections = userselection.query.filter_by(user_id=user.id).all()

    if selections:
        # 선택 항목이 이미 존재하면 홈페이지로 이동
        return jsonify({
            'message': '로그인 성공 - 홈페이지로 이동',
            'token': token,  # JWT 토큰을 응답에 포함
            'redirect': 'homepage'  # 리다이렉트 경로 명시
        }), 200

    # 선택 항목이 없으면 일반 로그인 응답
    return jsonify({
        'message': '로그인 성공 - 선택 항목 페이지로 이동',
        'token': token,  # JWT 토큰을 응답에 포함
        'redirect': 'selectionPage'  # 리다이렉트 경로 명시
    }), 200


@app.route('/process_user_selection', methods=['POST'])
def process_user_selection():
    try:
        # JSON 데이터 파싱
        data = request.json
        token = data.get('token')  # 사용자 인증을 위한 JWT 토큰

        if not token:
            return jsonify({'error': '토큰이 필요합니다.'}), 400

        # JWT 검증 및 사용자 ID 추출
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '토큰이 만료되었습니다.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': '유효하지 않은 토큰입니다.'}), 401

        # `userselection` 테이블에서 선택 항목 조회
        selections = userselection.query.filter_by(user_id=user_id).all()

        if not selections:
            return jsonify({'error': '선택 항목이 없습니다.'}), 404

        # `selected_item`에서 스포츠 항목만 추출
        # (콤마로 구분된 문자열이라 가정하고 분리)
        sports_items = []
        for selection in selections:
            sports_items.extend(selection.selected_item.split(','))  # 항목 분리

        # 중복 제거 및 최소 3개 검증
        sports_items = list(set(sports_items))  # 중복 제거
        if len(sports_items) < 3:
            return jsonify({'error': '스포츠 항목이 최소 3개 이상이어야 합니다.'}), 400

        # LabelEncoder를 사용해 숫자로 변환
        try:
            스포츠 = item_nm.transform(sports_items)  # 스포츠 항목 변환
        except ValueError as e:
            return jsonify({'error': f'스포츠 변환 오류: {str(e)}'}), 400

        # 모델 입력 데이터 구성
        input_data = {
            '스포츠': 스포츠.tolist(),  # LabelEncoder 변환 결과를 리스트로 반환
            'user_id': user_id
        }

        # 결과 반환
        return jsonify({
            'message': '선택 항목이 성공적으로 처리되었습니다.',
            'input_data': input_data
        }), 200

    except Exception as e:
        return jsonify({'error': f'서버 오류: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
