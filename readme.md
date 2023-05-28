# <center>Scout Bot</center>

<center>A well-tested and secure bot for Discord server monitoring, economy and misc operations</center>

<br />

### Environment Variables

Copy [.env.example](./.env.example) file to a new `.env` file and then fill up the required info.

### Install

```bash
pnpm install
```

### Run in dev mode

```bash
pnpm dev
```

### Run in production

```bash
pnpm start
```

### Deploy Commands to Discord

```bash
NODE_ENV=production pnpm deploy:commands
```

### Run Tests

```bash
pnpm test
```

### Code Lint

```bash
pnpm lint
```

### Code Format

```bash
pnpm format
```

### DB Migration

Check or Edit Database Source: [src/db/data_source.ts](src/db/data_source.ts)

Run Migrations:

```bash
npm run migrate
```
