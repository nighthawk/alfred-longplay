#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");

function run(argv) {
  const app = Application($.getenv("LP_APP"));
  const orders = app.orders();

  const formattedResults = [];
  for (var i in orders) {
    const order = orders[i];

    formattedResults.push({
      uid: order.id(),
      title: order.name(),
      arg: `list^${order.id()}`,
      mods: {
        cmd: {
          arg: `play^${order.id()}`,
          subtitle: "Start album shuffle",
        },
      },
    });
  }

  return JSON.stringify({
    items: formattedResults,
  });
}
