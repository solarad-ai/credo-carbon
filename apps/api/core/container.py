from apps.api.core.ports import FileStoragePort, EventBusPort, TaskQueuePort, EmailPort, MalwareScannerPort
from apps.api.infra.local.adapters import LocalFileStorageAdapter, LocalEventBusAdapter, LocalTaskQueueAdapter, LocalEmailAdapter, LocalMalwareScannerAdapter
import os

class Container:
    def __init__(self):
        # Read env to decide adapters
        self.storage_backend = os.getenv("STORAGE_BACKEND", "local")
        self.event_backend = os.getenv("EVENT_BACKEND", "local")

        # Initialize Ports
        self.file_storage: FileStoragePort = LocalFileStorageAdapter()
        self.event_bus: EventBusPort = LocalEventBusAdapter()
        self.task_queue: TaskQueuePort = LocalTaskQueueAdapter()
        self.email_service: EmailPort = LocalEmailAdapter()
        self.malware_scanner: MalwareScannerPort = LocalMalwareScannerAdapter()

container = Container()
