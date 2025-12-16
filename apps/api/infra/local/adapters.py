import os
import aiofiles
from typing import Any, Dict, Optional
from datetime import datetime
from apps.api.core.ports import FileStoragePort, EventBusPort, TaskQueuePort, EmailPort, MalwareScannerPort
import json

# Local File Storage Adapter
class LocalFileStorageAdapter(FileStoragePort):
    def __init__(self, upload_dir: str = "./data/uploads"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    async def upload(self, file_path: str, content: bytes, content_type: str = "application/octet-stream") -> str:
        # In local adapter, file_path is treated as relative path within upload_dir
        # Sanitize file_path to prevent directory traversal
        full_path = os.path.join(self.upload_dir, os.path.basename(file_path))
        async with aiofiles.open(full_path, 'wb') as f:
            await f.write(content)
        return full_path

    async def download(self, storage_uri: str) -> bytes:
        async with aiofiles.open(storage_uri, 'rb') as f:
            return await f.read()

    async def delete(self, storage_uri: str) -> bool:
        try:
            os.remove(storage_uri)
            return True
        except FileNotFoundError:
            return False

# Local Event Bus Adapter (In-Memory / Console Log for dev)
class LocalEventBusAdapter(EventBusPort):
    async def publish(self, topic: str, message: Dict[str, Any]) -> None:
        print(f"[LocalEventBus] Published to {topic}: {json.dumps(message, default=str)}")
        # In a real local setup, this might push to Redis PubSub if implemented
        pass

    async def subscribe(self, topic: str, handler: Any) -> None:
        print(f"[LocalEventBus] Subscribed to {topic}")
        pass

# Local Task Queue Adapter (Stub printing to console, or wrapping celery later)
class LocalTaskQueueAdapter(TaskQueuePort):
    async def enqueue(self, task_name: str, payload: Dict[str, Any], deploy_at: Optional[datetime] = None) -> str:
        print(f"[LocalTaskQueue] Enqueued {task_name} (deploy_at={deploy_at}): {json.dumps(payload, default=str)}")
        return "task-id-stub"

# Local Email Adapter (Console Log / Mailhog stub)
# For now, it just prints, but in docker-compose we have Mailhog.
# To use Mailhog, we would use an SMTP client.
class LocalEmailAdapter(EmailPort):
    async def send_email(self, to_email: str, subject: str, body: str, html: bool = False) -> bool:
        print(f"--- [LocalEmail] To: {to_email} | Subject: {subject} ---")
        print(body)
        print("----------------------------------------------------------")
        return True

class LocalMalwareScannerAdapter(MalwareScannerPort):
    async def scan(self, content: bytes) -> bool:
        # No-op pass for local dev
        return True
