// ✅ 外部公開：ユーザーデータをSupabaseに書き込む
import { supabase } from "./supabaseClient.js";
import { usersTable } from "./env.js";

// ✅ 日本時間のタイムスタンプ（先頭0なしのH形式）
function getFormattedJST() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getFullYear();
  const mm = String(jst.getMonth() + 1).padStart(2, '0');
  const dd = String(jst.getDate()).padStart(2, '0');
  const h = jst.getHours();
  const mi = String(jst.getMinutes()).padStart(2, '0');
  const ss = String(jst.getSeconds()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${h}:${mi}:${ss}`;
}

// ✅ 修正済み：オブジェクト形式で引数を受け取り、データベースに書き込む
export async function writeUserDataToSupabase({
  groupId,
  userId,
  displayName,
  pictureUrl,
  statusMessage,
  shopName,
  inputData
}) {
  try {
    const timestamp = getFormattedJST();
    const safeGroupId = groupId || "default";

    const userData = {
      timestamp,
      groupId: safeGroupId,
      userId,
      displayName,
      pictureUrl,
      statusMessage,
      shopName,
      inputData
    };

    console.log("📦 書き込みデータ:", userData);

    const { data, error } = await supabase
      .from(usersTable)
      .upsert([userData], {
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
