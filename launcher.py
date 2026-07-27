from __future__ import annotations

import os
import sys
from pathlib import Path

from streamlit.web import cli as stcli


def _resolve_app_path() -> str:
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        base_dir = Path(sys._MEIPASS)  # type: ignore[attr-defined]
    else:
        base_dir = Path(__file__).resolve().parent
    return str(base_dir / "app.py")


def main() -> None:
    app_path = _resolve_app_path()

    if not Path(app_path).exists():
        raise FileNotFoundError(f"app.py not found: {app_path}")

    os.environ.setdefault("STREAMLIT_BROWSER_GATHER_USAGE_STATS", "false")

    sys.argv = [
        "streamlit",
        "run",
        app_path,
        "--server.address",
        "127.0.0.1",
        "--server.port",
        "8501",
    ]
    sys.exit(stcli.main())


if __name__ == "__main__":
    main()
