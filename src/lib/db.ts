// lib/db.js
import mysql, { RowDataPacket } from "mysql2/promise";
import { ResultSetHeader } from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 100,
});

const queryOne = async <T extends RowDataPacket = any>(
  sql: string,
  params?: any[]
): Promise<T | null> => {
  const [rows] = await pool.execute<T[]>(sql, params);
  return rows[0] || null;
};

const queryList = async <T extends RowDataPacket = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> => {
  const [rows] = await pool.execute<T[]>(sql, params);
  return rows;
};

const insertOne = async (sql: string, params: any[]): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result.insertId;
};

const updateOne = async (sql: string, params: any[]) => {
  await pool.execute<ResultSetHeader>(sql, params);
};

export { pool, queryOne, queryList, insertOne, updateOne };
