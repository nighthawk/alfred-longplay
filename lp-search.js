#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");

/** @type {AlfredRun} */
function run(argv) {
  const query = argv[0];
  const results = searchAndFormatAlbums(query);
  return JSON.stringify({
    items: results,
  });
}

function searchAndFormatAlbums(query) {
  const app = Application("LPDev");
  const matches = app.search({ for: query, mode: "autocompletion" });
  console.log("Found " + matches.length + " matches");

  const formattedResults = [];
  for (var i in matches.slice(0, 20)) {
    var title;
    var subtitle = null;
    var icon = null;

    const id = matches[i].id();
    const kind = matches[i].kind();
    console.log(kind + " id '" + id + "'");
    if (kind == "playlist") {
      const playlist = app.playlists.byId(id);
      title = playlist.name();
      subtitle = "";
    } else if (kind == "album") {
      const album = app.albums.byId(id);
      title = album.name();
      subtitle = album.artist();
      const year = album.year();
      if (year) {
        subtitle += ` — ${year}`;
      }
      icon = {
        path: album.artworkURL(),
      };
    } else {
      continue;
    }

    formattedResults.push({
      uid: id,
      title: title,
      subtitle: subtitle,
      icon: icon,
      arg: `opt^${id}`,
      mods: {
        cmd: {
          arg: `play^${id}`,
          subtitle: "Play now",
        },
      },
    });
  }

  return formattedResults;
}
