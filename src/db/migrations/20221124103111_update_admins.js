export async function up(knex) {
  await Promise.all([
    knex.schema.alterTable("userprofile", (table) => {
      table.boolean("isadmin").default(false);
    }),
    knex("userprofile").where({ status: "ADMIN" }).update({ isadmin: true })
  ]);
}

export async function down(knex) {
  await Promise.all([
    knex.schema.alterTable("userprofile", (table) => {
      table.dropColumn("isadmin");
    })
  ]);
}
