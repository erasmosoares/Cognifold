import os
import sys
from dotenv import load_dotenv

def load_config():
    """Loads environment variables from .env file."""
    # Determine if running in a bundle or dev environment
    if getattr(sys, 'frozen', False):
        application_path = os.path.dirname(sys.executable)
    else:
        # Go up two levels from app/core/ to reach python-server root
        application_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    env_path = os.path.join(application_path, '.env')
    load_dotenv(dotenv_path=env_path, override=True)
