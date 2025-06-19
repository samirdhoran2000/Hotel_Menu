// server/controllers/activityLog.controller.js
import { Op, fn, col } from "sequelize";
import ActivityLog from "../models/activityLog.model.js";
import Table from "../models/table.model.js";

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

    return res.json({
      success: true,
      data: logs,
      analytics: { topTable, todayCount },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
