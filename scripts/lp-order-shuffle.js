#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");

function run(argv) {
  const query = argv[0];
  const orderId = query.substring(5);

  const app = Application($.getenv("LP_APP"));
  const order = app.orders.byId(orderId);
  order.shuffle();
}
