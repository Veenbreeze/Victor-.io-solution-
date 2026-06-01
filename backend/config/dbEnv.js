function parseDatabaseUrl(value) {
  if (!value) return {};

  try {
    const url = new URL(value);
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace('/', '')
    };
  } catch {
    return {};
  }
}

export function getDatabaseConfig() {
  const urlConfig = parseDatabaseUrl(process.env.DB_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL);

  return {
    host: process.env.DB_HOST || process.env.MYSQLHOST || urlConfig.host,
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || urlConfig.port || 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQLUSE || urlConfig.user,
    password:
      process.env.DB_PASSWORD ||
      process.env.MYSQLPASSWORD ||
      process.env.MYSQL_ROOT_PASSWORD ||
      urlConfig.password,
    database:
      process.env.DB_NAME ||
      process.env.MYSQLDATABASE ||
      process.env.MYSQL_DATABASE ||
      urlConfig.database
  };
}
