/**
 * dsh-model-toggle — browser half.
 *
 * Registers the model-visibility card into the plugin settings section
 * (`settings.plugin.item`) and its locale dictionaries. Cross-plugin
 * collaboration goes through cordis services only: the slot key's
 * declaration, the settings scope, and the wire handle arrive as type-only
 * merges, never value imports (the loader bundle-purity rule).
 */
import type { Context } from '@deepseek-ai/cordis'
// Type-only merges: ctx.settingsScope, ctx.locale, ctx.slots, and the
// `settings.plugin.item` slot declaration.
import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-runtime/client'
import type { Config } from '../index.ts'
import { ModelToggleCardController } from './controller.ts'
import { ModelToggleCard } from './ModelToggleCard.tsx'
import { LOCALE_NS, en, zh } from './locales.ts'

// The published /client types omit the browser-side merge for
// `ctx.connection` (the ConnectionHandle the connection plugin provides);
// restate it locally until the package ships it.
declare module '@deepseek-ai/cordis' {
  interface Context {
    connection: ConnectionHandle
  }
}

export const name = 'dsh-model-toggle'
export const inject = ['slots', 'locale', 'connection', 'settingsScope'] as const

export function apply(ctx: Context): void {
  ctx.locale.register(LOCALE_NS, { zh, en })

  const scope = ctx.settingsScope.bind<Config>({ namespace: 'model-toggle' })
  const controller = new ModelToggleCardController(scope, ctx.connection.api)

  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    // The deployed slot is keyed on the settings namespace; the published
    // rc typings still describe it as a list (id), so both fields ride
    // along and the cast bridges the drift.
    key: 'model-toggle',
    id: 'model-toggle',
    locale: LOCALE_NS,
    inject: () => controller.face(),
  } as never, ModelToggleCard as never))
}
