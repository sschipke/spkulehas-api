/**
 * Shared helpers for dev reservation season seeds (2025 / 2026).
 */

async function resolveUserIdForTitle(knex, title) {
  const rows = await knex("userprofile")
    .whereLike("name", `%${title}`)
    .select("user_id", "name");

  if (rows && rows.length > 0) {
    return rows[0].user_id;
  }

  const admin = await knex("userprofile")
    .where({ status: "ADMIN" })
    .orWhere({ isadmin: true })
    .select("user_id")
    .first();

  if (!admin) {
    throw new Error(
      `No userprofile match for reservation title "${title}" and no ADMIN profile found. Run 00_base_users seed first.`
    );
  }

  console.warn(
    `[reservation seed] No profile match for "${title}"; assigning to admin user_id=${admin.user_id}`
  );
  return admin.user_id;
}

module.exports = { resolveUserIdForTitle };
