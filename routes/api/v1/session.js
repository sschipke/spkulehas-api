import {
  forbiddenResponse,
  unknownErrorResponse,
} from "../../../utils/httpHelpers";
import { resetTokenValidationLimiter } from "../../../middleware/rate-limits";
import { validateRequestToken } from "../../../middleware/auth";

import { checkSession, RESET_TYPE } from "../../../repoCalls/sessionRepoCalls";

const express = require("express");
const router = express.Router();
router.use(validateRequestToken);

router.get(
  "/reset/validate",
  resetTokenValidationLimiter,
  async (request, res) => {
    const { user, tokenType, sessionId } = res.locals;
    if (tokenType !== "email") {
      console.error("Attempt to reset password with non-email token.");
      return forbiddenResponse(res);
    }
    try {
      const { isValid, message } = await checkSession(
        sessionId,
        RESET_TYPE,
        user.id
      );
      if (!isValid) {
        return forbiddenResponse(res, message);
      } else {
        return res.status(200).json(true);
      }
    } catch (error) {
      console.error("Validate session.", error);
      return unknownErrorResponse(res, "Unable to validate session.");
    }
  }
);

export default router;
