module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://username@localhost/dbname',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || true,
}
  