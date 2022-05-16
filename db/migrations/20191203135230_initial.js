exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("user", function (table) {
      table.increments("pk").primary();
      table.string("id").unique().notNull();
      table.string("email").unique().notNull();
      table.string("password").notNull();
      table.timestamps(true, true);
    }),

    knex.schema.createTable("reservation", function (table) {
      table.increments("id").primary();
      table.string("user_id").notNull();
      table.foreign("user_id").references("user.id");
      table.string("title", 60);
      table.timestamp("start", { useTz: true }).notNull();
      table.timestamp("end", { useTz: true }).notNull();
      table.string("notes", 60);
      table.timestamps(true, true);
    }),

    knex.schema.createTable("userprofile", function (table) {
      table.increments("id").primary();
      table.string("user_id").notNull();
      table.foreign("user_id").references("user.id");
      table.string("name");
      table.enu("status", ["D2", "D1", "S2", "S1", "U", "ADMIN"]).notNull();
      table.string("street");
      table.string("city");
      table.string("state", 2);
      table.string("zipcode", 5);
      table.string("phone", 12);
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("reservation"),
    knex.schema.dropTable("userprofile"),
    knex.schema.dropTable("user"),
  ]);
};
