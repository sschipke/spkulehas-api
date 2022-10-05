exports.up = function (knex) {
  return knex.schema.alterTable("user", (table) => {
    table.timestamp("last_login", { useTz: true });
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("user", (table) => {
    table.dropColumn("last_login");
  });
};
