export const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "0.0.0.0",
  sslKeyPath: process.env.SSL_KEY_PATH || "localhost.key",
  sslCertPath: process.env.SSL_CERT_PATH || "localhost.crt",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  domain:process.env.DOMAIN,
  db: {
    url: process.env.DATABASE_URL, // Used by Supabase and standard Postgres setups
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hotel_menu",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: process.env.DATABASE_URL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  },
};

// export default config;