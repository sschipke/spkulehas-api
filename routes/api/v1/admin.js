import { logger } from "../../../utils/logging";
import { validateUserProfile } from "../../../validations/userValidation";
import { allowOnlyAdmin, validateRequestToken } from "../../../middleware/auth";
import { addMemberRateLimiter } from "../../../middleware/rate-limits";
import {
  getUserProfileById,
  findAllEmailSettingsByUserId,
  getUserProfilesDetailView,
  addNewUser,
  mapUserToProfile
} from "../../../repoCalls/userRepoCalls";
import {
  notFoundResponse,
  unauthorizedResponse,
} from "../../../utils/httpHelpers";
import {
  createIdsForNewMember,
  handleNewUserCreationEmails,
  confirmPassword
} from "../../../utils/helpers";

const express = require("express");
const router = express.Router();
router.use(validateRequestToken);
router.use(allowOnlyAdmin);

router.get("/select/:userId", async (req, res) => {
  const { userId } = req.params;

  const selectedUser = await getUserProfileById(userId);
  const emailSettings = await findAllEmailSettingsByUserId(userId);
  //TODO: For now there should only be one email setting for deletion emails
  //Once we support more, we can remove the index here
  if (!selectedUser) {
    return notFoundResponse(res, `Unable to find user with id: ${userId}`);
  }
  const responseBody = {
    selectedMember: selectedUser,
    selectedMemberEmailSettings: emailSettings.length ? emailSettings[0] : null
  };
  console.log({ selectedUser });
  logger("Successfully got user for admin: ", req);
  return res.status(200).json(responseBody);
});

router.get("/member_details", async (req, res) => {
  try {
    const memberDetails = await getUserProfilesDetailView();
    logger("Successfully sent member details to admin.", req);
    return res.status(200).json({ memberDetails });
  } catch (error) {
    console.error("ERROR getting member details for admin.", error);
    return res.status(500).json({ error: "Unable to get member details." });
  }
});

router.post("/add_member", addMemberRateLimiter, async (req, res) => {
  const { user, password } = req.body;
  const admin = res.locals.user;
  const isConfirmedPassword = await confirmPassword(admin.id, password);
  if (!isConfirmedPassword) {
    return unauthorizedResponse(res);
  }
  createIdsForNewMember(user);
  const profile = mapUserToProfile(user)
  user.profile = profile;
  const errors = validateUserProfile(profile, user.email);
  if (Object.keys(errors).length) {
    return res.status(400).json(errors)
  }
  try {
    console.log("Adding user: ", user);
    await addNewUser(user);
    const newlyCreatedMember = await getUserProfileById(user.id);
    console.log({ newlyCreatedMember });
    await handleNewUserCreationEmails(newlyCreatedMember, admin);
    res.status(200).json({ newMember: newlyCreatedMember }).send();
  } catch (error) {
    console.error("Unable to add member: ", error);
    const { message } = error;
    if (message && message === "Email already exists.") {
      return res.status(409).json({ error: "This email is already in use." });
    }
    return res.status(500).send();
  }
});

export default router;
