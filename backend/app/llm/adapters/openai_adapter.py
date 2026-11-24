"""OpenAI LLM Provider Adapter.

Demonstrates seamless extensibility: adding OpenAI requires only this adapter file
and a registration line in the registry.
"""

import time
from typing import Any, Dict, List, Optional
from app.config import settings
from app.llm.base import BaseLLMProvider
from app.models.schemas import LLMHealthStatus, LLMProviderMetadata, LLMResponse, ToolCall


class OpenAIProvider(BaseLLMProvider):
    """Isolated OpenAI adapter (GPT-4o, GPT-4o-mini, etc.)."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model_name = model_name or settings.OPENAI_MODEL
        self.provider_id = "openai"

    def get_metadata(self) -> LLMProviderMetadata:
        return LLMProviderMetadata(
            provider_id="openai",
            display_name="OpenAI",
            description="OpenAI API adapter supporting GPT-4o, GPT-4o-mini, and compatible endpoints.",
            supported_models=["gpt-4o", "gpt-4o-mini", "o3-mini"],
            is_mock=False,
            requires_api_key=True
        )

    async def health_check(self) -> LLMHealthStatus:
        if not self.api_key:
            return LLMHealthStatus(
                provider_id="openai",
                status="NOT_CONFIGURED",
                is_mock=False,
                model_name=self.model_name,
                message="OPENAI_API_KEY is not set in environment. Provider is disabled until key is provided."
            )

        start = time.time()
        try:
            import openai
            client = openai.AsyncOpenAI(api_key=self.api_key)
            # Lightweight models list query to verify key
            await client.models.list()
            return LLMHealthStatus(
                provider_id="openai",
                status="CONNECTED",
                is_mock=False,
                model_name=self.model_name,
                message=f"OpenAI API key configured. Ready on model {self.model_name}.",
                latency_ms=round((time.time() - start) * 1000, 1)
            )
        except Exception as e:
            return LLMHealthStatus(
                provider_id="openai",
                status="ERROR",
                is_mock=False,
                model_name=self.model_name,
                message=f"OpenAI connection error: {str(e)}",
                latency_ms=round((time.time() - start) * 1000, 1)
            )

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> LLMResponse:
        if not self.api_key:
            raise ValueError(
                "OpenAIProvider error: OPENAI_API_KEY is not configured in environment. "
                "Set OPENAI_API_KEY in .env or switch to the mock provider."
            )

        import openai
        client = openai.AsyncOpenAI(api_key=self.api_key)

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=temperature if temperature is not None else 0.2
        )

        content = response.choices[0].message.content or ""
        return LLMResponse(
            content=content,
            provider_id="openai",
            model_used=self.model_name,
            is_mock=False,
            tool_calls=[],
            usage={
                "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
                "completion_tokens": response.usage.completion_tokens if response.usage else 0,
            },
            finish_reason=response.choices[0].finish_reason or "stop"
        )
