import { Sequelize } from "sequelize";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const caCertificate = fs.readFileSync("./dbcert.pem").toString();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	port: 5432,
	dialect: "postgres",
	dialectOptions: {
		ssl: {
			ca: caCertificate,
		},
	},
});

const testDbConnection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connected to db!");
	}
	catch (error) {
		console.error("Unable to connect", error);
	}
};

testDbConnection();

export default sequelize;