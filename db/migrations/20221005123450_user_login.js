exports.up = function (knex) {
  Promise.all([
    knex.schema.alterTable("user", (table) => {
      table.timestamp("last_login", { useTz: true });
    }),
    knex.schema.alterTable("userprofile", (table) => {
      table.string("first_name", 100);
      table.string("last_name", 100);
    })
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable("user", (table) => {
      table.dropColumn("last_login");
    }),
    knex.schema.alterTable("userprofile", (table) => {
      table.dropColumn("first_name");
      table.dropColumn("last_name");
    })
  ]);
};
