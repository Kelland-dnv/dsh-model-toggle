/**
 * dsh-model-toggle — Host half.
 *
 * Owns the `model-toggle` settings namespace: a list of hidden models
 * (per provider/model pair). Phase 3 adds the model-catalog filter that
 * consumes this configuration.
 */
import type { Context } from '@deepseek-ai/cordis'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import z from '@deepseek-ai/schemastery'

export const name = 'dsh-model-toggle'

/** The settings namespace both halves address (the card keys on it too). */
export const MODEL_TOGGLE_NS = settingsNamespace('model-toggle')

/** One hidden model: the provider/model route pair plus a display-name snapshot. */
export interface HiddenModel {
  provider: string
  model: string
  /** Display name captured when hidden, so the card can label the row after the catalog stops advertising it. */
  name?: string
}

export interface Config {
  /** Models excluded from the model-selector catalog; empty means all visible. */
  hidden: HiddenModel[]
}

export const Config: z<Config> = z.object({
  hidden: z.array(z.object({
    provider: z.string().required(),
    model: z.string().required(),
    name: z.string(),
  })).default([]),
})

export function apply(ctx: Context, config: Config): void {
  let source: () => Config = () => config

  installSettingsSection(ctx, MODEL_TOGGLE_NS, Config, config, {
    setSource: (current) => { source = current },
    onChange: () => {
      // The catalog filter (phase 3) reads `source()` live on every
      // listModels call, so a committed change needs no rebuild here.
      ctx.logger.debug(`model-toggle: ${String(source().hidden.length)} hidden model(s)`)
    },
  })
}
