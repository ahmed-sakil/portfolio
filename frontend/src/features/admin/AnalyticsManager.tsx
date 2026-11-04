import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Activity, Clock, Users, Trash2, Globe, Monitor, Smartphone } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActivityLog {
  id: string;
  sessionId: string;
  device?: string | null;
  browser?: string | null;
  referrer?: string | null;
  path: string;
  durationSeconds: number;
  lastPingAt: string;
  createdAt: string;
}

interface AnalyticsResponse {
  stats: {
    totalSessions: number;
    totalDurationSeconds: number;
    avgDurationSeconds: number;
  };
  activities: ActivityLog[];
}

export const AnalyticsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading } = useQuery<AnalyticsResponse>({
    queryKey: ['analytics'],
    queryFn: () => apiClient<AnalyticsResponse>('/analytics'),
    refetchInterval: 10000, // Refresh every 10s
  });

  const deleteBatchMutation = useMutation({
    mutationFn: (ids: string[]) =>
      apiClient('/analytics/delete-batch', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setSelectedIds([]);
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => apiClient('/analytics/clear-all', { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setSelectedIds([]);
    },
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (!data?.activities) return;
    if (selectedIds.length === data.activities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.activities.map((a) => a.id));
    }
  };

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            <span>Visitor Telemetry</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => {
                if (confirm(`Delete ${selectedIds.length} selected activity entries?`)) {
                  deleteBatchMutation.mutate(selectedIds);
                }
              }}
              disabled={deleteBatchMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-mono transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear ALL visitor telemetry logs?')) {
                clearAllMutation.mutate();
              }
            }}
            disabled={clearAllMutation.isPending || !data?.activities?.length}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text-main text-xs font-mono hover:bg-surface-hover transition-colors"
          >
            <span>Clear Entire Database</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-mono uppercase">Total Sessions</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-text-main">
            {data?.stats?.totalSessions || 0}
          </div>
          <div className="text-[10px] font-mono text-text-muted">Unique visitor interactions</div>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-mono uppercase">Total Time Spent</span>
            <Clock className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-text-main">
            {formatDuration(data?.stats?.totalDurationSeconds || 0)}
          </div>
          <div className="text-[10px] font-mono text-text-muted">Cumulative portfolio engagement</div>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-mono uppercase">Avg. Time / Visitor</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {formatDuration(data?.stats?.avgDurationSeconds || 0)}
          </div>
          <div className="text-[10px] font-mono text-text-muted">Average session duration</div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="p-5 rounded-lg bg-surface border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-main">
            Live Visitor Records ({data?.activities?.length || 0})
          </h3>

          {data?.activities && data.activities.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-xs font-mono text-text-muted hover:text-text-main underline"
            >
              {selectedIds.length === data.activities.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs font-mono text-text-muted">
            Querying visitor telemetry...
          </div>
        ) : !data?.activities?.length ? (
          <div className="py-12 text-center text-xs font-mono text-text-muted">
            No visitor logs recorded yet. Visit the portfolio from another tab or mobile device to test.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase text-text-muted">
                  <th className="py-2.5 px-2 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === data.activities.length}
                      onChange={handleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="py-2.5 px-3">Session & Time</th>
                  <th className="py-2.5 px-3">Device / OS</th>
                  <th className="py-2.5 px-3">Browser</th>
                  <th className="py-2.5 px-3">Referrer</th>
                  <th className="py-2.5 px-3">Duration Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.activities.map((act) => {
                  const isChecked = selectedIds.includes(act.id);
                  return (
                    <tr
                      key={act.id}
                      className={cn(
                        "hover:bg-surface-hover/80 transition-colors",
                        isChecked && "bg-background/80"
                      )}
                    >
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(act.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-text-main">{act.sessionId.slice(0, 14)}...</div>
                        <div className="text-[10px] text-text-muted">
                          {new Date(act.lastPingAt).toLocaleTimeString()} ({new Date(act.lastPingAt).toLocaleDateString()})
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1.5">
                          {act.device === 'Mobile' ? (
                            <Smartphone className="w-3.5 h-3.5 text-accent" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-text-muted" />
                          )}
                          <span>{act.device || 'Desktop'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-text-main">{act.browser || 'Unknown'}</td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 text-text-muted">
                          <Globe className="w-3 h-3" />
                          <span>{act.referrer || 'Direct'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-background border border-border text-accent font-bold">
                          {formatDuration(act.durationSeconds)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
