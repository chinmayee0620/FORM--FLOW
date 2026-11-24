"""Modular LLM Provider Registry for FormFlow.

Supports registering and switching LLM providers dynamically.
Provides automatic graceful fallback to the mock provider if real API keys are missing.
"""

from typing import Dict, List, Optional, Type
from app.config import settings
from app.llm.base import BaseLLMProvider
from app.llm.adapters.gemini import GeminiProvider
from app.llm.adapters.mock import TestMockLLMProvider
from app.llm.adapters.openai_adapter import OpenAIProvider
from app.models.schemas import LLMHealthStatus, LLMProviderMetadata


class LLMProviderRegistry:
    """Central registry and factory for all LLM providers."""

    def __init__(self):
        self._providers: Dict[str, BaseLLMProvider] = {}
        self._classes: Dict[str, Type[BaseLLMProvider]] = {}
        
        # Register standard built-in providers
        self.register("mock", TestMockLLMProvider)
        self.register("gemini", GeminiProvider)
        self.register("openai", OpenAIProvider)

    def register(self, provider_id: str, provider_cls: Type[BaseLLMProvider]):
        """Registers a new LLM provider class under a unique ID."""
        self._classes[provider_id.lower()] = provider_cls
        # Lazy instance creation
        self._providers[provider_id.lower()] = provider_cls()

    def get_provider(self, provider_id: str) -> BaseLLMProvider:
        """Retrieves a provider instance by ID."""
        pid = provider_id.lower()
        if pid not in self._providers:
            raise KeyError(
                f"Unknown LLM provider '{provider_id}'. "
                f"Available providers: {list(self._providers.keys())}"
            )
        return self._providers[pid]

    async def get_active_provider(self) -> BaseLLMProvider:
        """Returns the currently configured active provider.
        
        If the configured provider is NOT configured (e.g. missing API key),
        falls back gracefully to the Mock Provider to guarantee application uptime.
        """
        requested = settings.ACTIVE_LLM_PROVIDER.lower()
        if requested in self._providers:
            provider = self._providers[requested]
            status = await provider.health_check()
            if status.status == "CONNECTED":
                return provider

        # Fallback to safe development mock provider
        return self._providers["mock"]

    def list_metadata(self) -> List[LLMProviderMetadata]:
        """Returns metadata for all registered providers."""
        return [p.get_metadata() for p in self._providers.values()]

    async def get_all_health(self) -> Dict[str, LLMHealthStatus]:
        """Runs health checks on all providers and returns their live status."""
        results: Dict[str, LLMHealthStatus] = {}
        for pid, provider in self._providers.items():
            try:
                results[pid] = await provider.health_check()
            except Exception as e:
                results[pid] = LLMHealthStatus(
                    provider_id=pid,
                    status="ERROR",
                    is_mock=getattr(provider, "is_mock", False),
                    message=f"Health check failed: {str(e)}"
                )
        return results


# Global singleton registry
llm_registry = LLMProviderRegistry()
