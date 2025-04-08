import { createLogger, format, transports } from "winston"

export const logger = createLogger({
  level: 'debug', 													// debug => 5
  // format: format.json(),
  format: format.combine(
		// format.timestamp(),
		format.colorize(),
		format.simple()
	),
  transports: [
		new transports.Console(),
		// new transports.File({ filename: 'logs/app.log' })
	],
})





