-- CreateTable
CREATE TABLE "realtime_loginrecord" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "ping" INTEGER,
    "location_x" INTEGER NOT NULL,
    "location_y" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "realtime_loginrecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realtime_metrics" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptime" INTEGER NOT NULL,
    "serverfps" INTEGER NOT NULL,
    "maxplayernum" INTEGER NOT NULL,
    "serverframetime" INTEGER NOT NULL,
    "currentplayernum" INTEGER NOT NULL,

    CONSTRAINT "realtime_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realtime_playersonline" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "player_data" JSONB NOT NULL,

    CONSTRAINT "realtime_playersonline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realtime_systeminfo" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpu_temp" INTEGER NOT NULL,
    "cpu_use" INTEGER NOT NULL,
    "ram_use" INTEGER NOT NULL,
    "swap_use" INTEGER NOT NULL,

    CONSTRAINT "realtime_systeminfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realtime_logsrecord" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logs_data" TEXT NOT NULL,

    CONSTRAINT "realtime_logsrecord_pkey" PRIMARY KEY ("id")
);
