import pino from "pino";
import { isColorSupported } from "colorette";

const isDevMode = process.env.NODE_ENV !== "production";

const logger = pino(
  isDevMode
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: isColorSupported,
          },
        },
        timestamp() {
          // must start with a comma (,) and must be valid json
          return `,"timestamp": "${new Date()
            .toLocaleString("en-IN")
            .toUpperCase()}, ${Date.now()}"`;
        },
      }
    : undefined,
);

export default logger;
