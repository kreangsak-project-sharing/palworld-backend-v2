import { config } from "dotenv";
config();

import expess, { Application, Request, Response } from "express";
import {
  addSelectPolicy,
  enableRowLevelSecurity,
  enableSupabaseRealtime,
  exposedSchemas,
} from "./prisma/config";

import {
  updateMetrics,
  updatePlayerOnline,
  updateSystemInfo,
} from "./components/supabaseDB";

import { logsRecord } from "./components/supabaseLogs";

const app: Application = expess();

app.use(expess.json());

const PORT = process.env.NODE_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);

  logsRecord();

  //
  // First config
  // enableRowLevelSecurity();
  // addSelectPolicy();
  // enableSupabaseRealtime();
  // exposedSchemas();
});

//
// Function realtime updated
const intervalId = setInterval(async () => {
  try {
    await updateSystemInfo();
    await updateMetrics();
    await updatePlayerOnline();
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      throw new Error("Error updating Supabase");
    }
  }
}, 5000);

process.on("SIGINT", () => {
  clearInterval(intervalId);
  console.log("Interval Stopped");
  process.exit();
});
