import ActivityLog from "../models/activityLog.model.js";

const createActivityLog = async (
  tableId,
  devieName = "android",
  itemClicked = [],
  duration = null
) => {
  try {
    const result = await ActivityLog.create({
      tableId,
      devieName: devieName,
      itemClicked: itemClicked.length > 0 ? itemClicked : null,
      duration: duration ? duration : null,
    });

      
    
  } catch (error) {
    console.log("something happened while creating a log ", error);
    throw new Error("Failed to create activity log: " + error.message);
  }
};

export { createActivityLog };
