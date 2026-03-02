from __future__ import annotations

import json
from math import ceil

import pandas as pd
import streamlit as st
from st_aggrid import AgGrid, GridOptionsBuilder

from db import count_rows, get_date_bounds, init_db, list_group_numbers, list_imports, query_rows
from ingest import ingest_csv


def _safe_to_number(value):
    if value is None:
        return None
    text = str(value).strip().replace(",", "")
    if text == "":
        return None
    try:
        return float(text)
    except ValueError:
        return None


def selected_sum_table(selected_df: pd.DataFrame) -> pd.DataFrame:
    if selected_df.empty:
        return pd.DataFrame(columns=["column", "sum"])

    sums = []
    for col in selected_df.columns:
        numbers = selected_df[col].apply(_safe_to_number).dropna()
        if not numbers.empty:
            sums.append({"column": col, "sum": float(numbers.sum())})
    return pd.DataFrame(sums)


def rows_to_tsv(df: pd.DataFrame) -> str:
    if df.empty:
        return ""
    return df.to_csv(sep="\t", index=False)


def build_grid_options(df: pd.DataFrame):
    gb = GridOptionsBuilder.from_dataframe(df)
    gb.configure_selection("multiple", use_checkbox=True)
    gb.configure_default_column(filterable=True, sortable=True, resizable=True)
    gb.configure_grid_options(suppressCellFocus=False)
    return gb.build()


def decode_rows(raw_df: pd.DataFrame) -> pd.DataFrame:
    if raw_df.empty:
        return pd.DataFrame()

    records = [json.loads(v) for v in raw_df["data_json"].tolist()]
    df = pd.DataFrame(records)
    df.insert(0, "row_num", raw_df["row_num"].values)
    return df


def render_upload_section() -> None:
    st.subheader("CSV 업로드")
    uploaded = st.file_uploader("CSV 파일 업로드", type=["csv"])
    if uploaded is None:
        return

    if st.button("DB로 저장", use_container_width=True):
        try:
            import_id = ingest_csv(uploaded)
            st.success(f"저장 완료: import_id={import_id}")
        except Exception as exc:
            st.error(f"업로드 실패: {exc}")


def render_filters(import_id: str):
    st.subheader("조회 필터")

    c1, c2 = st.columns(2)
    with c1:
        search_text = st.text_input("전역 검색 (search_text)", value="")
    with c2:
        group_options = ["전체"] + list_group_numbers(import_id)
        selected_group = st.selectbox("구분번호", options=group_options)

    min_date, max_date = get_date_bounds(import_id)
    if min_date and max_date:
        date_range = st.date_input("날짜 범위", value=(min_date, max_date), min_value=min_date, max_value=max_date)
        if isinstance(date_range, tuple) and len(date_range) == 2:
            date_from, date_to = date_range
        else:
            date_from, date_to = min_date, max_date
    else:
        date_from, date_to = None, None

    c3, c4 = st.columns(2)
    with c3:
        limit = st.number_input("조회 limit", min_value=50, max_value=5000, value=500, step=50)
    with c4:
        page = st.number_input("페이지", min_value=1, value=1, step=1)

    return {
        "search_text": search_text,
        "group_no": "" if selected_group == "전체" else selected_group,
        "date_from": date_from,
        "date_to": date_to,
        "limit": int(limit),
        "page": int(page),
    }


def render_grid(import_id: str, filters: dict):
    offset = (filters["page"] - 1) * filters["limit"]
    total_rows = count_rows(
        import_id=import_id,
        search_text=filters["search_text"],
        date_from=filters["date_from"],
        date_to=filters["date_to"],
        group_no=filters["group_no"],
    )
    total_pages = max(1, ceil(total_rows / filters["limit"])) if filters["limit"] else 1
    st.caption(f"조회 결과: {total_rows:,}건 / 페이지 {filters['page']} / {total_pages}")

    raw_df = query_rows(
        import_id=import_id,
        search_text=filters["search_text"],
        date_from=filters["date_from"],
        date_to=filters["date_to"],
        group_no=filters["group_no"],
        limit=filters["limit"],
        offset=offset,
    )
    display_df = decode_rows(raw_df)

    if display_df.empty:
        st.info("조건에 맞는 데이터가 없습니다.")
        return

    grid_response = AgGrid(
        display_df,
        gridOptions=build_grid_options(display_df),
        height=420,
        fit_columns_on_grid_load=True,
        allow_unsafe_jscode=False,
        update_mode="SELECTION_CHANGED",
    )

    selected_df = pd.DataFrame(grid_response.get("selected_rows", []))
    st.subheader("선택 행 합계")
    sum_df = selected_sum_table(selected_df)
    if sum_df.empty:
        st.write("선택된 행이 없거나 숫자형 컬럼이 없습니다.")
    else:
        st.dataframe(sum_df, use_container_width=True)

    st.subheader("선택 행 TSV")
    st.text_area("복사용 TSV", value=rows_to_tsv(selected_df), height=180)


def main() -> None:
    st.set_page_config(page_title="Local CSV Viewer", layout="wide")
    st.title("Local CSV Viewer for Accountants")

    init_db()
    render_upload_section()

    imports_df = list_imports()
    if imports_df.empty:
        st.info("먼저 CSV를 업로드 해주세요.")
        return

    st.subheader("import 선택")
    options = [f"{row.import_id} | {row.file_name} | {int(row.row_count):,} rows" for row in imports_df.itertuples()]
    selected_label = st.selectbox("조회할 import 선택", options=options)
    selected_import_id = selected_label.split(" | ")[0]

    filters = render_filters(selected_import_id)
    render_grid(selected_import_id, filters)


if __name__ == "__main__":
    main()
