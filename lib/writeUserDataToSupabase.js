
// ✅ 外部公開：ユーザーデータをSupabaseに書き込む
import { supabase } from "./supabaseClient.js";

// ✅ 日本時間のタイムスタンプ（先頭0なしのH形式）
function getFormattedJST() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000); // JSTに変換

  const yyyy = jst.getFullYear();
  const mm = String(jst.getMonth() + 1).padStart(2, '0');
  const dd = String(jst.getDate()).padStart(2, '0');
  const h = jst.getHours(); // ← 先頭ゼロなし
  const mi = String(jst.getMinutes()).padStart(2, '0');
  const ss = String(jst.getSeconds()).padStart(2, '0');

  return `${yyyy}/${mm}/${dd} ${h}:${mi}:${ss}`;
}

// ✅ ユーザーデータをSupabaseに書き込む関数
export async function writeUserDataToSupabase(groupId, userId, displayName, pictureUrl, statusMessage) {
 try {
  const timestamp = getFormattedJST();
  const safeGroupId = groupId || "default"; // null のときは "default"
  
   console.log("📦 書き込み準備:", { groupId, userId, displayName });

  
  const { data, error } = await supabase
    .from("users")
    .upsert([
      {
        timestamp,      // ← フォーマット済の日本時間
        groupId: safeGroupId,
        userId,
        displayName,
        pictureUrl,
        statusMessage
      }
    ], {
      onConflict: ['groupId', 'userId']
    });

    if (error) {
      console.error("❌ Supabase書き込みエラー:", error);
    }

    if (data) {
      console.log("✅ Supabaseに保存されました:", data);
    }

  } catch (err) {
    console.error("💥 例外でクラッシュしました:", err);
  }
}
