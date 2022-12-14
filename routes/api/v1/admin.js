import { logger } from "../../../utils/logging";
import {
  validateUserProfile,
  canUserUpdate,
  validateEmail,
  canUpdateStatusOrPrivileges,
  validatePassword,
  validateEmailSetting,
  isAdmin,
  determineNameChange
} from "../../../validations/userValidation";
import {
  loginLimiter,
  passwordResetLimiter
} from "../../../middleware/rate-limits";
import { allowOnlyAdmin, validateRequestToken } from "../../../middleware/auth";

import {
  getUserProfileById,
  findAllEmailSettingsByUserId,
  getUserProfilesDetailView
} from "../../../repoCalls/userRepoCalls";
import {
  forbiddenResponse,
  notFoundResponse
} from "../../../utils/httpHelpers";

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

export default router;
