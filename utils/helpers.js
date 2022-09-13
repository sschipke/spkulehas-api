
export const canUserEdit = (user, reservation) => {
  if (user.status === "ADMIN") {
    return true;
  }
  return user.id === reservation.user_id;
};

