export const itemspy = (game) => {
	return `
from typing import NamedTuple, Optional, List
from BaseClasses import Item, ItemClassification

class DifficultyData(NamedTuple):
	difficulty: float
	version: str

class SongData(NamedTuple):
	code: int
	title: str
	sheets: List[DifficultyData]
	categories: List[str]

class rgSongItem(Item):
	game: str = "${game}"

	def __init__(self, name: str, player: int, data: SongData) -> None:
		super().__init__(name, ItemClassification.progression, data.code, player)

class rgFixedItem(Item):
	game: str = "${game}"

	def __init__(self, name: str, classification: ItemClassification, code: int, player: int) -> None:
		super().__init__(name, classification, code, player)
	`;
};