# loops-for-learning

An educational app, deployed as a static site, offering access to a very broad range of interactive educational
mini tools. Based on the [gestalts](../gestalts) data paradigm.
Each interactive edu mini tool is a plugin (in [gestalt-plugins](../gestalt-plugins)) and comes with "recommended"
data, its decks, deployed under `decks/<plugin>/<deck>/`, which are copied on write into the user-space yml collection.

If available, notes sync to a folder on the desktop via the Gestalter's desktop app (`gestalter`, if the user is
running it), from a browser on that same computer.

So far it is the host with three views, Flashcards, the alphabet pronunciation trainer and the phrasebook, one at a time (tabs). The phrasebook may record (`grants` in `distribution.yml`). Its storage in the browser is still called `demo/` (from when this was the Demo).

## Developing

Needs [mise](https://mise.jdx.dev) and checkouts of gestalts and gestalt-plugins next to this one: until they are
published, this app links their packages and plugins by path.

```
parent/
  gestalts/
  gestalt-plugins/
  loops-for-learning/
```

```sh
mise install          # once after cloning, and when mise.toml changes
mise run dev          # the app on :5174 with hot reload, gestalts and the plugins included
mise run check        # lints, typechecks
mise run build        # dist/: static files to host anywhere
```

`distribution.yml` lists the plugins by path; every one tagged `learning` becomes a tab.
