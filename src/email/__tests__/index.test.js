jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(() => ({
      use: jest.fn(),
      sendMail: jest.fn()
    }))
  }
}));

jest.mock("nodemailer-express-handlebars", () => ({
  __esModule: true,
  default: jest.fn(() => ({}))
}));

import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar.js";
import nodemailer from "nodemailer";

dayjs.extend(calendar);
import {
  sendPasswordResetEmail,
  alertUsersOfDeletion,
  sendSessionDeletionEmail,
  sendSessionDeletionErrorEmail,
  notifyAdminOfDeletedReservations
} from "../index.js";

const getMockSendMail = () =>
  nodemailer.createTransport.mock.results[0].value.sendMail;

describe("email", () => {
  beforeEach(() => {
    process.env.ADMIN_EMAIL = "admin@test.local";
    process.env.ADMIN_EMAIL_PASSWORD = "password";
    getMockSendMail().mockReset();
  });

  it("sendPasswordResetEmail calls transporter.sendMail", async () => {
    getMockSendMail().mockResolvedValue({ messageId: "1" });
    const user = { email: "member@test.local", name: "Test User" };

    await sendPasswordResetEmail(user, "https://example.com/reset", "tomorrow");

    expect(getMockSendMail()).toHaveBeenCalledWith(
      expect.objectContaining({
        to: user.email,
        template: "password-reset",
        subject: "Password Reset"
      })
    );
  });

  it("alertUsersOfDeletion includes reservation context", async () => {
    getMockSendMail().mockResolvedValue({ messageId: "2" });
    const reservation = {
      start: "2027-06-01T12:00:00.000Z",
      end: "2027-06-03T12:00:00.000Z",
      title: "Trip"
    };

    await alertUsersOfDeletion("a@test.local,b@test.local", reservation);

    expect(getMockSendMail()).toHaveBeenCalledWith(
      expect.objectContaining({
        template: "reservation-deleted",
        context: expect.objectContaining({ title: "Trip" })
      })
    );
  });

  it("sendSessionDeletionEmail resolves on success", async () => {
    getMockSendMail().mockImplementation((opts, cb) =>
      cb(null, { messageId: "3" })
    );

    await expect(sendSessionDeletionEmail(2)).resolves.toBe(true);
    expect(getMockSendMail()).toHaveBeenCalledWith(
      expect.objectContaining({ template: "session-deletion-count" }),
      expect.any(Function)
    );
  });

  it("sendSessionDeletionEmail rejects on failure", async () => {
    getMockSendMail().mockImplementation((opts, cb) =>
      cb(new Error("smtp failed"), null)
    );

    await expect(sendSessionDeletionEmail(1)).rejects.toBeTruthy();
  });

  it("sendSessionDeletionErrorEmail sends error notification", async () => {
    getMockSendMail().mockResolvedValue({ messageId: "4" });

    await sendSessionDeletionErrorEmail(new Error("db down"));

    expect(getMockSendMail()).toHaveBeenCalledWith(
      expect.objectContaining({
        template: "session-deletion-error",
        subject: expect.stringContaining("ERROR")
      })
    );
  });

  it("notifyAdminOfDeletedReservations sends bulk delete template", async () => {
    getMockSendMail().mockResolvedValue({ messageId: "5" });
    const deleted = [{ id: 1, title: "Old trip" }];

    await notifyAdminOfDeletedReservations(deleted);

    expect(getMockSendMail()).toHaveBeenCalledWith(
      expect.objectContaining({
        template: "bulk-reservations-delete",
        context: expect.objectContaining({ numberOfReservations: 1 })
      })
    );
  });
});
