async function palworldAPI(url: string) {
  const username = process.env.NODE_RCON_USER;
  const password = process.env.NODE_RCON_PASSWORD;

  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(`${process.env.NODE_PALWORLD_APIURL}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      //   body: JSON.stringify({ message: messages }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch API: ${response.statusText}`);
    }

    const data = response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

/**
 * Fetches player information from the REST API.
 * @returns Player information data.
 */
export async function getServerPlayersOnline() {
  try {
    const response = await palworldAPI("players");
    return response.players;
  } catch (error) {
    throw new Error(error?.toString());
  }
}

/**
 * Fetches server metrics from the REST API.
 * @returns Server metrics data.
 */
export async function getServerMestrics() {
  try {
    const response = await palworldAPI("metrics");
    return response;
  } catch (error) {
    throw new Error(error?.toString());
  }
}
