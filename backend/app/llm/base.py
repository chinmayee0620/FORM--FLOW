"""Base interface for all LLM providers in FormFlow.

Strictly decouples LLM generation from vendor-specific SDKs.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from app.models.schemas import LLMHealthStatus, LLMProviderMetadata, LLMResponse, ToolCall


class BaseLLMProvider(ABC):
    """Abstract Base Class for modular LLM providers.
    
    Any new LLM (Gemini, OpenAI, Anthropic, Mistral, Ollama, local models)
    must implement this interface.
    """

    @abstractmethod
    def get_metadata(self) -> LLMProviderMetadata:
        """Returns metadata about the provider capabilities and model support."""
        pass

    @abstractmethod
    async def health_check(self) -> LLMHealthStatus:
        """Verifies whether the provider is configured and reachable.
        
        Must return safely without raising unhandled exceptions when unconfigured.
        """
        pass

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> LLMResponse:
        """Generates a text completion or tool call request from the LLM.
        
        Args:
            prompt: User message or context.
            system_prompt: System directive instructions.
            tools: Normalized tool schemas for function calling.
            temperature: Sampling temperature.
            **kwargs: Extra vendor-specific generation parameters.
        """
        pass
