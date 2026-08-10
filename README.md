# Archipelago Rhythm Game Manual Site

A website built to allow for playing various rhythm games with [Archipelago](https://archipelago.gg/). The goal of this app is to allow manual rhythm game Archipelago implementations to be easier than ever, to match officially supported games like Muse Dash.

## Supported Games List

- CHUNITHM (Up through X-VERSE-X)
- maimai DX (Up through CiRCLE PLUS, last updated 8/10)
- Project Sekai: Colorful Stage (Last updated 8/10)
- SOUND VOLTEX (Up through Nabla, Last updated 8/10)
- WACCA (Up through ➕, Last updated 8/10)

More games are always welcome, and you can view the [apworldGeneration](https://github.com/jaiocg/ArchipelagoRhythmGameManualSite/tree/main/apworldGeneration) folder on how to add new games.

## How To Use

1. Grab your desired apworld(s) from the [releases page](https://github.com/jaiocg/ArchipelagoRhythmGameManualSite/releases/latest) and generate a YAML and game.
2. Open the [webpage](https://jaiocg.github.io/ArchipelagoRhythmGameManualSite/) and log in with your credentials. Make sure to select the correct game from the dropdown!
3. Upon connection, you should be presented with a text client and full list of songs that were generated to be randomized.

Logic works similarly to other rhythm game Archipelago implementations (most notably Muse Dash), where completing a song sends two checks, and you collect a percentage of music sheets (differently named per game) to goal.

## Frequently Asked Questions

### Can I still use the Archipelago Manual client with these worlds?

No. While these worlds effectively work like a standard Manual, they are not built for use with the Archipelago Text/Manual Client. With lots of rhythm game songs not being localized to English, and the Archipelago application not supporting Japanense characters, the majority of locations for games will be entirely unreadable.

### Can you add support for X game?

Absolutely! You can suggest new games to add via GitHub Issues or directly on Discord (@jaiocg or @studkid), and preferrably include an update data source with song information to make generation easier.

### Do you need access to any specific version/regional release of a game?

No, you can exclude specific versions or regions in the YAML, along with specific songs.

Specific Region Excludes:
- CHUNITHM: "Japan Exclusive", "Asia Exclusive"
- maimai DX "Japan Exclusive", "Asia Exclusive"
- Project Sekai: Colorful Stage: "JP Exclusive", "EN Exclusive"
- SOUND VOLTEX: N/A
- WACCA: "Online"

### Help! It's expecting me to play a song that is not accessible on my game!

Well, it's a Manual so... Just click the button, nobody has to know ;).

If this happens due to a version/region exlcusion issue, please open a GitHub issue or alert @jaiocg or @studkid so we can fix it.

## Libraries and Data Sources

- [archipelago.js](https://archipelago.js.org/stable/)
- [adm-zip](https://github.com/cthackers/adm-zip) in apworldGeneration


Specific data sources and format scripts can be found in the [apworldGeneration/utils](https://github.com/jaiocg/ArchipelagoRhythmGameManualSite/tree/main/apworldGeneration/utils) folder.