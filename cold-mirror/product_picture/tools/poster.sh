#!/bin/sh
# run poster.py with NumPy, SciPy and Pillow provided by uv
exec uv run -q --no-project --with numpy --with scipy --with pillow python "$(dirname "$0")/poster.py" "$@"
