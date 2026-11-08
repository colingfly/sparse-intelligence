"""
Sparse Intelligence -- Open-source agentic infrastructure.

Build, eval, fine-tune, and deploy AI agents.

Usage:
    from sparse_intelligence import SparseClient

    app = Sparse()
    agent = app.agents.create(name="Dusty", personality="A retired gunslinger")
    agent.ingest("docs/")
    response = agent.ask("What's in these documents?")
    app.serve(port=8000)
"""

__version__ = "0.1.0"

from sparse_intelligence.app import Sparse

__all__ = ["Sparse Intelligence", "__version__"]
