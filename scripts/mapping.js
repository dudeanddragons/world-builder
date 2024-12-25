// mapping.js

// Density-to-Feature Mapping
export const densityFeatureMap = {
    "Borderlands": "assets/terrain/terrainFeaturesBorderlands.json",
    "Settled": "assets/terrain/terrainFeaturesSettled.json",
    "Wilderness": "assets/terrain/terrainFeaturesWilderness.json"
  };

// Mapping for terrain cave types
export const terrainCaveMap = {
    "Desert": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeDesert.json",
    "Forest": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeForest.json",
    "Hills": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeHills.json",
    "Marsh": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeMarsh.json",
    "Mountains": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeMountains.json",
    "Plains": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypePlains.json",
    "Water": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeWater.json"
  };
  
    // Sub-Feature Wilderness Mapping
    export const subFeatureWildernessMap = {
        "Ruins and Relics": "assets/terrain/terrainFeatures/terrainFeaturesRuinClass.json",
        "Lurid Lairs": "assets/terrain/terrainFeatures/terrainFeaturesLuridLairs.json",
        "Rivers and Roads/Islands": "assets/terrain/terrainFeatures/terrainFeaturesRoadRiver.json"
    };


  // Mapping for sub-feature files
  export const subFeatureMap = {
    "Remnants": "assets/terrain/terrainFeatures/ruins/remnants.json",
    "Ruins": "assets/terrain/terrainFeatures/ruins/ruins.json",
    "Skeletons": "assets/terrain/terrainFeatures/ruins/skeletons.json",
    "Vestiges": "assets/terrain/terrainFeatures/ruins/vestiges.json",
    "Wrecks": "assets/terrain/terrainFeatures/ruins/wrecks.json",
    "Antiques": "assets/terrain/terrainFeatures/relics/antiques.json",
    "Artifacts": "assets/terrain/terrainFeatures/relics/artifacts.json",
    "Refuse": "assets/terrain/terrainFeatures/relics/refuse.json",
    "Relics": "assets/terrain/terrainFeatures/relics/relics.json",
    "Remains": "assets/terrain/terrainFeatures/relics/remains.json",
    "Burrows": "assets/terrain/terrainFeatures/lairs/burrows.json",
    "Camp": "assets/terrain/terrainFeatures/lairs/camps.json",
    "Crevice": "assets/terrain/terrainFeatures/lairs/crevice.json",
    "Dungeon": "assets/terrain/terrainFeatures/lairs/dungeons.json",
    "Dwelling": "assets/terrain/terrainFeatures/lairs/dwelling.json",
    "Ledge": "assets/terrain/terrainFeatures/lairs/ledge.json",
    "Shipwreck": "assets/terrain/terrainFeatures/lairs/shipwreckEncounters.json",
    "Lair Occupation Status": "assets/terrain/terrainFeatures/lairs/lairSubOccupationStatus.json"
  };
  
  // Mapping for remnant-specific sub-types
  export const remnantSubMap = {
    "Bridge": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubBridge.json",
    "Channel": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubChannel.json",
    "Edifice": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubEdifice.json",
    "Masonry": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubMasonry.json",
    "Road": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubRoad.json",
    "Signpost": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubSignpost.json",
    "Structure": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubStructure.json",
    "Tombstone": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubTombstone.json",
    "Wall": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubWall.json",
    "Works": "assets/terrain/terrainFeatures/ruins/ruinsSub/remnantsSubWorks.json"
  };

  // Mapping for ruins-specific sub-types
export const ruinsSubMap = {
  "Castle": "assets/terrain/terrainFeatures/ruins/ruinsSub/ruinsSubCastle.json",
  "Citadel": "assets/terrain/terrainFeatures/ruins/ruinsSub/ruinsSubCitadel.json",
  "City": "assets/terrain/terrainFeatures/ruins/ruinsSub/ruinsSubCity.json",
  "Manor": "assets/terrain/terrainFeatures/ruins/ruinsSub/ruinsSubManor.json",
  "Temple": "assets/terrain/terrainFeatures/ruins/ruinsSub/ruinsSubTemple.json",
  "Village": "assets/terrain/terrainFeatures/ruins/ruinsSub/ruinsSubVillage.json",
};

  // Mapping for skeletons-specific sub-types
export const skeletonsSubMap = {
  "Colossal Skeleton": "assets/terrain/terrainFeatures/ruins/ruinsSub/skeletonsSubColossal.json",
  "Giant Skeleton": "assets/terrain/terrainFeatures/ruins/ruinsSub/skeletonsSubGiant.json",
  "Man-Sized Skeleton": "assets/terrain/terrainFeatures/ruins/ruinsSub/skeletonsSubManSized.json",
  "Skull": "assets/terrain/terrainFeatures/ruins/ruinsSub/skeletonsSubSkulls.json",
  "Small Skeleton": "assets/terrain/terrainFeatures/ruins/ruinsSub/skeletonsSubSmall.json",
  "Unusual Skeleton": "assets/terrain/terrainFeatures/ruins/ruinsSub/skeletonsSubUnusual.json",
};

// Mapping for vestiges-specific sub-types
export const vestigesSubMap = {
  "Fountain": "assets/terrain/terrainFeatures/ruins/ruinsSub/vestigesSubFountain.json",
  "Monolith": "assets/terrain/terrainFeatures/ruins/ruinsSub/vestigesSubMonolith.json",
  "Mound": "assets/terrain/terrainFeatures/ruins/ruinsSub/vestigesSubMound.json",
  "Pyramid": "assets/terrain/terrainFeatures/ruins/ruinsSub/vestigesSubPyramid.json",
  "Sewers": "assets/terrain/terrainFeatures/ruins/ruinsSub/vestigesSubSewers.json",
  "Totem": "assets/terrain/terrainFeatures/ruins/ruinsSub/vestigesSubTotem.json",
};

export const wrecksSubMap = {
  "Air Vehicle": "assets/terrain/terrainFeatures/ruins/ruinsSub/wrecksSubAirVehicle.json",
  "Land Vehicle": "assets/terrain/terrainFeatures/ruins/ruinsSub/wrecksSubLandVehicle.json",
  "Sea Vehicle": "assets/terrain/terrainFeatures/ruins/ruinsSub/wrecksSubSeaVehicle.json",
  "Submarine": "assets/terrain/terrainFeatures/ruins/ruinsSub/wrecksSubSubmarine.json",
  "Subterranean Vehicle": "assets/terrain/terrainFeatures/ruins/ruinsSub/wrecksSubSubterraneanVehicle.json",
  "War Engine": "assets/terrain/terrainFeatures/ruins/ruinsSub/wrecksSubWarEngine.json",
};

// Mapping for antiques-specific sub-types
export const antiquesSubMap = {
  "Engravings": "assets/terrain/terrainFeatures/relics/relicsSub/antiquesSubEngravings.json",
  "Fittings": "assets/terrain/terrainFeatures/relics/relicsSub/antiquesSubFittings.json",
  "Furniture": "assets/terrain/terrainFeatures/relics/relicsSub/antiquesSubFurniture.json",
  "Handicrafts": "assets/terrain/terrainFeatures/relics/relicsSub/antiquesSubHandicrafts.json",
  "Idols": "assets/terrain/terrainFeatures/relics/relicsSub/antiquesSubIdols.json",
  "Statues": "assets/terrain/terrainFeatures/relics/relicsSub/antiquesSubStatues.json",
};

// Mapping for artifacts-specific sub-types
export const artifactsSubMap = {
  "Entertainment Device": "assets/terrain/terrainFeatures/relics/relicsSub/artifactsSubEntertainmentDevice.json",
  "Informative Device": "assets/terrain/terrainFeatures/relics/relicsSub/artifactsSubInformativeDevice.json",
  "Leadership Device": "assets/terrain/terrainFeatures/relics/relicsSub/artifactsSubLeadershipDevice.json",
  "Offensive Device": "assets/terrain/terrainFeatures/relics/relicsSub/artifactsSubOffensiveDevice.json",
  "Protective Device": "assets/terrain/terrainFeatures/relics/relicsSub/artifactsSubProtectiveDevice.json",
  "Weapon": "assets/terrain/terrainFeatures/relics/relicsSub/artifactsSubWeapon.json",
};

// Mapping for refuse-specific sub-types
export const refuseSubMap = {
  "Condition of Discards": "assets/terrain/terrainFeatures/relics/relicsSub/refuseConditionOfDiscards.json",
  "Discards": "assets/terrain/terrainFeatures/relics/relicsSub/refuseSubDiscards.json",
  "Food": "assets/terrain/terrainFeatures/relics/relicsSub/refuseSubFood.json",
  "Fuel": "assets/terrain/terrainFeatures/relics/relicsSub/refuseSubFuel.json",
  "Offal": "assets/terrain/terrainFeatures/relics/relicsSub/refuseSubOffal.json",
  "Parts": "assets/terrain/terrainFeatures/relics/relicsSub/refuseSubParts.json",
  "Sewage": "assets/terrain/terrainFeatures/relics/relicsSub/refuseSubSewage.json",
};

export const relicsSubMap = {
  "Armor": "assets/terrain/terrainFeatures/relics/relicsSub/relicsSubArmor.json",
  "Tomes": "assets/terrain/terrainFeatures/relics/relicsSub/relicsSubTomes.json",
  "Containers": "assets/terrain/terrainFeatures/relics/relicsSub/relicsSubContainers.json",
  "Machines": "assets/terrain/terrainFeatures/relics/relicsSub/relicsSubMachines.json",
  "Tools": "assets/terrain/terrainFeatures/relics/relicsSub/relicsSubTools.json",
  "Weapons": "assets/terrain/terrainFeatures/relics/relicsSub/relicsSubWeapons.json",
};

export const remainsSubMap = {
  "Apparel": "assets/terrain/terrainFeatures/relics/relicsSub/remainsSubApparel.json",
  "Harness": "assets/terrain/terrainFeatures/relics/relicsSub/remainsSubHarness.json",
  "Optics": "assets/terrain/terrainFeatures/relics/relicsSub/remainsSubOptics.json",
  "Tome Contents": "assets/terrain/terrainFeatures/relics/relicsSub/remainsSubTomeContents.json",
  "Tomes": "assets/terrain/terrainFeatures/relics/relicsSub/remainsSubTomes.json",
  "Toys": "assets/terrain/terrainFeatures/relics/relicsSub/remainsSubToys.json",
  "Utensils": "assets/terrain/terrainFeatures/relics/relicsSub/remainsSubUtensils.json",
};

export const dungeonsSubMap = {
  "Passage Size": "assets/terrain/terrainFeatures/lairs/lairsSub/dungeonSubPassageSize.json",
};

export const caveSubEntranceMap = "assets/terrain/terrainFeatures/lairs/lairsSub/caveSubEntranceType.json";

export const burrowSubMap = {
  "Anthill": "assets/terrain/terrainFeatures/lairs/lairsSub/burrowSubTypeAnthill.json",
  "Civilized Burrow": "assets/terrain/terrainFeatures/lairs/lairsSub/burrowSubTypeCivilizedBurrow.json",
  "Glow Worm Cave": "assets/terrain/terrainFeatures/lairs/lairsSub/burrowSubTypeGlowWormCave.json",
  "Hive": "assets/terrain/terrainFeatures/lairs/lairsSub/burrowSubTypeHive.json",
  "Large Burrow": "assets/terrain/terrainFeatures/lairs/lairsSub/burrowSubTypeLargeBurrow.json",
  "Tunnel Hive": "assets/terrain/terrainFeatures/lairs/lairsSub/burrowSubTypeTunnelHive.json",
  "Very Large Burrow": "assets/terrain/terrainFeatures/lairs/lairsSub/burrowSubTypeVeryLargeBurrow.json",
  "Worm Tunnel": "assets/terrain/terrainFeatures/lairs/lairsSub/burrowSubTypeWormTunnel.json",
};

export const campSubCurrentStatusMap = {
  "Current Status": "assets/terrain/terrainFeatures/lairs/lairsSub/campSubCurrentStatus.json"
};

export const campSubDefencesMap = {
  "Defences": "assets/terrain/terrainFeatures/lairs/lairsSub/campSubDefences.json"
};

export const campSubFightingForceMap = {
  "Fighting Force": "assets/terrain/terrainFeatures/lairs/lairsSub/campSubFightingForce.json"
};

export const campSubLeaderTypesMap = {
  "Leader Types": "assets/terrain/terrainFeatures/lairs/lairsSub/campSubLeaderTypes.json"
};

export const dwellingEncountersMap = {
  "Dwelling Encounters": "assets/terrain/terrainFeatures/lairs/lairsSub/dwellingEncounters.json"
};

export const shipwreckSubCargoMap = {
  "Shipwreck Cargo": "assets/terrain/terrainFeatures/lairs/lairsSub/shipwreckSubCargo.json"
};

export const shipwreckSubContentsMap = {
  "Shipwreck Contents": "assets/terrain/terrainFeatures/lairs/lairsSub/shipwreckSubContents.json"
};

export const creviceSubMap = {
  "Crevice": "assets/terrain/terrainFeatures/lairs/lairsSub/creviceSubTable.json"
};

