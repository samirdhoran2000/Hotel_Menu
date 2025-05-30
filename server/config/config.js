export const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "0.0.0.0",
  sslKeyPath: process.env.SSL_KEY_PATH || "localhost.key",
  sslCertPath: process.env.SSL_CERT_PATH || "localhost.crt",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "location_tracker",
    port: process.env.DB_PORT || 3307,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

// export default config;