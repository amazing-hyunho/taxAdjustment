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

## 📂 프로젝트 구조

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

### macOS / Linux

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

### Windows (PowerShell)

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
streamlit run app.py
```

> PowerShell에서 `Activate.ps1` 실행이 차단되면(ExecutionPolicy 오류) 아래 중 하나를 사용하세요.
>
> 1) 현재 세션에서만 임시 허용
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> .\.venv\Scripts\Activate.ps1
> ```
>
> 2) 활성화 없이 바로 실행
>
> ```powershell
> .\.venv\Scripts\python -m pip install -r requirements.txt
> .\.venv\Scripts\python -m streamlit run app.py
> ```

브라우저에서:

```
http://127.0.0.1:8501
```

---

## 🪟 Windows 실행파일(.exe) 만들기

개발자가 1회 빌드해서 `dist/LocalCsvViewer.exe`를 전달하면,
일반 사용자는 Python 설치 없이 exe 실행만으로 앱을 사용할 수 있습니다.

### 빌드 (개발자)

Windows CMD에서 프로젝트 루트에서 실행:

```bat
build_windows_exe.bat
```

빌드 결과:

- `dist/LocalCsvViewer.exe`

### 사용 (일반 사용자)

1. `LocalCsvViewer.exe`를 원하는 폴더에 둡니다.
2. 실행 후 브라우저에서 `http://127.0.0.1:8501` 접속합니다.
3. DB 파일은 실행 폴더 기준 `data/app.duckdb`에 생성됩니다.

> 참고: 첫 실행 시 Windows 방화벽 확인 창이 뜰 수 있습니다. 로컬호스트(127.0.0.1) 사용만 허용하면 됩니다.


---

## 📥 CSV 규칙

- CSV에는 실제 헤더명이 존재함
- 필수 컬럼:
  - 날짜 (`date`)
  - 구분번호 (`group_no`)
- 나머지 컬럼은 업로드마다 변경될 수 있음
- UTF-8 인코딩 권장

---

## 🔎 기능

### 1. CSV 업로드

- 업로드 후 DB에 저장
- `import_id` 단위로 관리

### 2. 전역 검색

- `search_text` 기반 키워드 검색

### 3. 필터

- 날짜 범위
- 구분번호
- 키워드 포함 검색

### 4. 표 표시

- 동적 컬럼 표시
- 페이징(`limit/page`) 기반 조회

### 5. 선택 합계

- 행 다중 선택
- **행 선택 기반** 숫자 컬럼 SUM 계산
- 쉼표 포함 숫자 지원

### 6. 복사

- 선택된 행을 TSV로 변환
- 텍스트 영역에 출력
- 사용자가 Ctrl+C로 복사

---

## ⚠️ 제약

- 한 번에 10만 행 전부 렌더링 금지
- 반드시 `limit`/페이징 사용
- 외부 서버 사용 금지
- 편집 기능 미구현 (뷰어 전용)

---

## 🗄 DB 파일

- `data/app.duckdb`
- Git에 포함하지 않음
