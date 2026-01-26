import { User } from "../user/user.model";

const getTopBuyers = async () => {
  const topBuyers = await User.aggregate([
    // Step 1: Only customers
    { $match: { role: "customer" } },

    // Step 2: Join with orders
    {
      $lookup: {
        from: "orders", 
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },

    // Step 3: Calculate totalOrder and totalSpent
    {
      $addFields: {
        totalOrder: { $size: "$orders" },
        totalSpent: { $sum: "$orders.totalPrice" },
      },
    },

    // Step 4: Only include required fields
    {
      $project: {
        firstName: 1,
        lastName: 1,
        totalOrder: 1,
        totalSpent: 1,
      },
    },

    // Step 5: Sort by totalSpent descending
    { $sort: { totalSpent: -1 } },

    // Step 6: Limit to top 5
    { $limit: 5 },
  ]);

  return topBuyers;
};

const reportsService = {
  getTopBuyers,
};

export default reportsService;
