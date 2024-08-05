import os from "os";
import si from "systeminformation";

import { getServerMestrics, getServerPlayersOnline } from "./palworldAPI";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//
// Random
function imageRandom() {
  // Generate a random number between 1 and 111
  const randomNumber = Math.floor(Math.random() * 111) + 1;

  const addpadStart =
    randomNumber < 100
      ? randomNumber.toString().padStart(3, "0")
      : randomNumber.toString();

  // Concatenate ".png" to the binary string
  const randomImageName = addpadStart + ".png";

  return randomImageName;
}

//
// getRamUsageinPrecen
const ramUseinPrecen = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  // Calculating RAM usage
  const usedMemory = totalMemory - freeMemory;
  const ramUsagePercentage = (usedMemory / totalMemory) * 100;
  return ramUsagePercentage.toFixed(0);
};

//
// updateSystemInfo
export async function updateSystemInfo() {
  try {
    const cpuTemp = await si.cpuTemperature();
    const cpuUsage = await si.currentLoad();
    const memInfo = await si.mem();

    const updatedData = {
      cpu_temp: Number(cpuTemp?.max || 0),
      cpu_use: Number(cpuUsage?.currentLoad.toFixed(0)),
      ram_use: Number(ramUseinPrecen()),
      swap_use: Number(
        ((memInfo?.swapused / memInfo?.swaptotal) * 100).toFixed(0)
      ),
    };

    await prisma.realtime_systeminfo.upsert({
      where: { id: 1 },
      update: updatedData,
      create: { id: 1, ...updatedData },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      throw new Error("Error updating system info");
    }
  }
}

//
// updateMetrics
export async function updateMetrics() {
  try {
    const dataAPI = await getServerMestrics();
    // console.log(dataAPI);

    await prisma.realtime_metrics.upsert({
      where: { id: 1 },
      update: dataAPI,
      create: { id: 1, ...dataAPI },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      throw new Error("Error updating metrics");
    }
  }
}

//
// updatePlayerOnline

type PlayerAPIType = {
  name: string;
  playerId: string;
  userId: string;
  ip: string;
  ping: number;
  location_x: number;
  location_y: number;
  level: number;
};

type PlayerDataType = {
  name: string;
  playerId: string;
  userId: string;
  ip: string;
  ping: number;
  location_x: number;
  location_y: number;
  level: number;
  logintime: Date;
  imagename: string;
};

interface PlayerFromDB {
  id: number;
  created_at: Date;
  player_data: PlayerDataType[] | [];
}

let players: number;
export async function updatePlayerOnline() {
  try {
    const dataAPI: PlayerAPIType[] = await getServerPlayersOnline();

    // console.log(players);

    if (dataAPI.length === players) {
      return;
    }

    if (players === undefined) {
      await prisma.realtime_playersonline.upsert({
        where: { id: 1 },
        update: { player_data: [] },
        create: { id: 1, player_data: [] },
      });
      // console.log("players: undefined");
      players = dataAPI.length;
      return;
    }

    if (dataAPI.length > 0 && dataAPI[dataAPI.length - 1].playerId === "None") {
      return;
    }

    const playersData = (await prisma.realtime_playersonline.findFirst({
      where: { id: 1 },
    })) as PlayerFromDB;

    const updatePlayersData = dataAPI.map((player) => ({
      name: player.name,
      playerId: player.playerId,
      userId: player.userId,
      ip: player.ip,
      ping: player.ping,
      location_x: player.location_x,
      location_y: player.location_y,
      level: player.level,
      logintime: new Date(),
      imagename: imageRandom(),
    }));

    if (dataAPI.length > playersData.player_data.length) {
      const comparePlayersData = updatePlayersData.filter((obj) => {
        return !playersData.player_data.some((o) => o.userId === obj.userId);
      });

      for (const player of comparePlayersData) {
        await prisma.realtime_loginrecord.create({
          data: {
            name: player.name,
            playerId: player.playerId,
            userId: player.userId,
            ip: player.ip,
            ping: player.ping,
            location_x: player.location_x,
            location_y: player.location_y,
            level: player.level,
          },
        });
      }

      // Merge existing player data with new data
      const mergedPlayerData = [
        ...playersData.player_data,
        comparePlayersData[0],
      ];

      await prisma.realtime_playersonline.update({
        where: { id: 1 },
        data: { player_data: mergedPlayerData },
      });
    } else if (dataAPI?.length < playersData?.player_data.length) {
      const logoutPlayerData = playersData.player_data.filter((obj) => {
        return updatePlayersData.some((o) => o.userId === obj.userId);
      });

      await prisma.realtime_playersonline.update({
        where: { id: 1 },
        data: { player_data: logoutPlayerData },
      });
    }

    players = dataAPI.length;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      throw new Error("Error updating players data");
    }
  }
}
