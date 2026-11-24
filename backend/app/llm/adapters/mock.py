"""Harmless Test LLM / Mock Provider for FormFlow local development.

Provides safe, deterministic, offline mock completions for application workflows.
Explicitly flags all outputs as [SIMULATED / TEST MODE] so no confusion with real LLMs occurs.
"""

import asyncio
import time
from typing import Any, Dict, List, Optional
from app.config import settings
from app.llm.base import BaseLLMProvider
from app.models.schemas import LLMHealthStatus, LLMProviderMetadata, LLMResponse, ToolCall


class TestMockLLMProvider(BaseLLMProvider):
    """Offline development LLM simulator."""

    def __init__(self, model_name: str = "mock-formflow-v1"):
        self.model_name = model_name
        self.provider_id = "mock"

    def get_metadata(self) -> LLMProviderMetadata:
        return LLMProviderMetadata(
            provider_id="mock",
            display_name="FormFlow Mock Test Provider (Development Engine)",
            description="Offline mock provider for frontend and MCP workflow testing without external API keys.",
            supported_models=["mock-formflow-v1", "mock-fast-eval"],
            is_mock=True,
            requires_api_key=False
        )

    async def health_check(self) -> LLMHealthStatus:
        return LLMHealthStatus(
            provider_id="mock",
            status="CONNECTED",
            is_mock=True,
            model_name=self.model_name,
            message="Development mock engine is active. Safe offline simulation.",
            latency_ms=1.5
        )

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> LLMResponse:
        start_time = time.time()
        # Simulated slight network latency
        latency = settings.MOCK_LLM_LATENCY_MS / 1000.0
        if latency > 0:
            await asyncio.sleep(min(latency, 0.5))

        lower = prompt.lower()
        tool_calls: List[ToolCall] = []

        # If tools were provided, simulate dynamic tool calls based on intent
        if tools:
            if "scholarship" in lower or "reliance" in lower or "portal" in lower:
                tool_calls.append(
                    ToolCall(
                        call_id="call-mock-1",
                        tool_name="inspect_live_page",
                        server_id="form-analysis",
                        arguments={"url": "https://www.reliancefoundation.org/scholarships/ug-stem-2026"}
                    )
                )
            if "document" in lower or "missing" in lower:
                tool_calls.append(
                    ToolCall(
                        call_id="call-mock-2",
                        tool_name="search_drive_documents",
                        server_id="document-vault",
                        arguments={"query": "academic marksheet income"}
                    )
                )

        # Build honest mock response
        disclaimer = "> ⚠️ **[DEVELOPMENT TEST MODE]**: Running on internal Mock LLM Provider. No external API credits consumed.\n\n"
        
        if "explain this page" in lower or "explain the page" in lower:
            body = (
                "### 📄 Page Analysis (Simulated)\n\n"
                "I analyzed the portal currently loaded in your browser panel:\n"
                "- **Program**: Reliance Foundation Undergraduate STEM Scholarship 2026\n"
                "- **Grant**: Up to ₹2,00,000 / year for undergraduate STEM degrees\n"
                "- **Eligibility Status**: Matched with Priority Tier based on 96% Class 12 aggregate."
            )
        elif "help me fill" in lower or "fill application" in lower:
            body = (
                "### 📝 Assisted Form Preparation (Simulated)\n\n"
                "I extracted verified data from your Google Drive:\n"
                "- **Full Name**: Darshan Kumar (Source: 10th CBSE Marksheet)\n"
                "- **Annual Income**: ₹2,40,000 (Source: Income Certificate 2025)\n"
                "- **Institution**: MSRIT Bangalore\n\n"
                "⚠️ **Safety Gate**: Values staged for review. Awaiting Human Approval before submission."
            )
        else:
            body = (
                f"I processed your query: *\"{prompt}\"*\n\n"
                "- Verified 7 documents in authorized Google Drive repository.\n"
                "- All 6 MCP servers are connected in modular registry.\n"
                "- Ready to assist with portal inspection or form filling."
            )

        content = disclaimer + body

        return LLMResponse(
            content=content,
            provider_id="mock",
            model_used=self.model_name,
            is_mock=True,
            tool_calls=tool_calls,
            usage={"prompt_tokens": len(prompt.split()), "completion_tokens": len(content.split())},
            finish_reason="stop"
        )
