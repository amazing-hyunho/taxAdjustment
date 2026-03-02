from __future__ import annotations

import json
import uuid
from typing import BinaryIO

import pandas as pd

from db import insert_import, insert_rows

REQUIRED_COLUMNS = {"date", "group_no"}
CSV_ENCODINGS = ["utf-8", "cp949", "euc-kr"]


def _read_csv_with_fallback(uploaded_file: BinaryIO) -> pd.DataFrame:
    last_decode_error: UnicodeDecodeError | None = None

    for encoding in CSV_ENCODINGS:
        try:
            uploaded_file.seek(0)
            return pd.read_csv(uploaded_file, encoding=encoding)
        except UnicodeDecodeError as exc:
            last_decode_error = exc
            continue

    if last_decode_error is not None:
        raise ValueError(
            "CSV 인코딩을 해석할 수 없습니다. utf-8, cp949, euc-kr 인코딩 파일인지 확인해주세요."
        ) from last_decode_error

    raise ValueError("CSV를 읽을 수 없습니다.")


def _normalize_date(series: pd.Series) -> pd.Series:
    parsed = pd.to_datetime(series, errors="coerce")
    return parsed.dt.date


def _build_search_text(df: pd.DataFrame) -> pd.Series:
    return (
        df.fillna("")
        .astype(str)
        .agg(" ".join, axis=1)
        .str.lower()
    )


def _build_json_rows(df: pd.DataFrame) -> pd.Series:
    return df.fillna("").apply(lambda r: json.dumps(r.to_dict(), ensure_ascii=False), axis=1)


def ingest_csv(uploaded_file: BinaryIO) -> str:
    df = _read_csv_with_fallback(uploaded_file)
    missing = REQUIRED_COLUMNS.difference(df.columns)
    if missing:
        missing_cols = ", ".join(sorted(missing))
        raise ValueError(f"필수 컬럼이 없습니다: {missing_cols}")

    import_id = uuid.uuid4().hex[:12]
    prepared = pd.DataFrame(
        {
            "import_id": import_id,
            "row_num": range(1, len(df) + 1),
            "date_value": _normalize_date(df["date"]),
            "group_no": df["group_no"].fillna("").astype(str),
            "search_text": _build_search_text(df),
            "data_json": _build_json_rows(df),
        }
    )

    insert_import(import_id=import_id, file_name=getattr(uploaded_file, "name", "uploaded.csv"), row_count=len(df))
    insert_rows(prepared)
    return import_id
