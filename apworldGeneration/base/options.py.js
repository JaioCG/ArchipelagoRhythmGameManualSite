export const optionspy = (difficulties, diffFloor, diffCeiling) => {
	return `
from Options import Range, ItemSet, OptionSet, PerGameCommonOptions, OptionGroup
from dataclasses import dataclass

class StartingSongs(Range):
    """The number of songs that will be unlocked from the start"""
    range_start = 3
    range_end = 10
    default = 5
    display_name = "Starting Song Count"

class AdditionalSongs(Range):
    """The total number of songs that will be placed in the randomization pool.
    - This does not count any starting songs or the goal song.
    - The final song count may be lower due to other settings.
    """
    range_start = 15
    range_end = 500
    default = 30
    display_name = "Additional Song Count"

class DuplicateSongPercentage(Range):
    """
    Percentage of duplicate songs to place in remaining filler slots.
    Duplicate songs are considered Useful and thus out of logic.
    """
    range_start = 0
    range_end = 100
    default = 100
    display_name = "Duplicate Song Percentage"

class DifficultyOption(OptionSet):
    """
    Determines what difficulties to be selected for song filtering
    This setting will not force you to play on any of the selected difficulties and intened to be used with the following intensity settings
    """
    display_name = "Difficulty Selection"
    default = [${difficulties.map((diff) => `"${diff.name}"`).join(", ")}]
    valid_keys = [${difficulties.map((diff) => `"${diff.name}"`).join(", ")}]

class MinLevel(Range):
    """ 
    Ensures chosen song will have a chart with an level value higher than this value
    Note: Number represented is the internal difficulty multiplied by 10.
    """
    range_start = ${diffFloor}
    range_end = ${diffCeiling}
    default = ${diffFloor}
    display_name = "Minimum Level"

class MaxLevel(Range):
    """
    Ensures chosen song will have a chart with an level value lower than this value
    Note: Number represented is the internal difficulty multiplied by 10.
    """
    range_start = ${diffFloor}
    range_end = ${diffCeiling}
    default = ${diffCeiling}
    display_name = "Maximum Level"

class SheetCountPercentage(Range):
    """Percentage of filler item to be replaced with music sheets."""
    range_start = 50
    range_end = 100
    default = 80
    display_name = "Music Sheet Percentage"

class SheetWinPercentage(Range):
    """The percentage of music sheets in the item pool that are needed to unlock the goal song."""
    range_start = 50
    range_end = 100
    default = 80
    display_name = "Music Sheets Needed to Win"

class IncludeSongsPercentage(Range):
    """
    Percentage chance for songs in the included list to be chosen.
    """
    range_start = 0
    range_end = 100
    default = 100
    display_name = "Include Songs Percentage"

class IncludeSongs(ItemSet):
    """
    These songs will be guaranteed* to show up within the seed.
    - Difficulty options will affect these songs.
    - Changing Include Songs Percentage from 100% will make it no longer guarenteed.
    """
    verify_item_name = True
    display_name = "Include Songs"

class ExcludeSongs(ItemSet):
    """
    These songs will be guaranteed to not show up within the seed.
    
    Note: Does not affect songs within the "Include Songs" list.
    Note 2: Accepts versions and genres for more specific filtering.
    """
    verify_item_name = True
    display_name = "Exclude Songs"

class GoalSongPool(ItemSet):
    """
    Songs listed here will randomly chosen to be the goal song.
    If empty, the goal song will be chosen randomly from all included songs.
    """
    verify_item_name = True
    display_name = "Goal Song Pool"

rg_option_groups = [
    OptionGroup("Game Length Settings", [
        SheetCountPercentage,
        SheetWinPercentage,
        StartingSongs,
        AdditionalSongs,
        DuplicateSongPercentage,
    ]),
    OptionGroup("Song Choice Settings", [
        IncludeSongsPercentage,
        IncludeSongs,
        ExcludeSongs,
        GoalSongPool,
    ]),
    OptionGroup("Difficulty Filtering Settings", [
        DifficultyOption,
        MinLevel,
        MaxLevel,
    ]),
]

@dataclass
class rgOptions(PerGameCommonOptions):
    starting_song_count: StartingSongs
    additional_song_count: AdditionalSongs
    duplicate_song_percentage: DuplicateSongPercentage
    difficulty_option: DifficultyOption
    min_level: MinLevel
    max_level: MaxLevel
    sheet_count_percentage: SheetCountPercentage
    sheet_win_percentage: SheetWinPercentage
    include_songs_percentage: IncludeSongsPercentage
    include_songs: IncludeSongs
    exclude_songs: ExcludeSongs
    goal_song_pool: GoalSongPool
	`;
};