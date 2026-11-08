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
    ("from services.claude import", "from sparse_intelligence.inference.claude import"),
    ("from services.claude ", "from sparse_intelligence.inference.claude "),
    ("from services.inference import", "from sparse_intelligence.inference.routing import"),
    ("from services.inference ", "from sparse_intelligence.inference.routing "),
    ("from services.model_router import", "from sparse_intelligence.inference.router import"),
    ("from services.judge_providers import", "from sparse_intelligence.inference.providers import"),
    ("from services.search import", "from sparse_intelligence.rag.search import"),
    ("from services.rag import", "from sparse_intelligence.rag.context import"),
    ("from services.chroma import", "from sparse_intelligence.rag.chroma import"),
    ("from services.memory import", "from sparse_intelligence.agents.memory import"),
    ("from services.game_memory import", "from sparse_intelligence.game.memory import"),
    ("from services.personality_eval import", "from sparse_intelligence.eval.personality import"),
    ("from services.tools import", "from sparse_intelligence.tools.registry import"),
    ("from services.mcp_client import", "from sparse_intelligence.tools.mcp import"),
    ("from services.analytics import", "from sparse_intelligence.core.analytics import"),
    ("from services.limits import", "from sparse_intelligence.core.limits import"),
    ("from services.rate_limit import", "from sparse_intelligence.core.rate_limit import"),
    ("from services.crypto import", "from sparse_intelligence.core.crypto import"),
    ("from services.schedule_runner import", "from sparse_intelligence.agents.schedule_runner import"),
    ("from services.eval_schedule_runner import", "from sparse_intelligence.eval.schedule_runner import"),
    ("from services.connector_sync import", "from sparse_intelligence.integrations.connector_sync import"),
    ("from services.guest_cleanup import", "from sparse_intelligence.core.guest_cleanup import"),
    ("from services.gdrive import", "from sparse_intelligence.integrations.gdrive import"),
    ("import services.gdrive", "import sparse_intelligence.integrations.gdrive"),
    ("from services.s3 import", "from sparse_intelligence.integrations.s3 import"),
    ("import services.s3", "import sparse_intelligence.integrations.s3"),
    ("from services.osint_parser import", "from sparse_intelligence.integrations.osint_parser import"),

    # Model files
    ("from eval_models import", "from sparse_intelligence.eval.models import"),
    ("from marketplace_models import", "from sparse_intelligence.core.marketplace_models import"),
    ("from tool_models import", "from sparse_intelligence.tools.models import"),
    ("from connector_models import", "from sparse_intelligence.integrations.connector_models import"),
    ("from schedule_models import", "from sparse_intelligence.agents.schedule_models import"),
    ("from memory_models import", "from sparse_intelligence.agents.memory_models import"),
    ("from conversation_models import", "from sparse_intelligence.agents.conversation_models import"),
    ("from analytics_models import", "from sparse_intelligence.core.analytics_models import"),
    ("from game_models import", "from sparse_intelligence.game.models import"),
    ("from mcp_models import", "from sparse_intelligence.tools.mcp_models import"),
    ("from osint_models import", "from sparse_intelligence.integrations.osint_models import"),
    ("from mcp_catalog import", "from sparse_intelligence.tools.mcp_catalog import"),
    ("import game_models", "import sparse_intelligence.game.models"),

    # Core files
    ("from config import", "from sparse_intelligence.core.config import"),
    ("from database import", "from sparse_intelligence.core.database import"),
    ("from db_models import", "from sparse_intelligence.core.models import"),
    ("from security import", "from sparse_intelligence.core.security import"),
    ("from auth import", "from sparse_intelligence.auth.jwt import"),
    ("from migrations import", "from sparse_intelligence.core.migrations import"),
    ("import migrations", "import sparse_intelligence.core.migrations"),

    # Backend root files
    ("from eval_engine import", "from sparse_intelligence.eval.engine import"),
    ("from failure_mining import", "from sparse_intelligence.eval.mining import"),
    ("from root_cause_analysis import", "from sparse_intelligence.eval.rca import"),
    ("from tool_executor import", "from sparse_intelligence.tools.executor import"),
    ("from agent_prompts import", "from sparse_intelligence.agents.prompts import"),
    ("from streaming import", "from sparse_intelligence.agents.streaming import"),
    ("from ingestor import", "from sparse_intelligence.rag.ingestor import"),
    ("from smart_chunker import", "from sparse_intelligence.rag.chunker import"),
    ("from chunk_enricher import", "from sparse_intelligence.rag.enricher import"),
    ("from chunk_quality import", "from sparse_intelligence.rag.quality import"),
    ("from extractors import", "from sparse_intelligence.rag.extractors import"),
    ("from models import", "from sparse_intelligence.rag.extraction_models import"),
    ("from hybrid_search import", "from sparse_intelligence.rag.hybrid_search import"),
    ("from auto_seed import", "from sparse_intelligence.core.seed import"),

    # Route imports (in app.py)
    ("from routes.auth import", "from sparse_intelligence.api.routes.auth import"),
    ("from routes.documents import", "from sparse_intelligence.api.routes.documents import"),
    ("from routes.search import", "from sparse_intelligence.api.routes.search import"),
    ("from routes.ask import", "from sparse_intelligence.api.routes.ask import"),
    ("from routes.agents import", "from sparse_intelligence.api.routes.agents import"),
    ("from routes.admin import", "from sparse_intelligence.api.routes.admin import"),
    ("from routes.team import", "from sparse_intelligence.api.routes.team import"),
    ("from routes.api_keys import", "from sparse_intelligence.api.routes.api_keys import"),
    ("from routes.api_v1 import", "from sparse_intelligence.api.routes.api_v1 import"),
    ("from routes.demo import", "from sparse_intelligence.api.routes.demo import"),
    ("from routes.memory_routes import", "from sparse_intelligence.api.routes.memory_routes import"),
    ("from routes.collaboration import", "from sparse_intelligence.api.routes.collaboration import"),
    ("from routes.web_tools import", "from sparse_intelligence.api.routes.web_tools import"),
    ("from routes.eval_api import", "from sparse_intelligence.api.routes.eval_api import"),
    ("from routes.badges import", "from sparse_intelligence.api.routes.badges import"),
    ("from routes.eval_export import", "from sparse_intelligence.api.routes.eval_export import"),
    ("from routes.mining_routes import", "from sparse_intelligence.api.routes.mining_routes import"),
    ("from routes.eval_analytics import", "from sparse_intelligence.api.routes.eval_analytics import"),
    ("from routes.agent_versions import", "from sparse_intelligence.api.routes.agent_versions import"),
    ("from routes.execution_tracing import", "from sparse_intelligence.api.routes.execution_tracing import"),
    ("from routes.rca_routes import", "from sparse_intelligence.api.routes.rca_routes import"),
    ("from routes.game import", "from sparse_intelligence.api.routes.game import"),

    # Root-level route file imports (in app.py)
    ("from eval_routes import", "from sparse_intelligence.api.routes.eval import"),
    ("from marketplace_routes import", "from sparse_intelligence.api.routes.marketplace import"),
    ("from finetune_routes import", "from sparse_intelligence.api.routes.finetune import"),
    ("from tool_routes import", "from sparse_intelligence.api.routes.tools import"),
    ("from mcp_routes import", "from sparse_intelligence.api.routes.mcp import"),
    ("from analytics_routes import", "from sparse_intelligence.api.routes.analytics import"),
    ("from email_routes import", "from sparse_intelligence.api.routes.email import"),
    ("from calendar_routes import", "from sparse_intelligence.api.routes.calendar import"),
    ("from sheets_routes import", "from sparse_intelligence.api.routes.sheets import"),
    ("from prospect_routes import", "from sparse_intelligence.api.routes.prospects import"),
    ("from connector_routes import", "from sparse_intelligence.api.routes.connectors import"),
    ("from schedule_routes import", "from sparse_intelligence.api.routes.schedules import"),
    ("from conversation_routes import", "from sparse_intelligence.api.routes.conversations import"),
    ("from osint_source_routes import", "from sparse_intelligence.api.routes.osint_sources import"),
    ("from osint_routes import", "from sparse_intelligence.api.routes.osint import"),
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
