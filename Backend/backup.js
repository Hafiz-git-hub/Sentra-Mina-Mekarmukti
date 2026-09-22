require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

async function backupDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB terhubung!");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const backupDir = path.join(__dirname, "backup");
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(backupDir, `backup-${timestamp}`);
    fs.mkdirSync(backupPath);

    for (const col of collections) {
      const data = await db.collection(col.name).find({}).toArray();
      fs.writeFileSync(
        path.join(backupPath, `${col.name}.json`),
        JSON.stringify(data, null, 2)
      );
      console.log(`📝 ${col.name}: ${data.length} dokumen`);
    }

    console.log(`\n🎉 Backup selesai: ${backupPath}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal backup:", err.message);
    process.exit(1);
  }
}

backupDatabase();