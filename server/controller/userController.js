import sql from "../config/db.js";

// ✅ 1. Get creations of the logged-in user
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    if (!userId)
      return res.json({ success: false, message: "User not authenticated" });

    const creations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    console.error("Get User Creations Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ 2. Get only published creations (for Community)
export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations 
      WHERE publish = true
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    console.error("Get Published Creations Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ 3. Toggle Like / Unlike (Fixed for Neon)
export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    if (!userId)
      return res.json({ success: false, message: "User not authenticated" });
    if (!id)
      return res.json({ success: false, message: "Creation ID is missing" });

    // ✅ Fetch the creation
    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id};
    `;

    if (!creation)
      return res.json({ success: false, message: "Creation not found" });

    // ✅ Likes logic
    const currentLikes = creation.likes || [];
    const userIdStr = String(userId);
    let updatedLikes = [];
    let message = "";

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((uid) => uid !== userIdStr);
      message = "❌Creation disliked successfully";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "❤️Creation liked successfully";
    }

    // ✅ Convert array to PostgreSQL text[] format safely
    const likesArrayLiteral = `{${updatedLikes.join(",")}}`;

    await sql`
      UPDATE creations
      SET likes = ${likesArrayLiteral}::text[]
      WHERE id = ${id};
    `;

    res.json({
      success: true,
      message,
      likesCount: updatedLikes.length,
      updatedLikes,
    });
  } catch (error) {
    console.error("Toggle Like Error:", error);
    res.json({ success: false, message: error.message });
  }
};
