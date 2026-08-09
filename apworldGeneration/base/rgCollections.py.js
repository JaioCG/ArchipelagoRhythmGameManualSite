export const rgCollectionspy = (sheet, fillerItems, difficulties) => {
	return `
from .items import DifficultyData, SongData
from .SongData import SONG_DATA, groups
from typing import Dict, List
from collections import ChainMap

class rgCollections:
	SHEET_NAME: str = "${sheet}"
	SHEET_CODE: int = 1

	song_locations: Dict[str, int] = {}
	song_items: Dict[str, SongData] = {}

	filler_items: Dict[str, int] = {
		${fillerItems.map((item, index) => `"${item}": ${index + 1},`).join("\n\t\t")}
	}

	filler_weights: Dict[str, int] = {
		${fillerItems.map((item, index) => `"${item}": 1,`).join("\n\t\t")}
	}

	item_names_to_id: ChainMap = ChainMap({}, filler_items)
	location_names_to_id: ChainMap = ChainMap(song_locations)

	def __init__(self) -> None:
		self.item_names_to_id[self.SHEET_NAME] = self.SHEET_CODE
		for key, data in SONG_DATA.items():
			self.song_items[key] = data

		self.item_names_to_id.update({name: data.code for name, data in self.song_items.items()})

		location_id_index = 1
		for name in SONG_DATA.keys():
			self.song_locations[f"{name}-0"] = location_id_index 
			self.song_locations[f"{name}-1"] = location_id_index + 1
			location_id_index += 2

	def getSongsWithSettings(self, options, diff_lower: int, diff_higher:int) -> List[str]:
		filtered_list = []

		for key, data in self.song_items.items():
			${difficulties.map((diff, index) => `if data.sheets[${index}].difficulty != None and "${diff.name}" in options.difficulty_option and diff_lower <= data.sheets[${index}].difficulty * 10 <= diff_higher:\n\t\t\t\tfiltered_list.append(key)\n\t\t\t\tcontinue`).join("\n\t\t\t")}
		
		return filtered_list
	
	def getItemNameGroups(self) -> Dict[str, str]:
		return groups
	`;
};