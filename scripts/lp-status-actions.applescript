#!/usr/bin/env osascript

on run argv
	set actionName to item 1 of argv

	tell application "Longplay"
		if actionName is "open-app" then
			activate
		else if actionName is "playpause" then
			playpause
		else if actionName is "pause" then
			pause
		else if actionName is "stop" then
			stop
		else if actionName is "skip" then
			skip
		else if actionName is "random" then
			set allEntries to entries
			set randomIndex to (random number from 1 to (count of allEntries))
			set randomEntry to item randomIndex of allEntries
			play randomEntry
		end if
	end tell

	return "Action completed: " & actionName
end run
