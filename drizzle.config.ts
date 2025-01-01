import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/sources/db/schema/",
	schemaFilter: ['transaction'],
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
});

