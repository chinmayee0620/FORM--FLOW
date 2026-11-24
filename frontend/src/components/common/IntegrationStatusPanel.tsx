/**
 * IntegrationStatusPanel – shows live backend, LLM provider, and MCP server
 * connection status. Clearly distinguishes mock (dev) from real integrations.
 * Visible in the FormFlow Settings page.
 */
import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Plug,
  PlugZap,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Beaker,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { connectMCPServer, disconnectMCPServer, setActiveLLMProvider } from '../../services/backendApi';
import { Badge } from '../common/Badge';

function StatusDot({ status }: { status: string }) {
  if (status === 'CONNECTED') return <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />;
  if (status === 'NOT_CONFIGURED') return <span className="w-2 h-2 rounded-full bg-amber-400" />;
  if (status === 'ERROR') return <span className="w-2 h-2 rounded-full bg-rose-500" />;
  return <span className="w-2 h-2 rounded-full bg-zinc-300" />;
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'CONNECTED') return <CheckCircle2 size={14} className="text-emerald-600" />;
  if (status === 'NOT_CONFIGURED') return <AlertTriangle size={14} className="text-amber-500" />;
  if (status === 'ERROR') return <XCircle size={14} className="text-rose-500" />;
  return <Loader2 size={14} className="text-zinc-400 animate-spin" />;
}

export const IntegrationStatusPanel: React.FC = () => {
  const {
    health,
    isLoading,
    lastChecked,
    isBackendOnline,
    isMockLLM,
    activeLLMProvider,
    mcpConnected,
    mcpTotal,
    refresh,
  } = useBackendHealth();

  const [expandedMCP, setExpandedMCP] = useState(false);
  const [expandedLLM, setExpandedLLM] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleMCPToggle = async (serverId: string, isConnected: boolean) => {
    setActionLoading(serverId);
    if (isConnected) {
      await disconnectMCPServer(serverId);
    } else {
      await connectMCPServer(serverId);
    }
    await refresh();
    setActionLoading(null);
  };

  const handleSetProvider = async (providerId: string) => {
    setActionLoading(providerId);
    await setActiveLLMProvider(providerId);
    await refresh();
    setActionLoading(null);
  };

  return (
    <div className="space-y-5">
      {/* Backend Connection Status Header */}
      <div
        className={`flex items-center justify-between p-4 rounded-2xl border ${
          isBackendOnline
            ? 'bg-emerald-50/60 border-emerald-200'
            : 'bg-rose-50/60 border-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <Server
            size={18}
            className={isBackendOnline ? 'text-emerald-700' : 'text-rose-600'}
          />
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              FormFlow Backend Orchestrator
            </p>
            <p className="text-xs text-zinc-500">
              {isBackendOnline
                ? `Connected · v${health?.version} · ${health?.app_name}`
                : 'Backend unreachable. Frontend running in standalone mock mode.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 size={14} className="text-zinc-400 animate-spin" />}
          <Badge variant={isBackendOnline ? 'success' : 'danger'} size="sm" dot>
            {isBackendOnline ? 'Online' : 'Offline'}
          </Badge>
          <button
            type="button"
            onClick={refresh}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
            title="Refresh status"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {!isBackendOnline && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" />
          <span>
            Backend is not running. Start it with{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">
              python run_backend.py
            </code>{' '}
            inside <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">backend/</code>. 
            The UI continues working using internal mock service.
          </span>
        </div>
      )}

      {/* LLM Providers Section */}
      <div className="border border-zinc-200 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandedLLM(prev => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-zinc-50/80 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Cpu size={16} className="text-brand-600" />
            <span className="text-sm font-semibold text-zinc-900">LLM Providers</span>
            {isMockLLM && (
              <Badge variant="warning" size="sm">
                <Beaker size={10} className="inline mr-1" />
                Mock Active
              </Badge>
            )}
            {!isMockLLM && isBackendOnline && (
              <Badge variant="success" size="sm">
                {activeLLMProvider} Connected
              </Badge>
            )}
          </div>
          {expandedLLM ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
        </button>

        {expandedLLM && (
          <div className="border-t border-zinc-100 p-3 space-y-2 bg-zinc-50/40">
            {/* Always show mock */}
            {!isBackendOnline && (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-200 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <Beaker size={14} className="text-amber-500" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">
                      FormFlow Mock Test Provider
                      <span className="ml-1.5 text-[10px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">DEV ONLY</span>
                    </p>
                    <p className="text-[11px] text-zinc-500">Offline simulation • No API key required</p>
                  </div>
                </div>
                <Badge variant="success" size="sm" dot>Active</Badge>
              </div>
            )}

            {/* Live LLM status from backend */}
            {isBackendOnline && health && Object.values(health.llm_providers).map((provider) => (
              <div
                key={provider.provider_id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-200 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  {provider.is_mock
                    ? <Beaker size={14} className="text-amber-500" />
                    : <Cpu size={14} className="text-brand-600" />
                  }
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                      {provider.provider_id.charAt(0).toUpperCase() + provider.provider_id.slice(1)}
                      {provider.is_mock && (
                        <span className="text-[10px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                          DEV ONLY
                        </span>
                      )}
                      {provider.provider_id === activeLLMProvider && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                          ACTIVE
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{provider.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot status={provider.status} />
                  <Badge
                    variant={
                      provider.status === 'CONNECTED'
                        ? 'success'
                        : provider.status === 'NOT_CONFIGURED'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {provider.status.replace('_', ' ')}
                  </Badge>
                  {provider.status === 'CONNECTED' && provider.provider_id !== activeLLMProvider && (
                    <button
                      type="button"
                      disabled={actionLoading === provider.provider_id}
                      onClick={() => handleSetProvider(provider.provider_id)}
                      className="text-[11px] px-2 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-medium transition-colors disabled:opacity-50"
                    >
                      {actionLoading === provider.provider_id ? 'Switching…' : 'Set Active'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add new provider hint */}
            <p className="text-[11px] text-zinc-400 px-1 pt-1">
              To add a new LLM provider: create an adapter in{' '}
              <code className="bg-zinc-100 px-1 rounded font-mono">backend/app/llm/adapters/</code>{' '}
              and register it in <code className="bg-zinc-100 px-1 rounded font-mono">llm/registry.py</code>.
            </p>
          </div>
        )}
      </div>

      {/* MCP Servers Section */}
      <div className="border border-zinc-200 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandedMCP(prev => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-zinc-50/80 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <PlugZap size={16} className="text-brand-600" />
            <span className="text-sm font-semibold text-zinc-900">MCP Servers</span>
            <Badge variant={mcpConnected === mcpTotal && mcpTotal > 0 ? 'success' : 'warning'} size="sm">
              {isBackendOnline ? `${mcpConnected}/${mcpTotal} Connected` : 'Backend Offline'}
            </Badge>
          </div>
          {expandedMCP ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
        </button>

        {expandedMCP && (
          <div className="border-t border-zinc-100 p-3 space-y-2 bg-zinc-50/40">
            {!isBackendOnline ? (
              <div className="text-xs text-zinc-500 p-3 bg-white rounded-xl border border-zinc-200">
                MCP server status requires the backend to be running.
              </div>
            ) : health?.mcp_servers.map((srv) => (
              <div
                key={srv.server_id}
                className="p-3 bg-white rounded-xl border border-zinc-200 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <StatusIcon status={srv.status} />
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                        {srv.name}
                        {srv.is_mock && (
                          <span className="text-[10px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                            TEST SERVER
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {srv.tool_count} tools · {srv.transport} transport
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusDot status={srv.status} />
                    <button
                      type="button"
                      disabled={actionLoading === srv.server_id}
                      onClick={() => handleMCPToggle(srv.server_id, srv.status === 'CONNECTED')}
                      className={`text-[11px] px-2 py-1 rounded-lg border font-medium transition-colors disabled:opacity-50 flex items-center gap-1 ${
                        srv.status === 'CONNECTED'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {actionLoading === srv.server_id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : srv.status === 'CONNECTED' ? (
                        <><Plug size={10} />Disconnect</>
                      ) : (
                        <><PlugZap size={10} />Connect</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new server hint */}
            <p className="text-[11px] text-zinc-400 px-1 pt-1">
              To add a new MCP server: add an entry to{' '}
              <code className="bg-zinc-100 px-1 rounded font-mono">backend/config/mcp_servers.json</code>{' '}
              or POST to <code className="bg-zinc-100 px-1 rounded font-mono">/api/mcp/servers</code> at runtime.
            </p>
          </div>
        )}
      </div>

      {/* Safety Attestation */}
      <div className="flex items-start gap-2.5 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
        <ShieldCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-600 leading-relaxed">
          <span className="font-semibold text-zinc-800">Integration Transparency: </span>
          FormFlow clearly separates Development Mock integrations (marked{' '}
          <span className="font-semibold text-amber-700">DEV ONLY</span> / <span className="font-semibold text-amber-700">TEST SERVER</span>)
          from real configured providers. No real Gemini or external API calls are
          made until the corresponding API key is set in <code className="bg-zinc-200 px-1 rounded">backend/.env</code>.
        </p>
      </div>

      {lastChecked && (
        <p className="text-[11px] text-zinc-400 text-right">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};
