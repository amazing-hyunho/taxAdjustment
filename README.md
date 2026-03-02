# Local CSV Viewer for Accountants

로컬 환경에서 실행하는 CSV 뷰어입니다.  
CSV 업로드 → 로컬 DB 저장 → 전역 검색/필터 → 표 조회 → 선택 합계/복사 기능을 제공합니다.

---

## 🎯 목적

- 회계사용 로컬 데이터 뷰어
- 10만 행 규모에서도 빠른 조회
- 엑셀처럼 사용하되, 편집 기능은 없음 (단순 뷰어)

---

## 🧱 기술 스택

- Python 3.11+
- Streamlit
- DuckDB (로컬 DB 파일)
- pandas
- streamlit-aggrid

---

## 📂 프로젝트 구조 (예정)

```
.
├── app.py
├── db.py
├── ingest.py
├── data/                # 로컬 DB 파일 저장 (git 제외)
├── requirements.txt
├── README.md
└── AGENTS.md
```

---

## ⚙️ 실행 방법

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py
```

브라우저에서:
```
http://127.0.0.1:8501
```

---

## 📥 CSV 규칙

- CSV에는 실제 헤더명이 존재함
- 필수 컬럼:
  - 날짜 (date)
  - 구분번호 (group_no)
- 나머지 컬럼은 업로드마다 변경될 수 있음
- UTF-8 인코딩 권장

---

## 🔎 기능

### 1. CSV 업로드
- 업로드 후 DB에 저장
- import_id 단위로 관리

### 2. 전역 검색
- 모든 컬럼 대상 키워드 검색

### 3. 필터
- 날짜 범위
- 구분번호
- 키워드 포함 검색

### 4. 표 표시
- 동적 컬럼 표시
- 페이징 또는 limit 기반 조회

### 5. 선택 합계
- 행 다중 선택
- 숫자 컬럼 SUM 계산
- 쉼표 포함 숫자 지원

### 6. 복사
- 선택된 행을 TSV로 변환
- 텍스트 영역에 출력
- 사용자가 Ctrl+C로 복사

---

## ⚠️ 제약

- 한 번에 10만 행 전부 렌더링 금지
- 반드시 limit/페이징 사용
- 대용량 CSV는 업로드 시 배치 처리

---

## 🗄 DB 파일

- `data/app.duckdb`
- Git에 포함하지 않음
