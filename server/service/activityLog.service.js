import ActivityLog from "../models/activityLog.model.js";

const createActivityLog = async (
  tableId,
  devieName = "android",
  itemClicked = [],
  duration = null
) => {
    console.log("Creating activity log with data: ", {
      tableId,
      devieName,
      itemClicked,
      duration,
    });
    
  try {
    const result = await ActivityLog.create({
      tableId,
      devieName: devieName,
      itemClicked: itemClicked.length > 0 ? itemClicked : null,
      duration: duration ? duration : null,
    });

      
    console.log("activity log result : ", result);
  } catch (error) {
    console.log("something happened while creating a log ", error);
  }
};

export { createActivityLog };
