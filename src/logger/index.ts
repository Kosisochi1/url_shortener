import winston from "winston";
 export const logger = winston.createLogger({
	format: winston.format.json(),
	// transports: [],
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'logs' }),
		new winston.transports.Http({
			level: 'warn',
			format: winston.format.json(),
		}),
	],
});
