import { query } from '../config/database';
import fs from 'fs';
import path from 'path';

const runMigrations = async () => {
    try {
        const createTablesSql = fs.readFileSync(path.join(__dirname, 'create_tables.sql'), 'utf8');
        await query(createTablesSql);
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
};

runMigrations();