from __future__ import annotations

from pathlib import Path
from typing import Any

import duckdb
import pandas as pd

DB_PATH = Path("data") / "app.duckdb"


def ensure_data_dir() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_connection() -> duckdb.DuckDBPyConnection:
    ensure_data_dir()
    return duckdb.connect(str(DB_PATH))


def init_db() -> None:
    con = get_connection()
    try:
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS imports (
                import_id VARCHAR PRIMARY KEY,
                file_name VARCHAR NOT NULL,
                created_at TIMESTAMP DEFAULT current_timestamp,
                row_count BIGINT NOT NULL
            )
            """
        )
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS rows_data (
                import_id VARCHAR NOT NULL,
                row_num BIGINT NOT NULL,
                date_value DATE,
                group_no VARCHAR,
                search_text VARCHAR,
                data_json JSON,
                PRIMARY KEY (import_id, row_num)
            )
            """
        )
    finally:
        con.close()


def insert_import(import_id: str, file_name: str, row_count: int) -> None:
    con = get_connection()
    try:
        con.execute(
            "INSERT INTO imports (import_id, file_name, row_count) VALUES (?, ?, ?)",
            [import_id, file_name, row_count],
        )
    finally:
        con.close()


def insert_rows(rows_df: pd.DataFrame) -> None:
    con = get_connection()
    try:
        con.register("rows_df", rows_df)
        con.execute(
            """
            INSERT INTO rows_data
            SELECT import_id, row_num, date_value, group_no, search_text, data_json
            FROM rows_df
            """
        )
    finally:
        con.close()


def list_imports() -> pd.DataFrame:
    con = get_connection()
    try:
        return con.execute(
            """
            SELECT import_id, file_name, created_at, row_count
            FROM imports
            ORDER BY created_at DESC
            """
        ).df()
    finally:
        con.close()


def _build_where(filters: dict[str, Any]) -> tuple[str, list[Any]]:
    clauses = ["import_id = ?"]
    params: list[Any] = [filters["import_id"]]

    if filters.get("search_text"):
        clauses.append("search_text LIKE ?")
        params.append(f"%{filters['search_text'].lower()}%")

    if filters.get("date_from") is not None:
        clauses.append("date_value >= ?")
        params.append(filters["date_from"])

    if filters.get("date_to") is not None:
        clauses.append("date_value <= ?")
        params.append(filters["date_to"])

    if filters.get("group_no"):
        clauses.append("group_no = ?")
        params.append(filters["group_no"])

    return " AND ".join(clauses), params


def query_rows(
    *,
    import_id: str,
    search_text: str | None,
    date_from,
    date_to,
    group_no: str | None,
    limit: int,
    offset: int,
) -> pd.DataFrame:
    filters = {
        "import_id": import_id,
        "search_text": (search_text or "").strip(),
        "date_from": date_from,
        "date_to": date_to,
        "group_no": (group_no or "").strip(),
    }
    where_sql, params = _build_where(filters)

    con = get_connection()
    try:
        return con.execute(
            f"""
            SELECT row_num, date_value, group_no, data_json
            FROM rows_data
            WHERE {where_sql}
            ORDER BY row_num
            LIMIT ? OFFSET ?
            """,
            [*params, limit, offset],
        ).df()
    finally:
        con.close()


def count_rows(
    *,
    import_id: str,
    search_text: str | None,
    date_from,
    date_to,
    group_no: str | None,
) -> int:
    filters = {
        "import_id": import_id,
        "search_text": (search_text or "").strip(),
        "date_from": date_from,
        "date_to": date_to,
        "group_no": (group_no or "").strip(),
    }
    where_sql, params = _build_where(filters)

    con = get_connection()
    try:
        row = con.execute(
            f"SELECT COUNT(*) AS cnt FROM rows_data WHERE {where_sql}",
            params,
        ).fetchone()
        return int(row[0]) if row else 0
    finally:
        con.close()


def list_group_numbers(import_id: str) -> list[str]:
    con = get_connection()
    try:
        rows = con.execute(
            """
            SELECT DISTINCT group_no
            FROM rows_data
            WHERE import_id = ? AND group_no IS NOT NULL AND group_no != ''
            ORDER BY group_no
            """,
            [import_id],
        ).fetchall()
        return [str(r[0]) for r in rows]
    finally:
        con.close()


def get_date_bounds(import_id: str) -> tuple[Any, Any]:
    con = get_connection()
    try:
        result = con.execute(
            "SELECT MIN(date_value), MAX(date_value) FROM rows_data WHERE import_id = ?",
            [import_id],
        ).fetchone()
        if not result:
            return None, None
        return result[0], result[1]
    finally:
        con.close()
