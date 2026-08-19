/**
 * The model-toggle settings card: provider-grouped model rows, each with a
 * visibility switch. Presentation only — state and writes live in the
 * controller behind the injected face.
 */
import type { CSSProperties } from 'react'
import type { SnapshotSelectorHook, TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { ModelToggleState } from './controller.ts'
import type {} from './locales.ts'

/** Composed props this card consumes (t seat + inject face). */
export interface ModelToggleCardProps {
  t: TranslateNS<'settings.modelToggle'>
  useModelToggle: SnapshotSelectorHook<ModelToggleState>
  toggle: (provider: string, model: string, name: string, hidden: boolean) => void
  reload: () => void
}
const cardStyle: CSSProperties = {
  border: '1px solid var(--dsw-border, rgba(128,128,128,.35))',
  borderRadius: 8,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '4px 0',
}

/** A minimal dependency-free switch (the primitives package ships none). */
function Switch(props: { on: boolean; disabled: boolean; label: string; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={props.on}
      aria-label={props.label}
      disabled={props.disabled}
      onClick={() => { props.onChange(!props.on) }}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        border: 'none',
        padding: 2,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        background: props.on ? 'var(--dsw-accent, #4c8bf5)' : 'var(--dsw-border, rgba(128,128,128,.45))',
        opacity: props.disabled ? 0.5 : 1,
        display: 'inline-flex',
        justifyContent: props.on ? 'flex-end' : 'flex-start',
        transition: 'background .15s',
        flex: 'none',
      }}
    >
      <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', display: 'block' }} />
    </button>
  )
}

export function ModelToggleCard(props: ModelToggleCardProps) {
  const { t, toggle, reload } = props
  const state = props.useModelToggle(snapshot => snapshot)

  return (
    <section style={cardStyle}>
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600 }}>{t('title')}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{t('intro')}</div>
        </div>
        {state.phase === 'ready' && (
          <div style={{ fontSize: 12, opacity: 0.75, flex: 'none' }}>
            {t('visibleCount', { visible: state.visible, total: state.total })}
          </div>
        )}
      </header>

      {state.phase === 'loading' && <div style={{ fontSize: 13, opacity: 0.75 }}>{t('loading')}</div>}

      {state.phase === 'error' && (
        <div style={{ fontSize: 13 }}>
          <span>{t('loadFailed', { message: state.error ?? '' })}</span>{' '}
          <button type="button" onClick={reload} style={{ cursor: 'pointer' }}>{t('retry')}</button>
        </div>
      )}

      {state.phase === 'ready' && !state.writable && (
        <div style={{ fontSize: 12, opacity: 0.75 }}>{t('readOnly')}</div>
      )}

      {state.phase === 'ready' && state.groups.length === 0 && (
        <div style={{ fontSize: 13, opacity: 0.75 }}>{t('empty')}</div>
      )}

      {state.phase === 'ready' && state.total > 0 && state.visible === 0 && (
        <div style={{ fontSize: 12, color: 'var(--dsw-warning, #c77700)' }}>{t('allHiddenWarning')}</div>
      )}

      {state.phase === 'ready' && state.groups.map(group => (
        <div key={group.id}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, margin: '6px 0 2px' }}>{group.name}</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {group.models.map(model => (
              <li key={model.id} style={rowStyle}>
                <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {model.name}
                  {model.name !== model.id && (
                    <span style={{ opacity: 0.55, marginLeft: 6, fontSize: 12 }}>{model.id}</span>
                  )}
                </span>
                <Switch
                  on={!model.hidden}
                  disabled={!state.writable}
                  label={model.name}
                  onChange={visible => { toggle(group.id, model.id, model.name, !visible) }}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
