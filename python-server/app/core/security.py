import os
from typing import Optional

def set_keys(openai_key: Optional[str], serper_key: Optional[str]):
    """Sets API keys in environment variables for agents to use."""
    if openai_key:
        os.environ["OPENAI_API_KEY"] = openai_key
    if serper_key:
        os.environ["SERPER_API_KEY"] = serper_key
