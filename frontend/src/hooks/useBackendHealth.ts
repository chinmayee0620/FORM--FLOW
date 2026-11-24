/**
 * useBackendHealth – polls the FastAPI backend every 30 seconds.
 * Returns live status or null when backend is unreachable.
 * Never throws: the application continues safely without the backend.
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchBackendHealth, BackendHealth } from '../services/backendApi';

const POLL_INTERVAL_MS = 30_000;

export function useBackendHealth() {
  const [health, setHealth] = useState<BackendHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const check = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchBackendHealth();
    setHealth(result);
    setLastChecked(new Date());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [check]);

  const isBackendOnline = health !== null;
  const isMockLLM = health?.is_mock_llm ?? true;
  const activeLLMProvider = health?.active_llm_provider ?? 'offline';
  const mcpConnected = health?.mcp_servers_connected ?? 0;
  const mcpTotal = health?.mcp_servers_total ?? 0;

  return {
    health,
    isLoading,
    lastChecked,
    isBackendOnline,
    isMockLLM,
    activeLLMProvider,
    mcpConnected,
    mcpTotal,
    refresh: check,
  };
}
