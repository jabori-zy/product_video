#!/bin/sh
# run multi.py with NumPy + Pillow provided by uv
exec uv run -q --no-project --with numpy --with pillow python "$(dirname "$0")/multi.py" "$@"
