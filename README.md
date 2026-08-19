# dsh-model-toggle

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin
that lets you hide individual models from the Web UI's model-selector
dropdown, per provider/model pair, without touching your provider
configuration.

## What it does

- Adds a **模型可见性 / Model visibility** card to Settings → Plugins,
  listing every model advertised by every configured provider, each with a
  visibility switch.
- Flipping a switch updates a plugin-owned `hidden` list (not your
  `llm-*` provider settings) and immediately re-filters the model catalog
  served to both the conversation model selector and the settings page.
- Hiding a model a session is currently using never interrupts that
  session — catalog membership is advisory in the harness; hiding only
  changes what the selector *offers*.
- New models a provider starts advertising appear automatically (and
  visible by default) — the plugin only remembers what to hide, not what
  to show.

## Install

```sh
dsh plugin --profile web add dsh-model-toggle
```

(or `add ./dsh-model-toggle` / `add ./dsh-model-toggle-0.2.0.tgz` for a local
checkout or tarball — see the harness's
[publish tutorial](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)
for the general mechanics of installing a bundle into a profile).

No configuration is required after install; every model starts visible.

## How it works

- **Host half** (`src/index.ts`) registers a `model-toggle` settings
  namespace (`{ hidden: [{ provider, model, name? }] }`) and wraps
  `ctx.llm.listModels` to filter out hidden entries. The wrap is an
  `ctx.effect`, so it is removed cleanly if the plugin is disabled or
  hot-reloaded.
- **Client half** (`src/client/`) registers a card into the
  `settings.plugin.item` slot. The card reads the (already filtered)
  catalog through `llm.models` and unions it with the `hidden` list from
  the settings scope, so a hidden model's row still renders (labeled with
  the name snapshot captured when it was hidden) even after the catalog
  stops advertising it.

## Development

```sh
npm install
npm run build      # tsc (types) + tsdown (node lib + browser client bundle)
npm run typecheck
```

`tsdown.config.ts` reproduces the harness's client-bundle preset (the
lazy-CJS `window.__ModuleLoader__.load` factory, externals resolved from
the loader's frozen module table) since that preset is not published
separately from the harness monorepo.

## Known limitations

- Filtering wraps `ctx.llm.listModels` at runtime (an own-property
  override on the service instance) rather than using an official
  catalog-filter extension point, because the harness does not currently
  expose one. This is expected to keep working across harness updates as
  long as `ctx.llm.listModels(provider)` keeps its current shape, but is
  not a stable public seam.
- The card only ever removes/adds `hidden` entries by exact
  `provider`/`model` id; it does not rename or merge entries if a provider
  changes a model's id.
