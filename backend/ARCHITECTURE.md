# FormFlow Backend – Modular Architecture Guide

> **How to add a new LLM provider or a new MCP server without modifying the core application.**

---

## Architecture Overview

```
backend/
├── app/
│   ├── config.py               ← All env-var configuration (zero hardcoded secrets)
│   ├── main.py                 ← FastAPI app wiring (no LLM or MCP logic here)
│   ├── llm/
│   │   ├── base.py             ← Abstract interface every LLM provider must implement
│   │   ├── registry.py         ← Central factory + fallback logic
│   │   └── adapters/
│   │       ├── mock.py         ← DEV ONLY: offline test provider
│   │       ├── gemini.py       ← Google Gemini adapter (all Gemini SDK calls here)
│   │       └── openai_adapter.py ← OpenAI adapter
│   ├── mcp/
│   │   ├── base.py             ← Abstract interface every MCP server must implement
│   │   ├── registry.py         ← Dynamic registry + connect/disconnect/discovery
│   │   └── servers/
│   │       ├── test_server.py  ← DEV ONLY: harmless echo server
│   │       ├── document_vault.py
│   │       ├── form_analysis.py
│   │       ├── verification.py
│   │       └── automation.py
│   ├── orchestrator/
│   │   └── agent.py            ← Provider-agnostic orchestration (no SDK calls here)
│   ├── api/
│   │   ├── routes_health.py    ← GET /api/health
│   │   ├── routes_llm.py       ← GET/POST /api/llm/*
│   │   ├── routes_mcp.py       ← GET/POST /api/mcp/*
│   │   └── routes_chat.py      ← POST /api/chat/message
│   └── models/
│       └── schemas.py          ← Pydantic data contracts
├── config/
│   └── mcp_servers.json        ← Declarative MCP server registry
├── .env.example                ← Template for real API keys
├── requirements.txt
└── run_backend.py
```

---

## Design Principles

| Principle | Implementation |
|---|---|
| **LLM code is isolated** | Each provider lives exclusively in its own adapter file |
| **MCP servers are declarative** | Defined in `config/mcp_servers.json`, loaded without code changes |
| **Graceful degradation** | Missing API key → auto-fallback to Mock provider, never crashes |
| **Explicit mock labeling** | DEV ONLY / TEST SERVER labels on all simulated components |
| **No hardcoded secrets** | All keys read from `.env` via `app/config.py` |

---

## How to Add a New LLM Provider

### 1 · Create the adapter file

Create `backend/app/llm/adapters/your_provider.py`:

```python
from typing import Any, Dict, List, Optional
from app.config import settings
from app.llm.base import BaseLLMProvider
from app.models.schemas import LLMHealthStatus, LLMProviderMetadata, LLMResponse

class YourProvider(BaseLLMProvider):

    def __init__(self):
        self.api_key = settings.YOUR_PROVIDER_API_KEY   # read from env
        self.model_name = "your-model-id"
        self.provider_id = "your-provider"

    def get_metadata(self) -> LLMProviderMetadata:
        return LLMProviderMetadata(
            provider_id="your-provider",
            display_name="Your LLM Provider Name",
            description="One-line description.",
            supported_models=["your-model-id"],
            is_mock=False,
            requires_api_key=True
        )

    async def health_check(self) -> LLMHealthStatus:
        if not self.api_key:
            return LLMHealthStatus(
                provider_id="your-provider",
                status="NOT_CONFIGURED",
                message="YOUR_PROVIDER_API_KEY not set in environment."
            )
        # Lightweight connectivity ping here
        return LLMHealthStatus(
            provider_id="your-provider",
            status="CONNECTED",
            model_name=self.model_name,
            message="Connected."
        )

    async def generate(self, prompt, system_prompt=None, tools=None, temperature=None, **kwargs) -> LLMResponse:
        # Call your provider's SDK here
        content = "Response from your provider"
        return LLMResponse(
            content=content,
            provider_id="your-provider",
            model_used=self.model_name,
            is_mock=False,
            tool_calls=[],
            usage={}
        )
```

### 2 · Register it in the LLM Registry

In `backend/app/llm/registry.py`, add **two lines**:

```python
from app.llm.adapters.your_provider import YourProvider  # ← import

class LLMProviderRegistry:
    def __init__(self):
        # ... existing registrations
        self.register("your-provider", YourProvider)      # ← register
```

### 3 · Add the env var to config.py

In `backend/app/config.py`:

```python
YOUR_PROVIDER_API_KEY: Optional[str] = os.getenv("YOUR_PROVIDER_API_KEY")
```

### 4 · Set the env var and activate it

In `backend/.env`:

```bash
YOUR_PROVIDER_API_KEY=sk-...
ACTIVE_LLM_PROVIDER=your-provider
```

**That's it.** No changes to `main.py`, the orchestrator, or any routes.

---

## How to Add a New MCP Server

### Method A – JSON Configuration (No Code Required)

Add an entry to `backend/config/mcp_servers.json`:

```json
{
  "server_id": "my-new-server",
  "name": "My New MCP Server",
  "description": "What this server provides.",
  "transport": "in_memory",
  "adapter_class": "app.mcp.servers.my_server.MyMCPServer",
  "enabled": true,
  "is_mock": false
}
```

Then create the matching adapter class (see Method B).

### Method B – Adapter Class

Create `backend/app/mcp/servers/my_server.py`:

```python
import time
from typing import Any, Dict, List
from app.mcp.base import BaseMCPServer
from app.models.schemas import MCPServerStatus, MCPToolDefinition, MCPToolExecutionResult

class MyMCPServer(BaseMCPServer):

    def __init__(self, server_id: str = "my-new-server"):
        super().__init__(
            server_id=server_id,
            name="My New MCP Server",
            description="Short description of what this server does.",
            transport="in_memory",
            is_mock=False
        )
        self._tools = {
            "my_tool": MCPToolDefinition(
                name="my_tool",
                server_id=self.server_id,
                description="What this tool does.",
                parameters={
                    "type": "object",
                    "properties": {
                        "input": {"type": "string", "description": "Input parameter"}
                    },
                    "required": ["input"]
                }
            )
        }

    async def connect(self) -> bool:
        self.is_connected = True
        return True

    async def disconnect(self) -> bool:
        self.is_connected = False
        return True

    async def list_tools(self) -> List[MCPToolDefinition]:
        return list(self._tools.values()) if self.is_connected else []

    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> MCPToolExecutionResult:
        start = time.time()
        if tool_name == "my_tool":
            result = {"processed": arguments.get("input"), "status": "ok"}
            return MCPToolExecutionResult(
                tool_name=tool_name,
                server_id=self.server_id,
                status="success",
                result=result,
                execution_time_ms=round((time.time() - start) * 1000, 2)
            )
        return MCPToolExecutionResult(
            tool_name=tool_name, server_id=self.server_id,
            status="error", result=None,
            error=f"Tool '{tool_name}' not found."
        )
```

### Method C – Runtime Registration via API (No Restart)

```bash
curl -X POST http://localhost:8000/api/mcp/servers \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "runtime-server",
    "name": "Runtime Registered Server",
    "description": "Registered without restart",
    "transport": "in_memory",
    "is_mock": false
  }'
```

---

## Configuration Reference

### Environment Variables (backend/.env)

| Variable | Default | Required |
|---|---|---|
| `ACTIVE_LLM_PROVIDER` | `mock` | No |
| `GEMINI_API_KEY` | _(empty)_ | Only if using Gemini |
| `GEMINI_MODEL` | `gemini-2.5-flash` | No |
| `OPENAI_API_KEY` | _(empty)_ | Only if using OpenAI |
| `OPENAI_MODEL` | `gpt-4o-mini` | No |
| `PORT` | `8000` | No |
| `MCP_CONFIG_PATH` | `config/mcp_servers.json` | No |

### Switching Providers at Runtime

```bash
# Via API (no restart)
curl -X POST http://localhost:8000/api/llm/active \
  -H "Content-Type: application/json" \
  -d '{"provider_id": "gemini"}'
```

---

## Running the Backend

```bash
# 1. Install dependencies
pip install fastapi uvicorn pydantic httpx google-genai openai

# 2. Copy and configure environment
cp .env.example .env
# Edit .env to add your API keys

# 3. Start
cd backend
python run_backend.py
# OR
uvicorn app.main:app --reload --port 8000
```

**Interactive API docs available at:** http://localhost:8000/docs

---

## Live API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Full system health (LLM + MCP status) |
| GET | `/api/llm/providers` | List all registered LLM providers |
| GET | `/api/llm/status` | Live health of all LLM providers |
| POST | `/api/llm/active` | Switch active LLM provider at runtime |
| GET | `/api/mcp/servers` | List all MCP servers with status |
| POST | `/api/mcp/servers` | Register a new MCP server dynamically |
| POST | `/api/mcp/servers/{id}/connect` | Connect a specific server |
| POST | `/api/mcp/servers/{id}/disconnect` | Disconnect a specific server |
| GET | `/api/mcp/tools` | Discover all tools across connected servers |
| POST | `/api/mcp/tools/{name}/execute` | Execute a specific MCP tool |
| POST | `/api/chat/message` | Send a message through the Agent Orchestrator |

---

## Mock vs Real Integration

> ⚠️ **Mock integrations are explicitly labeled throughout FormFlow.**
> No external API calls are made until a real API key is configured and the provider is activated.

| Component | Mock Label | Real Provider |
|---|---|---|
| Mock LLM provider | `DEV ONLY` badge | Gemini, OpenAI, etc. |
| Test MCP echo server | `TEST SERVER` badge | Document Vault, Form Analysis, etc. |
| Frontend status panel | Shows `Mock Active` | Shows provider name + latency |

---

*FormFlow Backend Orchestrator · v1.0.0*
