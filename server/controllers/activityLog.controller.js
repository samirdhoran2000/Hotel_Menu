// server/controllers/activityLog.controller.js
import { Op, fn, col } from "sequelize";
import ActivityLog from "../models/activityLog.model.js";
import Table from "../models/table.model.js";
import MenuItem from "../models/menuItem.model.js";

export const getActivitySummaryByHotel = async (req, res) => {
  try {
    const hotelId = req.user.id;

    // 1) compute time windows
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // 2) fetch raw logs for last 7 days (with table info)
    const logs = await ActivityLog.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      include: [
        {
          model: Table,
          attributes: ["id", "tableNumber"],
          where: { hotelId },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 3) find top table in that window
    const topTable = await ActivityLog.findAll({
      attributes: [
        "tableId",
        [fn("COUNT", col("ActivityLog.id")), "count"], // ← fully qualify the PK
      ],
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      include: [
        {
          model: Table,
          attributes: ["tableNumber"],
          where: { hotelId },
        },
      ],
      group: ["ActivityLog.tableId", "Table.id", "Table.tableNumber"], // ← qualify here too
      order: [[fn("COUNT", col("ActivityLog.id")), "DESC"]],
      limit: 1,
      raw: true,
      nest: true,
    });

    // 4) count how many were created today
    const todayCount = await ActivityLog.count({
      where: { createdAt: { [Op.gte]: todayStart } },
      include: [
        {
          model: Table,
          where: { hotelId },
        },
      ],
    });

    const [totalMenus, activeMenus] = await Promise.all([
      MenuItem.count({
        where: { hotelId },
      }),
      MenuItem.count({
        where: {
          hotelId,
          available: true,
        },
      }),
    ]);

    const [totalTables, activeTables] = await Promise.all([
      Table.count({
        where: { hotelId },
      }),
      Table.count({
        where: {
          hotelId,
          active: true,
        },
      }),
    ]);

    return res.json({
      success: true,
      data: logs,
      analytics: {
        topTable,
        todayCount,
        menus: { totalMenus, activeMenus },
        tables: {
          totalTables,
          activeTables,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
