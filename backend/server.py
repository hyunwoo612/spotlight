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
import random

model = DecisionTreeClassifier(random_state=42)

load_dotenv('.env')

SQLURL = os.environ.get('SQLURL')
SECRET_KEY = os.environ.get('SECRET_KEY')

app = Flask(__name__)

# CORS 설정
CORS(app)

# MySQL 데이터베이스 설정
# JWT 비밀 키 설정
app.config['SECRET_KEY'] = SECRET_KEY  # 변경할 비밀 키

app.config['SQLALCHEMY_DATABASE_URI'] = SQLURL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 데이터 로드
KS_sum = pd.read_csv('KS_sum2.csv')

# 레이블 인코더 설정
item_nm = LabelEncoder()
trobl_ty = LabelEncoder()
CTPRVN_NM = LabelEncoder()

# 레이블 인코딩
KS_sum['ITEM_NM'] = item_nm.fit_transform(KS_sum['ITEM_NM'])
KS_sum['TROBL_TY_NM'] = trobl_ty.fit_transform(KS_sum['TROBL_TY_NM'])
KS_sum['CTPRVN_NM'] = CTPRVN_NM.fit_transform(KS_sum['CTPRVN_NM'])

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
    
class usersearch(db.Model):
    FCLTY_NM = db.Column(db.Text, nullable=False)
    ITEM_NM = db.Column(db.Text, nullable=False)
    TROBL_TY_NM = db.Column(db.Integer, nullable=True)
    COURSE_PRC = db.Column(db.Double, nullable=True)
    COURSE_NM = db.Column(db.Text, nullable=True)
    COURSE_NO = db.Column(db.Integer, nullable=True, primary_key=True)
    CTPRVN_NM = db.Column(db.Text, nullable=True)
    SIGNGU_NM = db.Column(db.Text, nullable=True)

# User 모델에 관계 추가
User.selections = db.relationship('userselection', back_populates='user', cascade="all, delete-orphan")

@app.route('/search', methods=['POST'])
def search():
    try:
        # JSON 데이터 파싱
        search_conditions = request.json

        if not search_conditions:
            return jsonify({'error': '검색 조건이 필요합니다.'}), 400

        # 기본 쿼리 설정
        query = db.session.query(usersearch)

        # 동적 검색 조건 추가
        for column, value in search_conditions.items():
            if hasattr(usersearch, column) and value:  # 해당 컬럼이 존재하고 값이 유효하면
                query = query.filter(getattr(usersearch, column).like(f"%{value}%"))  # 부분 일치 검색

        # 결과 조회
        results = query.all()

        # 결과를 JSON으로 변환
        search_results = [
            {
                'FCLTY_NM': result.FCLTY_NM,
                'ITEM_NM': result.ITEM_NM,
                'TROBL_TY_NM': result.TROBL_TY_NM,
                'COURSE_PRC': result.COURSE_PRC,
                'COURSE_NM': result.COURSE_NM,
                'COURSE_NO': result.COURSE_NO,
                'CTPRVN_NM': result.CTPRVN_NM,
                'SIGNGU_NM': result.SIGNGU_NM
            }
            for result in results
        ]

        return jsonify({
            'message': '검색 완료',
            'results': search_results
        }), 200

    except Exception as e:
        return jsonify({'error': f'서버 오류: {str(e)}'}), 500

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
        
        print(f"Received data: {data}") 
        token = data.get('token')  # 사용자 인증을 위한 JWT 토큰
        region = data.get('region')  # 클라이언트에서 전달한 현재 위치 정보 (예: 서울, 부산 등)
        
        print(token)
        print(region)
        
        if not token or not region:
            return jsonify({'error': '토큰과 지역 정보가 필요합니다.'}), 400
        
        # JWT 검증 및 사용자 ID 추출
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '토큰이 만료되었습니다.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': '유효하지 않은 토큰입니다.'}), 401

        # 사용자 선택 항목 조회
        selections = userselection.query.filter_by(user_id=user_id).all()
        selection_items = [selection.selected_item for selection in selections]

        # 선택 항목이 없을 경우
        if not selection_items:
            return jsonify({'message': '선택 항목이 없습니다.', 'selections': []}), 200

        # 추천 데이터 생성
        추천_결과 = []
        for 항목 in selection_items:
            try:
                # 항목 분리
                분리된_항목 = 항목.split(',')
                추천_데이터 = []

                for 단일_항목 in 분리된_항목:
                    if 단일_항목 not in item_nm.classes_:
                        print(f"항목 '{단일_항목}'은 학습된 라벨에 없습니다.")
                        continue

                    # 조건에 맞는 데이터 필터링
                    필터링된_데이터 = KS_sum[
                        (KS_sum['ITEM_NM'] == item_nm.transform([단일_항목])[0]) &
                        (KS_sum['TROBL_TY_NM'] == 0) &  # TROBL_TY_NM == 1 조건
                        (KS_sum['CTPRVN_NM'] == CTPRVN_NM.transform([region])[0])  # 전달된 지역으로 필터링
                    ]

                    # 데이터를 섞어서 무작위 추천
                    섞인_데이터 = 필터링된_데이터.sample(frac=1, random_state=random.randint(0, 1000))
                    추천_데이터.extend(섞인_데이터.head(8).to_dict(orient='records'))  # 상위 3개를 추천

                # 추천 데이터가 있을 경우 저장
                if 추천_데이터:
                    추천_결과.append({
                        '항목': 항목,
                        '추천 데이터': 추천_데이터
                    })

            except Exception as e:
                print(f"항목 {항목} 처리 중 오류 발생: {e}")

        # 추천 결과 응답
        return jsonify({
            'message': '추천 결과 생성 완료',
            'recommendations': 추천_결과
        }), 200

    except Exception as e:
        return jsonify({'error': f'서버 오류: {str(e)}'}), 500
    
@app.route('/saveSelections', methods=['POST'])
def save_selections():
    data = request.json
    token = data.get('token')
    selected_items = data.get('selectedItems')

    if not token or not selected_items:
        return jsonify({'error': '토큰과 선택 항목을 제공해야 합니다.'}), 400

    try:
        # JWT 토큰 검증
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': '토큰이 만료되었습니다.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': '유효하지 않은 토큰입니다.'}), 401

    # 선택 항목 처리
    try:
        # selectedItems가 문자열로 전달된 경우 리스트로 변환
        if isinstance(selected_items, str):
            selected_items = [item.strip() for item in selected_items.split(',')]

        # 디버깅: 변환 결과 확인
        print(f"Parsed selected_items: {selected_items}")

        # 리스트를 쉼표로 구분된 문자열로 변환
        selected_items_str = ','.join(selected_items)
        print(f"Final string to save: {selected_items_str}")

        # 새 레코드 생성
        new_selection = userselection(user_id=user_id, selected_item=selected_items_str)
        db.session.add(new_selection)
        db.session.commit()

        return jsonify({'message': '선택 항목이 성공적으로 저장되었습니다.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'선택 항목 저장에 실패했습니다: {str(e)}'}), 500

@app.route('/logout', methods=['POST'])
def logout():
    # 클라이언트 측에서 JWT 토큰 삭제를 요청했을 때
    return jsonify({'message': '로그아웃 성공', 'token': None}), 200

if __name__ == '__main__':
    app.run(debug=True)
