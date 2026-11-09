import os

# Tests exercise the deterministic offline drafter, never a live LLM.
os.environ["LLM_MODE"] = "offline"
