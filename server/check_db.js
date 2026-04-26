import sequelize from "./models/index.js";

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.query('ALTER TABLE "menu_items" ALTER COLUMN "original_full_price" DROP NOT NULL;');
    console.log("Migration applied successfully: original_full_price DROP NOT NULL.");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    process.exit(0);
  }
}
run();
