#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");

function run(argv) {
  const app = Application($.getenv("LP_APP"));
  const collections = app.collections();

  const formattedResults = [];
  for (var i in collections) {
    const collection = collections[i];

    formattedResults.push({
      uid: collection.id(),
      title: collection.name(),
      arg: `list^${collection.id()}`,
      mods: {
        cmd: {
          arg: `play^${collection.id()}`,
          subtitle: "Start album shuffle",
        },
      },
    });
  }

  return JSON.stringify({
    items: formattedResults,
  });
}
