import "dotenv/config";
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("All env vars with DATABASE:", Object.keys(process.env).filter(k => k.includes("DATABASE")));