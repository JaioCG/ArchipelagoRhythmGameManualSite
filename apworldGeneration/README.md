# Archipelago Rhythm Game Manual Generation

Node application to generate apworlds for the [Archipelago Rhythm Game Manual Site](https://jaiocg.github.io/ArchipelagoRhythmGameManualSite/).

## How to Use

1. Set up a JSON file for song data, following the schema below
2. Run the application setting the JSON file as the argument: `node index.js <file>.json`
3. A `<game>.apworld` and new `<game>.json` file should appear in the program directory!

Do note that custom apworlds will not work on the site without first placing the newly generated `<game>.json` file inside the site's `data` directory, and adding the option for the game in the login container's HTML.

## Input JSON Schema

```json
{
    "gameName": "WACCA",
    "sheetName": "Reverse Point",
    "fillerItems": [ // Maximum of 8
        "Marvelous",
        "Missless"
    ],
    "difficulties": [
        {
            "name": "Normal", // Used in Options Creator
            "color": "#14A0E4" // Used on website
        }
    ],
    "diffFloor": 10, // Integer, multiply intended floor/ceiling by 10
    "diffCeiling": 151, // Integer, multiply intended floor/ceiling by 10
    "songs": [
        {
			"title": "Rainbow Dream",
			"sheets": [
				{
					"difficulty": 3,
					"version": "WACCA" // Version is placed in each sheet due to some sheets being added in the future
				},
				{
					"difficulty": 8.7,
					"version": "WACCA"
				},
				{
					"difficulty": 11.4,
					"version": "WACCA"
				}
			],
			"exclusivity": [], // Used for exclusive notes, i.e. Online, JP, Asia, etc.
			"categories": [ "TANO*C（オリジナル）" ] // Array due to some games having songs with multiple categories
		}
	]
}
```