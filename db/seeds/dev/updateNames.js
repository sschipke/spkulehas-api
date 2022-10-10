const updateName = async (knex, first_name, last_name, userId) => {
  console.log({ first_name }, { last_name });
  return knex("userprofile")
    .where({ user_id: userId })
    .update({ first_name, last_name })
    .catch((error) => {
      console.error("Error updating name: ", error);
    });
};

exports.seed = function (knex) {
  return knex("userprofile")
    .columns(["name", "user_id"])
    .then((profiles) => {
      const profilePromises = [];
      profiles.forEach((profile) => {
        [firstName, lastName] = profile.name.split(" ");
        const userId = profile.user_id;
        profilePromises.push(updateName(knex, firstName, lastName, userId));
      });
      return Promise.all(profilePromises);
    })
    .catch((err) => {
      throw new Error("Error populating names.", err);
    });
};
