import sys
import queue
import asyncio
from sse_starlette.sse import EventSourceResponse

# Global log queue for SSE
log_queue = queue.Queue()

class LogStream:
    """Redirects stdout to a queue for real-time streaming."""
    def write(self, data):
        if data.strip():
            log_queue.put(data.strip())
        sys.__stdout__.write(data)
    
    def flush(self):
        sys.__stdout__.flush()

async def log_generator():
    """Generator for Server-Sent Events."""
    while True:
        try:
            # Non-blocking queue check
            log = log_queue.get_nowait()
            yield {"data": log}
        except queue.Empty:
            # If queue is empty, send a heartbeat and wait
            await asyncio.sleep(0.5)
            yield {"comment": "heartbeat"}
        except Exception as e:
            yield {"data": f"Error: {str(e)}"}
            break

def get_sse_response():
    """Returns an EventSourceResponse for log streaming."""
    return EventSourceResponse(log_generator())
