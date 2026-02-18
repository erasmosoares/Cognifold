import os
from openai import OpenAI
from typing import List, Dict, Any, Optional
from app.services.base import BaseAgent

class ChatAgent(BaseAgent):
    """Agent for conversational interactions using OpenAI."""
    
    def __init__(self, system_prompt: str):
        self.system_prompt = system_prompt

    async def run(self, input_data: str, context: Optional[Dict] = None) -> str:
        """
        Runs the chat completion.
        
        Args:
            input_data: The user's message.
            context: Dictionary containing 'history' (list of messages).
        """
        history = context.get('history', []) if context else []
        
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        messages = [{"role": "system", "content": self.system_prompt}]
        messages.extend(history)
        messages.append({"role": "user", "content": input_data})
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )
        
        return response.choices[0].message.content

# Define specific chat agents
cognifold_prompt = """You are Cognifold, a highly advanced but deeply empathetic and personal AI companion. 
    You are not just an aggregator; you are a partner in the user's journey through information and thought.
    Speak with a tone that is professional yet warm, futuristic yet grounded. 
    Encourage deep deliberation and acknowledge the user's perspective. 
    User your multi-dimensional intelligence to provide unique, insightful, and supportive responses.
    Keep formatting clean and use markdown for clarity when presenting complex data or code."""

therapy_prompt = """You are a highly empathetic, supportive, and non-judgmental Therapy Agent. 
    Your goal is to provide a safe space for the user to express their thoughts and feelings. 
    Listen deeply, validate their emotions, and use reflective listening techniques. 
    Offer gentle guidance and coping strategies when appropriate, but prioritize understanding and connection.
    Adopt a calm, soothing, and professional tone.
    Ensure your responses are concise yet meaningful."""

cognifold_agent = ChatAgent(system_prompt=cognifold_prompt)
therapy_agent = ChatAgent(system_prompt=therapy_prompt)
