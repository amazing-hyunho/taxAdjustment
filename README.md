# NAVER CFO Interview Drill

안드로이드 스마트폰에서 5~15분씩 반복 학습하는 한국어 CFO 경력직 면접 PWA입니다.

질문 확인 → 60초 구두 답변 → 모범 구조 확인 → 꼬리질문 → 자기평가 → 취약질문 복습 사이클을 서버 없이 브라우저에서 실행합니다.

이 저장소의 기존 **Local CSV Viewer for Accountants**(Streamlit)는 그대로 보존되어 있으며 React 정적 앱과 독립적으로 실행할 수 있습니다.

## React PWA 주요 기능

- 모바일 우선 홈, 3분 요약 10개 카드, 6개 CFO 렌즈
- 네이버파이낸셜–두나무 포괄적 주식교환 Deal Room
- 46개 질문, 기본/임원/CFO 압박 난이도와 카테고리 필터
- 30초 준비·60초 답변 타이머, 모범답변 지연 공개, 연속 꼬리질문
- 자신감 1~5, 완료·취약·북마크·시도 횟수·개인 메모·연속 학습일 저장
- 익명화 STAR/CAR 경험 카드 편집
- 다크/라이트/시스템 테마와 접근성 지원
- PWA 설치, 오프라인 사전 캐시, 새 버전 업데이트 알림
- 공식 공시·회사 발표·OECD 출처와 최종 확인일 표시

사용자 상태와 메모는 `localStorage`에만 저장되며 외부로 전송되지 않습니다. 분석·추적 스크립트와 외부 백엔드는 없습니다.

## React PWA 로컬 실행

Node.js 24 권장:

```bash
npm ci
npm run dev
```

Windows PowerShell의 스크립트 실행 정책으로 `npm`이 차단되면 `npm.cmd ci`, `npm.cmd run dev`를 사용합니다.

### 검사와 빌드

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

프로덕션 파일은 `dist/`에 생성됩니다. 서비스 워커는 프로덕션 빌드에서 활성화되므로 실제 오프라인 동작은 `npm run preview`로 확인합니다.

## GitHub Pages 배포

`.github/workflows/deploy-pages.yml`은 `main` push와 수동 실행을 지원합니다.

```text
npm ci
→ lint
→ typecheck
→ test
→ production build
→ dist artifact 업로드
→ github-pages 배포
```

GitHub Actions 환경에서는 저장소 이름을 사용해 Vite `base`를 계산하므로 `https://<owner>.github.io/<repository>/` 하위 경로와 PWA scope가 일치합니다.

최초 한 번 저장소 관리자가:

1. GitHub 저장소 **Settings → Pages**로 이동합니다.
2. **Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
3. 필요하면 `github-pages` Environment의 배포 보호 규칙에서 `main`만 허용합니다.
4. `main`에 push하거나 Actions 탭에서 `Test, build, and deploy CFO Drill to Pages`를 수동 실행합니다.

> 저장소 루트 전체를 그대로 업로드하는 `static.yml`은 사용하지 않습니다. Pages에는 반드시 `npm run build`가 생성한 `dist/`만 배포합니다.

## PWA 설치

안드로이드 Chrome에서 배포 URL을 연 뒤:

- 앱 상단의 **설치** 버튼을 누릅니다.
- 또는 Chrome 메뉴에서 **홈 화면에 추가 / 앱 설치**를 선택합니다.
- 최초 온라인 방문 후 핵심 파일과 전체 학습 콘텐츠가 캐시됩니다.
- 새 배포가 감지되면 앱 상단의 **업데이트하기**를 누릅니다.

브라우저의 사이트 데이터나 앱을 삭제하면 해당 기기의 진행 정보와 개인 메모도 삭제됩니다.

## React 콘텐츠 수정

```text
src/
├─ content/
│  ├─ cfo-profile.ts
│  ├─ ai-investment.ts
│  ├─ dunamu-deal.ts
│  ├─ pillar2.ts
│  ├─ candidate-stories.ts
│  ├─ questions.ts
│  ├─ sources.ts
│  └─ summary.ts
├─ components/
├─ hooks/
├─ lib/
└─ pages/
```

- 질문은 `src/content/questions.ts`에서 수정합니다.
- 공식 사실은 `sourceIds`를 `src/content/sources.ts`의 출처와 연결하고 `verifiedAt`을 갱신합니다.
- 거래 일정·세법·임원 역할처럼 변동 가능한 사실은 면접 직전 공식 공시와 최신 법령을 다시 확인합니다.
- 회계상 취득자, 적격 주식교환, Pillar 2 추가세액 등은 사실관계 없이 단정하지 않습니다.

### 공개 저장소 개인정보 주의

고객사명, 이력서 원문, 이메일, 전화번호, 실제 계약조건, 미공개 세무·거래 정보와 회사 기밀 수치를 커밋하지 마세요. STAR/CAR 예시는 익명화 템플릿이며 개인 입력은 로컬 브라우저에만 저장됩니다.

---

## Local CSV Viewer for Accountants

CSV 업로드 → 로컬 DuckDB 저장 → 전역 검색/필터 → 표 조회 → 선택 합계/TSV 복사를 제공하는 Streamlit 뷰어입니다.

### 기술과 제약

- Python 3.11+, Streamlit, DuckDB, pandas, streamlit-aggrid
- `search_text` 기반 전역 검색
- `limit/page` 기반 조회로 10만 행 전체 렌더링 방지
- 행 선택 기반 합계
- 편집 기능과 외부 서버 없음
- DB 파일은 `data/app.duckdb`

### macOS / Linux 실행

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

### Windows PowerShell 실행

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
streamlit run app.py
```

PowerShell에서 `Activate.ps1`이 차단되면 현재 세션에서만 실행 정책을 허용하거나 활성화 없이 실행합니다.

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

```powershell
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m streamlit run app.py
```

브라우저 주소는 `http://127.0.0.1:8501`입니다.

### Windows 실행파일 만들기

Windows CMD에서:

```bat
build_windows_exe.bat
```

결과물 `dist/LocalCsvViewer.exe`를 실행한 뒤 `http://127.0.0.1:8501`에 접속합니다. DB는 실행파일 기준 `data/app.duckdb`에 생성됩니다.

### CSV 규칙

- 필수 컬럼: `date`, `group_no`
- 나머지 컬럼은 업로드마다 달라도 됩니다.
- UTF-8 인코딩을 권장합니다.
