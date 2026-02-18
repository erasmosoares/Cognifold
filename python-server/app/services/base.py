from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

class BaseAgent(ABC):
    """
    Abstract base class that all agents must inherit from.
    Enforces a standard interface for execution.
    """

    @abstractmethod
    async def run(self, input_data: Any, context: Optional[Dict] = None) -> Any:
        """
        Execute the agent's main logic.
        
        Args:
            input_data: The primary input for the agent (e.g., query, theme, company).
            context: Optional dictionary for additional context (e.g., history, api_keys).
            
        Returns:
            The result of the agent's execution.
        """
        pass
