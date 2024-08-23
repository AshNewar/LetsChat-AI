import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    user: process.env.AIVEN_USER,
    password: process.env.AIVEN_PASSWORD,
    host: process.env.AIVEN_HOST,
    port: 10828,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: [fs.readFileSync(path.resolve('database/ca.pem'), 'utf-8')]
    },
};

const pgClient = new pg.Client(config);

pgClient.connect().then(async() => {
        console.log('Connected to the database');
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS store (
            id SERIAL PRIMARY KEY,
            file_name TEXT,
            file_url TEXT
        );
        `;

        await pgClient.query(createTableQuery);
    }).catch((err) => {
        console.error('Failed to connect to the database', err);
    });

export default pgClient;