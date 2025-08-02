#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");

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

function run(argv) {
  const appName = $.getenv("LP_APP") || "Longplay";

  try {
    const app = Application(appName);

    // Test if app is running
    if (!app.running()) {
      return JSON.stringify({
        items: [
          {
            uid: "not-running",
            title: "Longplay is not running",
            subtitle: "Start Longplay to see current track",
            arg: "",
            valid: false,
          },
        ],
      });
    }

    const playerState = app.playerState();

    let currentTrack;
    try {
      currentTrack = app.currentTrack();
    } catch (e) {
      currentTrack = null;
    }

    if (currentTrack) {
      const trackName = currentTrack.name();
      const trackArtist = currentTrack.trackArtist();

      const trackEntry = currentTrack.entry();
      const isPlaying = playerState === "playing";
      const playPauseAction = isPlaying ? "pause" : "playpause";
      const rating = currentTrack.rating();
      const ratingText =
        rating > 0 ? `${rating} star${rating === 1 ? "" : "s"}` : "Not rated";

      // Use processEntry to get entry info with artwork
      const entryInfo = processEntry(trackEntry, app, (baseResult) => {
        return {
          entryName: baseResult.title,
          entrySubtitle: baseResult.subtitle,
          artwork: baseResult.icon,
        };
      });

      const trackSubtitle = `${trackArtist} • ${entryInfo.entryName}`;

      return JSON.stringify({
        items: [
          {
            title: trackName,
            subtitle: trackSubtitle,
            arg: "open-app",
            icon: entryInfo.artwork,
          },
          {
            title: isPlaying ? "Pause" : "Play",
            subtitle: isPlaying ? "Pause current track" : "Resume playback",
            arg: playPauseAction,
            mods: {
              cmd: {
                arg: "stop",
                subtitle: "Stop playback",
              },
            },
          },
          {
            title: "Skip",
            subtitle: "Skip to next album",
            arg: "skip",
            mods: {
              cmd: {
                arg: "random",
                subtitle: "Play a random album",
              },
            },
          },
          {
            title: "Rate",
            subtitle: ratingText,
            arg: "rate",
          },
        ],
      });
    } else {
      // No current track
      return JSON.stringify({
        items: [
          {
            uid: "no-track",
            title: "No music playing",
            subtitle: "Start playing music in Longplay",
            arg: "playpause",
            valid: false,
          },
        ],
      });
    }
  } catch (error) {
    return JSON.stringify({
      items: [
        {
          uid: "error",
          title: "Error connecting to Longplay",
          subtitle: `${error.toString()} (App: ${appName})`,
          arg: "",
          valid: false,
        },
      ],
    });
  }
}
