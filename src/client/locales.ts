/**
 * Locale dictionaries for the model-toggle settings card.
 * The namespace is merged into the slot system's LocaleNamespaceMap so the
 * register site can declare `locale:` and receive the typed `t` seat.
 */

/** Dictionary keys of this card's copy. */
export type ModelToggleLocaleKey =
  | 'title'
  | 'intro'
  | 'loading'
  | 'loadFailed'
  | 'retry'
  | 'empty'
  | 'allHiddenWarning'
  | 'unavailableModel'
  | 'readOnly'
  | 'visibleCount'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The model-toggle card's copy. */
    'settings.modelToggle': ModelToggleLocaleKey
  }
}

export const LOCALE_NS = 'settings.modelToggle' as const

export const zh: Record<ModelToggleLocaleKey, string> = {
  title: '模型可见性',
  intro: '控制各模型是否出现在对话界面的模型选择菜单中。隐藏一个正在使用的模型不会中断该会话。',
  loading: '正在读取模型目录…',
  loadFailed: '模型目录读取失败：{message}',
  retry: '重试',
  empty: '没有任何 Provider 提供模型。',
  allHiddenWarning: '所有模型都已隐藏，模型选择菜单将是空的。',
  unavailableModel: '该模型当前不在 Provider 目录中',
  readOnly: '设置文档不可写，开关已禁用。',
  visibleCount: '{visible} / {total} 可见',
}

export const en: Record<ModelToggleLocaleKey, string> = {
  title: 'Model visibility',
  intro: 'Control which models appear in the conversation model selector. Hiding a model a session already uses never interrupts that session.',
  loading: 'Loading the model catalog…',
  loadFailed: 'Failed to load the model catalog: {message}',
  retry: 'Retry',
  empty: 'No provider advertises any model.',
  allHiddenWarning: 'Every model is hidden; the model selector will be empty.',
  unavailableModel: 'This model is not currently advertised by its provider',
  readOnly: 'The settings document is read-only; toggles are disabled.',
  visibleCount: '{visible} / {total} visible',
}
