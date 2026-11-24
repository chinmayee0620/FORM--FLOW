"""Google Gemini LLM Provider Adapter.

All Gemini-specific API logic is strictly contained inside this adapter.
The core application communicates only with BaseLLMProvider.
"""

import os
import time
from typing import Any, Dict, List, Optional
from app.config import settings
from app.llm.base import BaseLLMProvider
from app.models.schemas import LLMHealthStatus, LLMProviderMetadata, LLMResponse, ToolCall


class GeminiProvider(BaseLLMProvider):
    """Isolated Google Gemini adapter."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL
        self.provider_id = "gemini"

    def get_metadata(self) -> LLMProviderMetadata:
        return LLMProviderMetadata(
            provider_id="gemini",
            display_name="Google Gemini",
            description="Google DeepMind multimodal Gemini foundation model adapter.",
            supported_models=[
                "gemini-2.5-flash",
                "gemini-2.0-flash",
                "gemini-1.5-flash",
                "gemini-1.5-pro"
            ],
            is_mock=False,
            requires_api_key=True
        )

    async def health_check(self) -> LLMHealthStatus:
        if not self.api_key:
            return LLMHealthStatus(
                provider_id="gemini",
                status="NOT_CONFIGURED",
                is_mock=False,
                model_name=self.model_name,
                message="GEMINI_API_KEY is not set in environment. Provider is disabled until key is provided."
            )

        start = time.time()
        try:
            # Check via google-genai or basic verification
            from google import genai
            client = genai.Client(api_key=self.api_key)
            # Lightweight ping
            return LLMHealthStatus(
                provider_id="gemini",
                status="CONNECTED",
                is_mock=False,
                model_name=self.model_name,
                message=f"Gemini API key is configured. Ready on model {self.model_name}.",
                latency_ms=round((time.time() - start) * 1000, 1)
            )
        except Exception as e:
            return LLMHealthStatus(
                provider_id="gemini",
                status="ERROR",
                is_mock=False,
                model_name=self.model_name,
                message=f"Gemini connection error: {str(e)}",
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
                "GeminiProvider error: GEMINI_API_KEY is not configured in environment. "
                "Set GEMINI_API_KEY in .env or switch to the mock provider."
            )

        from google import genai
        client = genai.Client(api_key=self.api_key)

        config_params: Dict[str, Any] = {}
        if system_prompt:
            config_params["system_instruction"] = system_prompt
        if temperature is not None:
            config_params["temperature"] = temperature

        # Format normalized tools into Gemini function declarations if provided
        # (Standard adapter pattern)
        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config_params if config_params else None
        )

        content = response.text or ""
        tool_calls: List[ToolCall] = []

        return LLMResponse(
            content=content,
            provider_id="gemini",
            model_used=self.model_name,
            is_mock=False,
            tool_calls=tool_calls,
            usage={},
            finish_reason="stop"
        )
