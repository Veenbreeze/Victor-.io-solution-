function parseDatabaseUrl(value) {
  if (!value) return {};

  try {
    const url = new URL(value);
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace('/', '')
    };
  } catch {
    return {};
  }
}

export function getDatabaseConfig() {
  const urlConfig = parseDatabaseUrl(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.DB_URL
  );

  return {
    host: process.env.DB_HOST || process.env.PGHOST || urlConfig.host,
    port: Number(process.env.DB_PORT || process.env.PGPORT || urlConfig.port || 5432),
    user: process.env.DB_USER || process.env.PGUSER || urlConfig.user,
    password:
      process.env.DB_PASSWORD ||
      process.env.PGPASSWORD ||
      urlConfig.password,
    database:
      process.env.DB_NAME ||
      process.env.PGDATABASE ||
      urlConfig.database
  };
}
