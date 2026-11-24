"""Pydantic schemas for LLM and MCP interfaces."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ==========================================
# LLM Schemas
# ==========================================

class LLMProviderMetadata(BaseModel):
    provider_id: str
    display_name: str
    description: str
    supported_models: List[str]
    is_mock: bool = False
    requires_api_key: bool = True


class LLMHealthStatus(BaseModel):
    provider_id: str
    status: str  # 'CONNECTED', 'NOT_CONFIGURED', 'ERROR', 'DEGRADED'
    is_mock: bool = False
    model_name: Optional[str] = None
    message: str
    latency_ms: Optional[float] = None


class ToolCall(BaseModel):
    call_id: str
    tool_name: str
    server_id: str
    arguments: Dict[str, Any] = Field(default_factory=dict)


class LLMResponse(BaseModel):
    content: str
    provider_id: str
    model_used: str
    is_mock: bool = False
    tool_calls: List[ToolCall] = Field(default_factory=list)
    usage: Dict[str, int] = Field(default_factory=dict)
    finish_reason: Optional[str] = "stop"


# ==========================================
# MCP Schemas
# ==========================================

class MCPToolParameter(BaseModel):
    name: str
    type: str
    description: str
    required: bool = True
    default: Optional[Any] = None


class MCPToolDefinition(BaseModel):
    name: str
    server_id: str
    description: str
    parameters: Dict[str, Any] = Field(default_factory=dict)


class MCPServerStatus(BaseModel):
    server_id: str
    name: str
    description: str
    transport: str  # 'in_memory', 'stdio', 'sse'
    status: str  # 'CONNECTED', 'DISCONNECTED', 'ERROR', 'NOT_CONFIGURED'
    is_mock: bool = False
    tool_count: int = 0
    tools: List[MCPToolDefinition] = Field(default_factory=list)
    endpoint: Optional[str] = None
    error_message: Optional[str] = None


class MCPToolExecutionRequest(BaseModel):
    server_id: Optional[str] = None
    arguments: Dict[str, Any] = Field(default_factory=dict)


class MCPToolExecutionResult(BaseModel):
    tool_name: str
    server_id: str
    status: str  # 'success', 'error'
    result: Any
    is_mock: bool = False
    execution_time_ms: float = 0.0
    error: Optional[str] = None


class MCPServerRegistrationRequest(BaseModel):
    server_id: str
    name: str
    description: str
    transport: str = "in_memory"
    endpoint: Optional[str] = None
    command: Optional[str] = None
    args: List[str] = Field(default_factory=list)
    env: Dict[str, str] = Field(default_factory=dict)
    is_mock: bool = False


# ==========================================
# Chat & Orchestrator Schemas
# ==========================================

class ChatMessagePayload(BaseModel):
    conversation_id: str
    message: str
    context: Optional[Dict[str, Any]] = None  # Live browser page context, etc.


class MCPStepLog(BaseModel):
    server: str
    toolName: str
    status: str
    outputSnippet: str
    timestamp: str


class ChatResponsePayload(BaseModel):
    conversation_id: str
    reply: str
    provider_used: str
    model_used: str
    is_mock_provider: bool
    mcp_steps: List[MCPStepLog] = Field(default_factory=list)
    should_open_browser: bool = False
    browser_url: Optional[str] = None
    readiness_card: Optional[Dict[str, Any]] = None
