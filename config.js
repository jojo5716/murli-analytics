module.exports =  {
    dbPath: process.env.MONGO_URL || "mongodb://localhost/murli-analytics2",
    redisPath: process.env.REDIS_URL || "redis://localhost:6379",
    port: 8000
}
