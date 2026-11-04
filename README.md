# loops-for-learning

An educational app, deployed as a static site, offering access to a very broad range of interactive educational
mini tools. Based on the [gestalts](../gestalts) data paradigm.
Each interactive edu mini tool is a plugin (in gestalts' `plugins/`) and comes with some "recommended" demo data, its
deck, deployed under `decks/<id>/`, which is duplicated copy-on-write to the user-space yml collection.

If available, notes sync to a folder on the desktop via the connector integrated in `gestalter` (if the user is
running that).

So far it is the host with one plugin, greek-alphabet, its pane shown alone. Its storage in the browser is still
called `demo/` (from when this was the Demo), so learners keep their data.

## Developing

Needs [mise](https://mise.jdx.dev) and a checkout of gestalts next to this one: until it is published, this app
links its packages and plugins by path.

```
parent/
  gestalts/
  loops-for-learning/
```

```sh
mise install          # once after cloning, and when mise.toml changes
mise run dev          # the app on :5174 with hot reload, gestalts included
mise run check        # lints, typechecks
mise run build        # dist/: static files to host anywhere
```

Plugins are the `@gestalts-plugin/*` dependencies in `package.json`; `distribution.yml` says which panes it opens
with.
