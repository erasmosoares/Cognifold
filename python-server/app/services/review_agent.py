import sys
import os
import asyncio
from typing import Any, Dict, Optional
from app.core.logging import LogStream
from app.services.base import BaseAgent

def get_review_path():
    """Returns the path to the review specialists source."""
    if getattr(sys, 'frozen', False):
        # If the application is run as a bundle, the PyInstaller bootloader
        # extends the sys module by a flag frozen=True and sets the app 
        # path into variable _MEIPASS'.
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    return os.path.join(base_path, 'Agents', 'review_specialists', 'src')

class ReviewAgent(BaseAgent):
    """Agent for reviewing a topic with a council of specialists."""

    async def run(self, input_data: str, context: Optional[Dict] = None) -> str:
        """
        Runs the review specialists crew.
        
        Args:
            input_data: The theme/topic to review.
        """
        theme = input_data
        
        # Add review_specialists to path
        review_path = get_review_path()
        if review_path not in sys.path:
            sys.path.append(review_path)
        
        try:
            from review_specialists.crew import ReviewSpecialists
        except ImportError as e:
            # Debug: List files in the review_path to see what's there
            try:
                files = os.listdir(review_path)
                # Check for inner dir content too if possible
                inner_path = os.path.join(review_path, 'review_specialists')
                inner_files = os.listdir(inner_path) if os.path.exists(inner_path) else "Not Found"
                debug_info = f"Contents of {review_path}: {files}. Inner: {inner_files}"
            except Exception as list_err:
                 debug_info = f"Could not list {review_path}: {list_err}"
            return f"Error importing review_specialists: {str(e)}. Path: {review_path}. Debug: {debug_info}"

        inputs = {'theme': theme}
        
        def _run():
            old_stdout = sys.stdout
            sys.stdout = LogStream()
            try:
                return ReviewSpecialists().review_specialists_crew().kickoff(inputs=inputs)
            finally:
                sys.stdout = old_stdout

        result = await asyncio.to_thread(_run)
        return getattr(result, 'raw', str(result))

# Singleton instance for easy import
review_agent = ReviewAgent()
