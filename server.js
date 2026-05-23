import express from 'express';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = Number(process.env.PORT || 3000);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const collections = {
  recipes: 'recipes',
  pantry: 'pantry_items',
  customCategories: 'custom_categories',
  shopping: 'shopping_items',
  wishes: 'wishes',
  channels: 'channels',
  diary: 'diary_entries',
};

app.use(express.json({ limit: '5mb' }));

async function initDb() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      for (const table of Object.values(collections)) {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ${table} (
            item_id text PRIMARY KEY,
            data jsonb NOT NULL,
            position integer NOT NULL DEFAULT 0,
            updated_at timestamptz NOT NULL DEFAULT now()
          )
        `);
      }
      return;
    } catch (err) {
      if (attempt === 30) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

function tableFor(name) {
  const table = collections[name];
  if (!table) {
    const err = new Error(`Unknown collection: ${name}`);
    err.status = 404;
    throw err;
  }
  return table;
}

function rowsToPayload(name, rows) {
  if (name === 'diary') {
    return Object.fromEntries(rows.map(row => [row.item_id, row.data]));
  }
  return rows.map(row => row.data);
}

function payloadToRows(name, payload) {
  if (name === 'diary') {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw Object.assign(new Error('Diary payload must be an object.'), { status: 400 });
    }
    return Object.entries(payload).map(([key, value], index) => ({
      itemId: key,
      data: value,
      position: index,
    }));
  }

  if (!Array.isArray(payload)) {
    throw Object.assign(new Error('Collection payload must be an array.'), { status: 400 });
  }
  return payload.map((item, index) => ({
    itemId: String(item?.id ?? index),
    data: item,
    position: index,
  }));
}

async function readCollection(name) {
  const table = tableFor(name);
  const result = await pool.query(`SELECT item_id, data FROM ${table} ORDER BY position, item_id`);
  return rowsToPayload(name, result.rows);
}

async function replaceCollection(name, payload) {
  const table = tableFor(name);
  const rows = payloadToRows(name, payload);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM ${table}`);
    for (const row of rows) {
      await client.query(
        `INSERT INTO ${table} (item_id, data, position, updated_at)
         VALUES ($1, $2, $3, now())`,
        [row.itemId, row.data, row.position],
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.get('/api/bootstrap', async (_req, res, next) => {
  try {
    const data = {};
    for (const name of Object.keys(collections)) {
      data[name] = await readCollection(name);
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/:collection', async (req, res, next) => {
  try {
    res.json(await readCollection(req.params.collection));
  } catch (err) {
    next(err);
  }
});

app.put('/api/:collection', async (req, res, next) => {
  try {
    await replaceCollection(req.params.collection, req.body);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get(['/', '/index.html'], (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('*', (_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Internal server error.' });
});

await initDb();
app.listen(port, () => {
  console.log(`my-kitchen listening on ${port}`);
});
