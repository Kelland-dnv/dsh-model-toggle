/**
 * dsh-model-toggle — Host half.
 *
 * Phase 1 skeleton: registers nothing yet; proves the plugin loads.
 * Later phases add the settings section (hidden-model list) and the
 * model-catalog filter.
 */
import type { Context } from '@deepseek-ai/cordis'

export const name = 'dsh-model-toggle'

export function apply(ctx: Context): void {
  ctx.logger.info('dsh-model-toggle: host half loaded')
}
