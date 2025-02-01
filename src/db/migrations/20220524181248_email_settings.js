exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("email_setting", function (table) {
      table.increments("id").primary();
      table.string("user_id").notNull();
      table.foreign("user_id").references("user.id");
      table
        .enu(
          "setting_name",
          [
            "reservation_deleted",
            "reservation_shortened",
            "reservation_reminder"
          ],
          30
        )
        .notNull();
      table.boolean("value").default(false);
      table.timestamps(true, true);
    }),
    knex.schema.createTable("session", function (table) {
      table.increments("pk").primary();
      table.string("id").unique().notNull();
      table.string("user_id").notNull();
      table.foreign("user_id").references("user.id");
      table.enu("type", ["password_reset", "refresh"], 30).notNull();
      table.timestamp("expires", { useTz: true }).notNull();
      table.boolean("valid").default(true);
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("email_setting"),
    knex.schema.dropTable("session")
  ]);
};
