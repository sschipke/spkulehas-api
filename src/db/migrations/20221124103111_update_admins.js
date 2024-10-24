exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable("userprofile", (table) => {
      table.boolean("isadmin").default(false);
    }),
    knex("userprofile").where({ status: "ADMIN" }).update({ isadmin: true })
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable("userprofile", (table) => {
      table.dropColumn("isadmin");
    })
  ]);
};
