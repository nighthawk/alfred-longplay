#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");

function run(argv) {
  const query = argv[0];
  const collectionId = query.substring(5);

  const app = Application($.getenv("LP_APP"));
  const collection = app.collections.byId(collectionId);
  collection.shuffle();
}
