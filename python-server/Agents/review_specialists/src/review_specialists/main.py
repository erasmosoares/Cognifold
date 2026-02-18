#!/usr/bin/env python
import os
import warnings

from review_specialists.crew import ReviewSpecialists

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# Create output directory if it doesn't exist
os.makedirs("output", exist_ok=True)

def run():
    """
    Run the crew.
    """
    theme = "The Matrix (Movie)" # Default for testing
    inputs = {"theme": theme}

    try:
        result = ReviewSpecialists().review_specialists_crew().kickoff(inputs=inputs)
        print("\n\n=== FINAL REVIEW VERDICT ===\n\n")
        print(result.raw)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

if __name__ == "__main__":
    run()
