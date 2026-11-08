"""
Rewrite imports across the cane package.

Maps old backend-relative imports to new package-relative imports.
Run from the repo root: python rewrite_imports.py
"""
import os
import re

# Old import -> New import mapping
# Order matters: longer/more specific patterns first
IMPORT_MAP = [
    # Services -> new locations
    ("from services.claude import", "from cane.inference.claude import"),
    ("from services.claude ", "from cane.inference.claude "),
    ("from services.inference import", "from cane.inference.routing import"),
    ("from services.inference ", "from cane.inference.routing "),
    ("from services.model_router import", "from cane.inference.router import"),
    ("from services.judge_providers import", "from cane.inference.providers import"),
    ("from services.search import", "from cane.rag.search import"),
    ("from services.rag import", "from cane.rag.context import"),
    ("from services.chroma import", "from cane.rag.chroma import"),
    ("from services.memory import", "from cane.agents.memory import"),
    ("from services.game_memory import", "from cane.game.memory import"),
    ("from services.personality_eval import", "from cane.eval.personality import"),
    ("from services.tools import", "from cane.tools.registry import"),
    ("from services.mcp_client import", "from cane.tools.mcp import"),
    ("from services.analytics import", "from cane.core.analytics import"),
    ("from services.limits import", "from cane.core.limits import"),
    ("from services.rate_limit import", "from cane.core.rate_limit import"),
    ("from services.crypto import", "from cane.core.crypto import"),
    ("from services.schedule_runner import", "from cane.agents.schedule_runner import"),
    ("from services.eval_schedule_runner import", "from cane.eval.schedule_runner import"),
    ("from services.connector_sync import", "from cane.integrations.connector_sync import"),
    ("from services.guest_cleanup import", "from cane.core.guest_cleanup import"),
    ("from services.gdrive import", "from cane.integrations.gdrive import"),
    ("import services.gdrive", "import cane.integrations.gdrive"),
    ("from services.s3 import", "from cane.integrations.s3 import"),
    ("import services.s3", "import cane.integrations.s3"),
    ("from services.osint_parser import", "from cane.integrations.osint_parser import"),

    # Model files
    ("from eval_models import", "from cane.eval.models import"),
    ("from marketplace_models import", "from cane.core.marketplace_models import"),
    ("from tool_models import", "from cane.tools.models import"),
    ("from connector_models import", "from cane.integrations.connector_models import"),
    ("from schedule_models import", "from cane.agents.schedule_models import"),
    ("from memory_models import", "from cane.agents.memory_models import"),
    ("from conversation_models import", "from cane.agents.conversation_models import"),
    ("from analytics_models import", "from cane.core.analytics_models import"),
    ("from game_models import", "from cane.game.models import"),
    ("from mcp_models import", "from cane.tools.mcp_models import"),
    ("from osint_models import", "from cane.integrations.osint_models import"),
    ("from mcp_catalog import", "from cane.tools.mcp_catalog import"),
    ("import game_models", "import cane.game.models"),

    # Core files
    ("from config import", "from cane.core.config import"),
    ("from database import", "from cane.core.database import"),
    ("from db_models import", "from cane.core.models import"),
    ("from security import", "from cane.core.security import"),
    ("from auth import", "from cane.auth.jwt import"),
    ("from migrations import", "from cane.core.migrations import"),
    ("import migrations", "import cane.core.migrations"),

    # Backend root files
    ("from eval_engine import", "from cane.eval.engine import"),
    ("from failure_mining import", "from cane.eval.mining import"),
    ("from root_cause_analysis import", "from cane.eval.rca import"),
    ("from tool_executor import", "from cane.tools.executor import"),
    ("from agent_prompts import", "from cane.agents.prompts import"),
    ("from streaming import", "from cane.agents.streaming import"),
    ("from ingestor import", "from cane.rag.ingestor import"),
    ("from smart_chunker import", "from cane.rag.chunker import"),
    ("from chunk_enricher import", "from cane.rag.enricher import"),
    ("from chunk_quality import", "from cane.rag.quality import"),
    ("from extractors import", "from cane.rag.extractors import"),
    ("from models import", "from cane.rag.extraction_models import"),
    ("from hybrid_search import", "from cane.rag.hybrid_search import"),
    ("from auto_seed import", "from cane.core.seed import"),

    # Route imports (in app.py)
    ("from routes.auth import", "from cane.api.routes.auth import"),
    ("from routes.documents import", "from cane.api.routes.documents import"),
    ("from routes.search import", "from cane.api.routes.search import"),
    ("from routes.ask import", "from cane.api.routes.ask import"),
    ("from routes.agents import", "from cane.api.routes.agents import"),
    ("from routes.admin import", "from cane.api.routes.admin import"),
    ("from routes.team import", "from cane.api.routes.team import"),
    ("from routes.api_keys import", "from cane.api.routes.api_keys import"),
    ("from routes.api_v1 import", "from cane.api.routes.api_v1 import"),
    ("from routes.demo import", "from cane.api.routes.demo import"),
    ("from routes.memory_routes import", "from cane.api.routes.memory_routes import"),
    ("from routes.collaboration import", "from cane.api.routes.collaboration import"),
    ("from routes.web_tools import", "from cane.api.routes.web_tools import"),
    ("from routes.eval_api import", "from cane.api.routes.eval_api import"),
    ("from routes.badges import", "from cane.api.routes.badges import"),
    ("from routes.eval_export import", "from cane.api.routes.eval_export import"),
    ("from routes.mining_routes import", "from cane.api.routes.mining_routes import"),
    ("from routes.eval_analytics import", "from cane.api.routes.eval_analytics import"),
    ("from routes.agent_versions import", "from cane.api.routes.agent_versions import"),
    ("from routes.execution_tracing import", "from cane.api.routes.execution_tracing import"),
    ("from routes.rca_routes import", "from cane.api.routes.rca_routes import"),
    ("from routes.game import", "from cane.api.routes.game import"),

    # Root-level route file imports (in app.py)
    ("from eval_routes import", "from cane.api.routes.eval import"),
    ("from marketplace_routes import", "from cane.api.routes.marketplace import"),
    ("from finetune_routes import", "from cane.api.routes.finetune import"),
    ("from tool_routes import", "from cane.api.routes.tools import"),
    ("from mcp_routes import", "from cane.api.routes.mcp import"),
    ("from analytics_routes import", "from cane.api.routes.analytics import"),
    ("from email_routes import", "from cane.api.routes.email import"),
    ("from calendar_routes import", "from cane.api.routes.calendar import"),
    ("from sheets_routes import", "from cane.api.routes.sheets import"),
    ("from prospect_routes import", "from cane.api.routes.prospects import"),
    ("from connector_routes import", "from cane.api.routes.connectors import"),
    ("from schedule_routes import", "from cane.api.routes.schedules import"),
    ("from conversation_routes import", "from cane.api.routes.conversations import"),
    ("from osint_source_routes import", "from cane.api.routes.osint_sources import"),
    ("from osint_routes import", "from cane.api.routes.osint import"),
]


def rewrite_file(filepath):
    """Rewrite imports in a single file."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    for old, new in IMPORT_MAP:
        content = content.replace(old, new)

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False


def main():
    cane_dir = os.path.join(os.path.dirname(__file__), "cane")
    changed = 0
    total = 0

    for root, dirs, files in os.walk(cane_dir):
        for fname in files:
            if fname.endswith(".py"):
                filepath = os.path.join(root, fname)
                total += 1
                if rewrite_file(filepath):
                    rel = os.path.relpath(filepath, cane_dir)
                    print(f"  Updated: {rel}")
                    changed += 1

    print(f"\n{changed}/{total} files updated")


if __name__ == "__main__":
    main()
