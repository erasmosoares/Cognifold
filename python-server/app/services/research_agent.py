import sys
import os
import asyncio
from typing import Any, Dict, Optional
from app.core.logging import LogStream
from app.services.base import BaseAgent

def get_research_path():
    """Returns the path to the research agent source."""
    if getattr(sys, 'frozen', False):
         base_path = sys._MEIPASS
    else:
         base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    return os.path.join(base_path, 'Agents', 'financial_researcher', 'src')

class ResearchAgent(BaseAgent):
    """Agent for conducting financial research on a company."""
    
    async def run(self, input_data: str, context: Optional[Dict] = None) -> str:
        """
        Runs the financial research crew.
        
        Args:
            input_data: The company name to research.
        """
        company = input_data
        
        # Add financial_researcher to path
        research_path = get_research_path()
        if research_path not in sys.path:
            sys.path.append(research_path)
        
        try:
            from financial_researcher.crew import ResearchCrew
        except ImportError as e:
            # Debug info
            try:
                files = os.listdir(research_path)
                inner_path = os.path.join(research_path, 'financial_researcher')
                inner_files = os.listdir(inner_path) if os.path.exists(inner_path) else "Not Found"
                debug_info = f"Contents of {research_path}: {files}. Inner: {inner_files}"
            except Exception as list_err:
                debug_info = f"Could not list {research_path}: {list_err}"
            return f"Error importing financial_researcher: {str(e)}. Path: {research_path}. Debug: {debug_info}"

        inputs = {'company': company}

        def _run():
            old_stdout = sys.stdout
            sys.stdout = LogStream()
            try:
                return ResearchCrew().crew().kickoff(inputs=inputs)
            finally:
                sys.stdout = old_stdout

        result = await asyncio.to_thread(_run)
        return getattr(result, 'raw', str(result))

# Singleton instance for easy import
research_agent = ResearchAgent()
