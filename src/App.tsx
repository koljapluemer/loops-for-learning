import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { distribution, plugins } from 'virtual:gestalts-plugins';
import { logger, RepoProvider } from '@gestalts/client';
import { DebugLogButton } from '@gestalts/ui/debug';
import { findPane, SinglePane, usePluginRepo } from '@gestalts/ui/host';
import { ConnectorSettings } from '@gestalts/ui/perspectives';

/**
 * The host with the learning plugins, one pane at a time (`default_panes`, as tabs). Their decks are read-only; a
 * deck note is copied into this browser (OPFS) with the learner's progress once it is first practised, so the
 * learner's data stands on its own.
 */
const log = logger('loops');

const REGISTRY = { distribution, plugins };
const PANES = distribution.default_panes;
const LAST_PANE = 'loops-for-learning:pane';

function lastPane(): string {
  try {
    const p = localStorage.getItem(LAST_PANE);
    if (p && PANES.includes(p)) return p;
  } catch { /* no storage: the first pane */ }
  return PANES[0];
}

export function App() {
  const { repo, error } = usePluginRepo({ dir: 'demo' }, REGISTRY);
  const [pane, setPane] = useState(lastPane);
  useEffect(() => {
    const r = repo?.upstreamReport();
    if (r && (r.copied.length || r.updated.length || r.diverged.length)) log.info('deck update', { copied: r.copied, updated: r.updated, diverged: r.diverged });
    if (r?.deck_conflicts.length) log.warn('decks disagree', { conflicts: r.deck_conflicts });
  }, [repo]);
  const choose = (p: string) => {
    setPane(p);
    try { localStorage.setItem(LAST_PANE, p); } catch { /* not remembered */ }
  };
  return (
    <div className="flex h-dvh flex-col bg-base-200">
      <header className="navbar min-h-0 gap-2 bg-base-100 px-4 py-1 shadow-sm">
        <span className="font-semibold">Loops for learning</span>
        <div role="tablist" className="tabs tabs-border flex-1 overflow-x-auto">
          {PANES.length > 1 && PANES.map((p) => (
            <button key={p} type="button" role="tab" aria-selected={p === pane} className={`tab ${p === pane ? 'tab-active' : ''}`} onClick={() => choose(p)}>
              {findPane(REGISTRY, p)?.pane.title ?? p}
            </button>
          ))}
        </div>
        <DebugLogButton />
        {repo && (
          <details className="dropdown dropdown-end">
            <summary className="btn btn-sm btn-ghost btn-square" title="Sync settings"><Settings className="size-4" /></summary>
            <div className="dropdown-content z-50 mt-2 rounded-box border border-base-300 bg-base-100 p-3 shadow">
              <RepoProvider repo={repo}><ConnectorSettings /></RepoProvider>
            </div>
          </details>
        )}
      </header>
      <main className="min-h-0 flex-1">
        {error && <div role="alert" className="alert alert-error m-4">Could not load: {error}</div>}
        {!error && !repo && <div className="flex justify-center p-8"><span className="loading loading-spinner" /></div>}
        {repo && <RepoProvider repo={repo}><SinglePane key={pane} registry={REGISTRY} paneRef={pane} /></RepoProvider>}
      </main>
      <footer className="px-4 py-1 text-center text-xs text-base-content/50">Your progress is stored only in this browser, unless you sync it. Pronunciation generated with espeak-ng; maps from Natural Earth.</footer>
    </div>
  );
}
