import { useState } from 'react';
import { Eye, Edit3, Trash2, CheckCircle2, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatResponseTime } from '../../utils/formatters';

export function ProviderTable({ providers, onEdit, onDelete, isAdmin }) {
  return (
    <div
      className="card border overflow-hidden shadow-sm"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr
              className="border-b uppercase text-[11px] font-semibold tracking-wider"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              <th className="py-3.5 px-4">Provider / Code</th>
              <th className="py-3.5 px-4">Model Name</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Health</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Timeout</th>
              {isAdmin && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {providers.map((p) => {
              const isOnline = p.enabled && p.healthy;
              return (
                <tr
                  key={p.id}
                  className="hover:bg-slate-500/5 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {/* Provider Name & Code */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-sm">{p.providerName}</div>
                    <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {p.providerCode}
                    </span>
                  </td>

                  {/* Model */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-xs" style={{ color: 'var(--accent-primary)' }}>
                      {p.modelName}
                    </div>
                    <div className="text-[11px] truncate max-w-[180px]" style={{ color: 'var(--text-muted)' }}>
                      {p.baseUrl}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      #{p.priority}
                    </span>
                  </td>

                  {/* Health */}
                  <td className="py-3.5 px-4">
                    <Badge variant={p.healthy ? 'success' : 'danger'} dot={true}>
                      {p.healthy ? 'Healthy' : 'Unhealthy'}
                    </Badge>
                  </td>

                  {/* Status (Enabled/Disabled) */}
                  <td className="py-3.5 px-4">
                    <Badge variant={p.enabled ? 'info' : 'neutral'}>
                      {p.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </td>

                  {/* Timeout */}
                  <td className="py-3.5 px-4 font-mono text-xs">
                    {formatResponseTime(p.timeoutMs)}
                  </td>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(p)}
                          className="p-1.5 h-8 w-8 text-slate-400 hover:text-indigo-400"
                          title="Edit Provider"
                        >
                          <Edit3 size={15} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(p)}
                          className="p-1.5 h-8 w-8 text-slate-400 hover:text-red-400"
                          title="Delete Provider"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
