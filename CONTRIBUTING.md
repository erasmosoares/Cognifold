# Contributing to Cognifold

Thank you for your interest in contributing! We want to make it as easy as possible to add new agents and capabilities to Cognifold.

## Project Structure

This project uses a modular architecture separating the backend intelligence from the frontend interface.

```
project/
├── python-server/              # FastAPI Backend
│   ├── app/
│   │   ├── services/           # Agent Logic (Add new agents here)
│   │   ├── api/                # API Routes
│   │   ├── core/               # Config, Logging, Security
│   │   └── models/             # Pydantic Models
│   └── main.py                 # Entry Point
│
├── src/renderer/src/           # React Frontend
│   ├── components/
│   │   └── modules/            # UI Modules for agents
│   └── ...
```

## How to Add a New Agent

Adding a new agent involves three steps:

### 1. Create the Backend Service
Create a new file in `python-server/app/services/your_agent.py`. Inherit from `BaseAgent` and implement the `run` method.

```python
from app.services.base import BaseAgent
from typing import Optional, Dict

class YourAgent(BaseAgent):
    async def run(self, input_data: str, context: Optional[Dict] = None) -> str:
        # Your agent logic here (e.g., CrewAI, LangChain, etc.)
        return "Agent Result"

your_agent = YourAgent()
```

### 2. Register the Endpoint
Update `python-server/app/api/router.py` to expose your agent:

```python
from app.services.your_agent import your_agent

@router.post("/your-agent-endpoint")
async def run_your_agent(request: YourRequestModel):
    return await your_agent.run(request.data)
```

### 3. Add Frontend UI
Create a new component in `src/renderer/src/components/modules/` to interact with your new endpoint.

## Development Setup

The project is designed to be as "plug-and-play" as possible. 

1. **Quick Start**:
   ```bash
   npm install
   npm run dev
   ```
   *The application will automatically detect if the Python virtual environment is missing and run the setup for you.*

2. **Manual Backend Setup** (If automation fails):
   ```bash
   cd python-server
   ./build-server.sh  # Creates venv and installs deps
   python main.py     # Runs server standalone
   ```

## Coding Standards
- **Backend**: Use Pydantic for data validation. Inherit from `BaseAgent`.
- **Frontend**: Use Chakra UI for styling to match the Cognifold aesthetic.

## Deployment & Distribution

To build the application for production, you must first compile the Python backend and then bundle the Electron app.

### 1. Build the Python Server
We use PyInstaller to create a standalone executable that doesn't require the user to have Python installed.

```bash
cd python-server
./build-server.sh
```
*This will create the `cognifold-server` executable in `python-server/dist/`.*

### 2. Build the Electron App

Once the Python server is built, you can package the entire application.

#### For macOS
```bash
# Builds a .dmg and .app
npm run build:mac
```
*Note: This will look for `resources/icon.icns` for the app icon.*

#### For Windows
```bash
# Builds an .exe and installer
npm run build:win
```
*Note: This will look for `resources/icon.ico` for the app icon.*

### Troubleshooting Builds
- **Icon Errors**: If the build fails due to missing icons, ensure `resources/icon.icns` (Mac) or `resources/icon.ico` (Windows) exist. You can generate them from a high-res PNG using standard tools.
- **Python Path**: The `electron-builder.yml` is configured to copy the `cognifold-server` from `python-server/dist/`. Ensure step 1 was successful.
