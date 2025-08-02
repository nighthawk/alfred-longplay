#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");

function formatAlbums(collectionId) {
  const app = Application($.getenv("LP_APP"));
  const collection = app.collections.byId(collectionId);
  const entries = collection.entries();

  const formattedResults = [];
  for (var i in entries) {
    const entry = entries[i];

    const result = processEntry(entry, app, (baseResult) => {
      return {
        ...baseResult,
        arg: `opt^${baseResult.uid}`,
        mods: {
          cmd: {
            arg: `play^${baseResult.uid}`,
            subtitle: "Play now",
          },
        },
      };
    });

    if (result) {
      formattedResults.push(result);
    }
  }

  return formattedResults;
}

/**
 * Extracts basic information from an entry and passes it to a callback for further customization
 * @param {Object} entry - The entry object from search results
 * @param {Object} app - The Longplay application instance
 * @param {Function} callback - A function that receives the base result and can add custom fields
 * @returns {Object|null} The final formatted result or null if entry is of unsupported kind
 */
function processEntry(entry, app, callback) {
  const id = entry.id();
  const kind = entry.kind();
  console.log(kind + " id '" + id + "'");

  var title;
  var subtitle = null;
  var icon = null;

  if (kind == "playlist") {
    const playlist = app.playlists.byId(id);
    title = playlist.name();
    subtitle = "Playlist";
    icon = {
      path: playlist.artworkURL(),
    };
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
    return null; // Unsupported kind
  }

  const baseResult = {
    uid: id,
    title: title,
    subtitle: subtitle,
    icon: icon,
  };

  return callback(baseResult);
}

var collectionId = $.getenv("collection_id").trim();
var results = formatAlbums(collectionId);
JSON.stringify({
  items: results,
});
