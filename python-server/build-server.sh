#!/bin/bash

# Ensure we are in the script directory
cd "$(dirname "$0")"

# Create venv if not exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Clean previous build
rm -rf build dist

# Build standalone executable works
# --onefile: bundle everything into one exe
# --name coinfac-server: name of the output
# --hidden-import: uvicorn.lifespan.off (sometimes needed for uvicorn)
# --clean: clean cache
echo "Building executable..."
pyinstaller --noconfirm --onefile --clean \
    --name cognifold-server \
    --hidden-import=uvicorn.logging \
    --hidden-import=uvicorn.loops \
    --hidden-import=uvicorn.loops.auto \
    --hidden-import=uvicorn.protocols \
    --hidden-import=uvicorn.protocols.http \
    --hidden-import=uvicorn.protocols.http.auto \
    --hidden-import=uvicorn.protocols.websockets \
    --hidden-import=uvicorn.protocols.websockets.auto \
    --hidden-import=uvicorn.lifespan.off \
    --add-data "Agents:Agents" \
    --collect-all crewai \
    --collect-all crewai_tools \
    main.py

echo "Build complete. Executable is likely in dist/cognifold-server"
