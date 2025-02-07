import pg from "pg";

export const db = new pg.Client({

    user: 'avnadmin',        
    host: 'al-projects-villegasalrandolph-2846.l.aivencloud.com',
    database: 'defaultdb',
    password: 'AVNS_JgjDu2yklwLe2qnOdaq',
    port: 13192,
    ssl: {
        rejectUnauthorized: false,
    }
});