# palworld-backend-v2

## Nodejs
```
// Install pnpm
npm install -g pnpm
// updated pnpm to latest version
npx pnpm i -g pnpm@latest
```
```
pnpm init
pnpm add -D typescript ts-node
pnpm exec tsc --init

pnpm add dotenv express nodemon
pnpm add -D @types/express
```
## package.json
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npx tsc",
    "start": "node ./dist/index.js",
    "dev": "nodemon index.ts"
  },
```

## tsconfig.json
```
"rootDir": "./"
"allowJs": true
"outDir": "./dist"
```

## Prisma
```
pnpm add @prisma/client
pnpm add -D prisma
pnpx prisma init
pnpx prisma migrate dev
pnpx prisma migrate reset
pnpx prisma generate

pnpx prisma init --datasource-provider sqlite
pnpx prisma migrate dev --name init
pnpx prisma migrate dev --create-only

```

## Reset id & data for supabase
```
TRUNCATE TABLE realtime_systeminfo RESTART IDENTITY;
```

## Clear logs in docker in linux
```
sudo sh -c "truncate -s 0 /var/lib/docker/containers/**/*-json.log"
sudo systemctl restart docker
```

# Using Custom Schemas for supabase
```
GRANT USAGE ON SCHEMA myschema TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA myschema TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA myschema TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA myschema TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA myschema GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA myschema GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA myschema GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
```
# Initialize the Supabase JS client
```
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { db: { schema: 'myschema' } })
```
# Make a request
```
const { data: todos, error } = await supabase.from('todos').select('*')
```
