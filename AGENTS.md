# Agent Instructions

이 프로젝트는 로컬 Streamlit 기반 CSV 뷰어입니다.

## 핵심 규칙

1. 10만 행에서도 UI가 멈추지 않도록 반드시 limit 또는 pagination 사용.
2. 전역 검색은 search_text 필드 기반으로 구현.
3. 선택 합계는 "행 선택 기반".
4. 복사는 TSV 텍스트 영역 방식.
5. 단순 뷰어 목적이므로 편집 기능은 구현하지 않는다.
6. DB 파일은 data/ 폴더에 저장.
7. 코드 가독성 우선, 함수 분리 필수.

## 금지 사항

- 모든 행을 한 번에 st.dataframe으로 렌더링 금지.
- 외부 서버 사용 금지.
- Enterprise 라이선스 기능 사용 금지.

## 목표

`streamlit run app.py` 한 번으로 실행 가능해야 한다.
