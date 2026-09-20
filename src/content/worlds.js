export const WORLDS = [
  { id: 'W1',  name: 'Table Tunnel',       icon: '🚇', range: [1, 10],   mode: 'guided',      tier: 1, timer: null },
  { id: 'W2',  name: 'Constant Cove',      icon: '🏝️', range: [11, 20],  mode: 'guided',      tier: 1, timer: null },
  { id: 'W3',  name: 'Graph Galaxy',       icon: '🌌', range: [21, 30],  mode: 'independent', tier: 2, timer: null },
  { id: 'W4',  name: 'Unit Valley',        icon: '🏔️', range: [31, 40],  mode: 'independent', tier: 2, timer: null },
  { id: 'W5',  name: 'Flip Factory',       icon: '🏭', range: [41, 50],  mode: 'independent', tier: 2, timer: null },
  { id: 'W6',  name: 'Mirror Bay',         icon: '🪞', range: [51, 60],  mode: 'independent', tier: 3, timer: null },
  { id: 'W7',  name: 'Worker Workshop',    icon: '🛠️', range: [61, 70],  mode: 'independent', tier: 3, timer: null },
  { id: 'W8',  name: 'Speed Station',      icon: '🚄', range: [71, 80],  mode: 'timed',       tier: 3, timer: 45 },
  { id: 'W9',  name: 'Detective District', icon: '🕵️', range: [81, 90],  mode: 'timed',       tier: 4, timer: 40 },
  { id: 'W10', name: 'Proportion Peak',    icon: '🏆', range: [91, 100], mode: 'boss',        tier: 4, timer: 60 },
];

export const WORLD_SLOTS = {
  W1:  ['QT01','QT01','QT01','QT02','QT02','QT02','QT03','QT03','QT04','QT04'],
  W2:  ['QT05','QT05','QT05','QT06','QT06','QT06','QT07','QT07','QT08','QT08'],
  W3:  ['QT09','QT09','QT09','QT10','QT10','QT10','QT11','QT11','QT12','QT12'],
  W4:  ['QT13','QT13','QT13','QT14','QT14','QT15','QT15','QT16','QT16','QT17'],
  W5:  ['QT18','QT18','QT18','QT19','QT19','QT19','QT20','QT20','QT21','QT21'],
  W6:  ['QT22','QT22','QT22','QT23','QT23','QT24','QT24','QT24','QT25','QT25'],
  W7:  ['QT26','QT26','QT26','QT26','QT27','QT27','QT27','QT28','QT28','QT29'],
  W8:  ['QT30','QT30','QT30','QT30','QT31','QT31','QT32','QT32','QT33','QT33'],
  W9:  ['QT34','QT34','QT34','QT34','QT35','QT35','QT36','QT36','QT37','QT37'],
  W10: ['QT38','QT38','QT38','QT39','QT39','QT39','QT40','QT40','QT41','QT41'],
};

// Numeric-entry slots in Boss World (slots 94, 97, 99, 100 -> index 3, 6, 8, 9 in W10)
export const BOSS_NUMERIC_INDICES = new Set([3, 6, 8, 9]);
