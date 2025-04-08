// lib/saveUserInfo.js
import { getUserProfile } from "./lineApiHelpers.js";
import { writeUserDataToSupabase } from "./writeUserDataToSupabase.js";

export async function saveUserProfileAndWrite(userId, groupId, ACCESS_TOKEN, inputData = null) {
  const safeGroupId = groupId || "default";
  console.log("📥 ユーザーデータ保存開始:", { userId, safeGroupId });

  try {
    const profile = await getUserProfile(userId, ACCESS_TOKEN);
    console.log("📥 取得したプロフィール:", profile);

    if (!profile) {
      throw new Error("プロフィール情報の取得に失敗しました（profile is null）");
    }

    const displayName = profile?.displayName || null;
    const pictureUrl = profile?.pictureUrl || null;
    const statusMessage = profile?.statusMessage || null;
    const shopName = null;

    await writeUserDataToSupabase({
      groupId: safeGroupId,
      userId,
      displayName,
      pictureUrl,
      statusMessage,
      shopName,
      inputData
    });

    console.log("✅ Supabase にプロフィール情報を書き込み完了");

  } catch (error) {
    console.error("❌ プロフィールの取得または書き込みに失敗:", error);
  }
}