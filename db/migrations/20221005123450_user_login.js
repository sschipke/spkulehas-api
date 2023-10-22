const updateName = async (knex, first_name, last_name, userId) => {
  console.log({ first_name }, { last_name }, { userId });
  return knex("userprofile")
    .where({ user_id: userId })
    .update({ first_name, last_name })
    .catch((error) => {
      console.error("Error updating name: ", error);
    });
};

exports.up = function (knex) {
  Promise.all([
    knex.schema.alterTable("user", (table) => {
      table.timestamp("last_login", { useTz: true });
    }),
    knex.schema.alterTable("userprofile", (table) => {
      table.string("first_name", 100);
      table.string("last_name", 100);
    }),
    knex("userprofile")
      .columns(["name", "user_id"])
      .then((profiles) => {
        const profilePromises = [];
        profiles.forEach((profile) => {
          const [firstName, lastName] = profile.name.split(" ");
          const userId = profile.user_id;
          profilePromises.push(updateName(knex, firstName, lastName, userId));
        });
        return Promise.all(profilePromises);
      })
      .catch((err) => {
        throw new Error("Error populating names.", err);
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
