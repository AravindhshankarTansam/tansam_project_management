import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { initDatabase } from './utils/db.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
    await initDatabase();

    // 🔥 AUTO-CREATE FIRST ADMIN (no folder changes)
    await createFirstAdminUser();

    app.use('/', routes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`\n🚀 Server: http://localhost:${PORT}`);
        console.log(`📊 Test: http://localhost:${PORT}/api/users`);
        console.log(`👤 Login: admin@tansam.com / admin123`);
    });
}

async function createFirstAdminUser() {
    try {
        // Connect directly to DB
        const adminConn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'root',
            database: process.env.DB_NAME || 'tansam_project',
        });

        // Check if admin exists
        const [existing] = await adminConn.execute('SELECT id FROM users WHERE username = ?', ['admin']);

        if (existing.length === 0) {
            console.log('👤 Creating first admin user...');

            const hashedPassword = await bcrypt.hash('admin123', 12);
            await adminConn.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@tansam.com', hashedPassword, 'CEO / MD']
            );

            console.log('✅ Admin created: admin@tansam.com / admin123');
        } else {
            console.log('✅ Admin already exists');
        }

        await adminConn.end();
    } catch (error) {
        console.log('⚠️ Admin setup skipped:', error.message);
    }
}

startServer();
