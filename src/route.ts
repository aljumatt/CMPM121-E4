import { ShmupPrefabSprite } from "./prefab.ts";
import type { GameScene } from "./game.ts";

export interface WaveConfig {
  time: number;
  kind: string;
  count: number;
  position?: number;
  formation: "line" | "vee" | "column" | "pincer";
  spacing?: number;
  interval?: number;
}

export interface SectorConfig {
  name: string;
  subtitle: string;
  minTicks: number;
  maxTicks: number;
  waves: WaveConfig[];
}

function getEnemyConfig(kind: string) {
  switch (kind) {
    case "drone":
      return {
        hp: 2,
        score: 100,
        speed: 13,
        dropChance: 0.015,
        floating: true,
      };
    case "dart":
      return {
        hp: 1,
        score: 150,
        speed: 12,
        dropChance: 0.015,
        floating: false,
      };
    case "turret":
      return { hp: 12, score: 400, speed: 19, dropChance: 0.3, floating: true };
    case "lancer":
      return { hp: 4, score: 250, speed: 15, dropChance: 0.06, floating: true };
    default:
      return {
        hp: 2,
        score: 100,
        speed: 13,
        dropChance: 0.015,
        floating: true,
      };
  }
}

export function spawnWave(scene: GameScene, t: number, wave: WaveConfig): void {
  const {
    time,
    kind,
    count,
    position = 240,
    formation,
    spacing = 64,
    interval = 10,
  } = wave;
  const config = getEnemyConfig(kind);

  for (let i = 0; i < count; i++) {
    let spawnTime = time;
    let x = position;
    let y = -30;

    if (formation === "line") {
      spawnTime = time;
      const center = (count - 1) / 2;
      x = position + (i - center) * spacing;
    } else if (formation === "vee") {
      const center = (count - 1) / 2;
      spawnTime = time + Math.abs(i - center) * interval;
      x = position + (i - center) * 44;
    } else if (formation === "column") {
      spawnTime = time + i * interval;
      x = position;
    } else if (formation === "pincer") {
      const row = Math.floor(i / 2);
      spawnTime = time + row * interval;
      x = i % 2 === 0 ? -30 : 510;
      y = 70 + row * 50;
    }

    if (t === spawnTime) {
      const enemy = new ShmupPrefabSprite(
        scene,
        x,
        y,
        kind,
        config.hp,
        config.score,
        config.speed,
        config.dropChance,
        config.floating,
        false,
        x,
        i % 2 === 0 ? 1 : -1,
      );
      scene.enemies.push(enemy);
    }
  }
}

export const SECTORS: SectorConfig[] = [
  {
    name: "Outer Drift",
    subtitle: "Scouts ahead",
    minTicks: 1560,
    maxTicks: 1800,
    waves: [
      {
        time: 60,
        kind: "drone",
        count: 4,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 360,
        kind: "drone",
        count: 5,
        position: 168,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
      {
        time: 660,
        kind: "drone",
        count: 5,
        position: 312,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
      {
        time: 960,
        kind: "drone",
        count: 6,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 1200,
        kind: "drone",
        count: 4,
        position: 120,
        formation: "column",
        interval: 24,
      },
      {
        time: 1260,
        kind: "drone",
        count: 4,
        position: 360,
        formation: "column",
        interval: 24,
      },
    ],
  },
  {
    name: "Shatter Belt",
    subtitle: "Divers incoming",
    minTicks: 1800,
    maxTicks: 2040,
    waves: [
      {
        time: 60,
        kind: "drone",
        count: 6,
        position: 240,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
      {
        time: 300,
        kind: "dart",
        count: 4,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 600,
        kind: "dart",
        count: 5,
        position: 144,
        formation: "column",
        interval: 24,
      },
      {
        time: 720,
        kind: "dart",
        count: 5,
        position: 336,
        formation: "column",
        interval: 24,
      },
      {
        time: 1020,
        kind: "drone",
        count: 7,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 1140,
        kind: "dart",
        count: 5,
        position: 240,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
      {
        time: 1440,
        kind: "dart",
        count: 6,
        position: 240,
        formation: "line",
        spacing: 64,
      },
    ],
  },
  {
    name: "Gun Lanes",
    subtitle: "Turrets online",
    minTicks: 1920,
    maxTicks: 2160,
    waves: [
      {
        time: 60,
        kind: "turret",
        count: 1,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 240,
        kind: "drone",
        count: 6,
        position: 240,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
      {
        time: 540,
        kind: "turret",
        count: 2,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 840,
        kind: "dart",
        count: 6,
        position: 240,
        formation: "column",
        interval: 24,
      },
      {
        time: 1080,
        kind: "turret",
        count: 2,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 1140,
        kind: "drone",
        count: 6,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 1500,
        kind: "turret",
        count: 3,
        position: 240,
        formation: "line",
        spacing: 64,
      },
    ],
  },
  {
    name: "Lancer Gate",
    subtitle: "Crossfire",
    minTicks: 1920,
    maxTicks: 2160,
    waves: [
      { time: 60, kind: "lancer", count: 4, formation: "pincer", interval: 30 },
      {
        time: 360,
        kind: "dart",
        count: 6,
        position: 240,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
      {
        time: 600,
        kind: "lancer",
        count: 6,
        formation: "pincer",
        interval: 30,
      },
      {
        time: 780,
        kind: "turret",
        count: 2,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 1140,
        kind: "lancer",
        count: 6,
        formation: "pincer",
        interval: 30,
      },
      {
        time: 1260,
        kind: "drone",
        count: 8,
        position: 240,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
      {
        time: 1560,
        kind: "dart",
        count: 8,
        position: 240,
        formation: "line",
        spacing: 64,
      },
    ],
  },
  {
    name: "Last Approach",
    subtitle: "Everything they have",
    minTicks: 2040,
    maxTicks: 2280,
    waves: [
      {
        time: 60,
        kind: "turret",
        count: 3,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 180,
        kind: "lancer",
        count: 6,
        formation: "pincer",
        interval: 30,
      },
      {
        time: 540,
        kind: "dart",
        count: 6,
        position: 120,
        formation: "column",
        interval: 24,
      },
      {
        time: 540,
        kind: "dart",
        count: 6,
        position: 360,
        formation: "column",
        interval: 24,
      },
      {
        time: 900,
        kind: "drone",
        count: 9,
        position: 240,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
      {
        time: 1020,
        kind: "turret",
        count: 2,
        position: 240,
        formation: "line",
        spacing: 64,
      },
      {
        time: 1320,
        kind: "lancer",
        count: 8,
        formation: "pincer",
        interval: 30,
      },
      {
        time: 1560,
        kind: "dart",
        count: 8,
        position: 240,
        formation: "vee",
        spacing: 44,
        interval: 10,
      },
    ],
  },
];
