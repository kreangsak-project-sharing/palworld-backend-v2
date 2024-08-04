import Docker from "dockerode";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const RECONNECT_DELAY = 5000; // 5 seconds

// Game Chat
export async function logsRecord() {
  const docker = new Docker({ socketPath: "/var/run/docker.sock" });
  const containerId = "palworld-server"; // Replace with your container ID or name

  const startLogStream = async () => {
    try {
      const container = docker.getContainer(containerId);
      const logStream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
        tail: 100, // Optional: Tail the last 100 lines
      });

      logStream.on("data", async (chunk: Buffer) => {
        const lines = chunk.toString("utf-8").trim().split("\n");
        for (const line of lines) {
          if (line.includes("[CHAT]")) {
            console.log(line);

            // Extract the chat message
            const chatRegex = /\[CHAT\]\s*<([^>]+)>\s*(.*)/;
            const match = line.match(chatRegex);

            if (match) {
              const playerName = match[1];
              const message = match[2];

              // Transform the chat message format
              let chatMessage = `${playerName}: ${message}`;

              // Sanitize the chat message
              chatMessage = chatMessage
                .replace(/\u0000/g, "") // Remove null characters
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
                .trim(); // Remove leading/trailing whitespace

              try {
                await prisma.realtime_logsrecord.create({
                  data: { logs_data: chatMessage },
                });
              } catch (error) {
                if (error instanceof Error) {
                  throw error.message;
                } else {
                  throw new Error("Insert DB error");
                }
              }

              //   try {
              //     const { data, error } = await supabase
              //       .from("realtime_logsrecord")
              //       .insert({ text: chatMessage })
              //       .select();

              //     if (error) {
              //       console.error("Error inserting log:", error);
              //     }
              //   } catch (insertError) {
              //     console.error("Error inserting log:", insertError);
              //   }
            } else {
              console.log("No chat message found in line");
            }
          }
        }
      });

      logStream.on("end", () => {
        console.log("Log stream ended. Attempting to reconnect...");
        setTimeout(startLogStream, RECONNECT_DELAY);
      });

      logStream.on("error", (err: Error) => {
        console.error("Log stream error:", err);
        console.log("Attempting to reconnect...");
        setTimeout(startLogStream, RECONNECT_DELAY);
      });
    } catch (err) {
      console.error("Error streaming logs:", err);
      console.log("Attempting to reconnect...");
      setTimeout(startLogStream, RECONNECT_DELAY);
    }
  };

  // Start the initial log stream
  startLogStream();
}
