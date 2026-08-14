import { createEmailContext, createEmailRenderer } from "../templateConfig.js";

const renderTemplate = createEmailRenderer();

const templateFixtures = {
  welcome: createEmailContext(
    {
      user: {
        email: "member@test.local",
        password: "TempPass123!",
        profile: { name: "Test User" }
      },
      loginUrl: "https://spkulehas.com/login"
    },
    {
      useLayout: true,
      pageTitle: "Welcome to SpKuLeHaS",
      preheader: "Your SpKuLeHaS account is ready."
    }
  ),
  "password-reset": createEmailContext(
    {
      user: { email: "member@test.local" },
      url: "https://spkulehas.com/reset-password?token=test",
      expiration: "tomorrow at 5:00 PM"
    },
    {
      useLayout: true,
      pageTitle: "Password Reset",
      preheader: "Reset your SpKuLeHaS password."
    }
  ),
  "new-member": createEmailContext(
    {
      user: {
        name: "Test User",
        firstName: "Test",
        email: "member@test.local"
      },
      loginUrl: "https://spkulehas.com/login",
      createUrl: "https://spkulehas.com/create-password?token=test",
      expiration: "tomorrow at 5:00 PM"
    },
    {
      useLayout: true,
      pageTitle: "Welcome to SpKuLeHaS",
      preheader: "Create your password to get started with SpKuLeHaS."
    }
  ),
  "email-change-alert": createEmailContext(
    {
      oldEmail: "old@test.local",
      newEmail: "member@test.local",
      admin: { name: "Admin User", isAdmin: true },
      wasAdmin: true
    },
    {
      useLayout: true,
      pageTitle: "Email Change Notice",
      preheader: "Your SpKuLeHaS account email address was updated."
    }
  ),
  "status-change-alert": createEmailContext(
    {
      oldProfile: { name: "Test User", status: "G1" },
      newProfile: {
        name: "Test User",
        status: "S1",
        email: "member@test.local"
      },
      admin: { name: "Admin User" },
      isShareholder: true
    },
    {
      useLayout: true,
      pageTitle: "Status Change",
      preheader: "Your SpKuLeHaS member status was updated."
    }
  ),
  "profile-change-notification": createEmailContext(
    {
      newProfile: {
        name: "Test User",
        street: "123 Cabin Lane",
        city: "Denver",
        state: "CO",
        zipcode: "80202",
        phone: "555-0100",
        email: "member@test.local"
      },
      admin: { name: "Admin User" },
      loginUrl: "https://spkulehas.com/login"
    },
    {
      useLayout: true,
      pageTitle: "Profile Updated",
      preheader: "Your SpKuLeHaS profile information was updated."
    }
  ),
  "reservation-change": createEmailContext(
    {
      previousMember: { name: "Test User", email: "member@test.local" },
      currentMember: { name: "Other User", email: "other@test.local" },
      oldReservation: { start: "06/01/2027", end: "06/05/2027" },
      newReservation: { start: "06/02/2027", end: "06/06/2027" },
      viewReservationUrl: "https://spkulehas.com?reservationId=1",
      admin: { name: "Admin User", email: "admin@test.local" }
    },
    {
      useLayout: true,
      pageTitle: "Reservation Change",
      preheader: "A SpKuLeHaS reservation has been updated."
    }
  ),
  "reservation-created": createEmailContext(
    {
      currentMember: { name: "Test User" },
      reservation: { start: "06/01/2027", end: "06/05/2027" },
      viewReservationUrl: "https://spkulehas.com?reservationId=1"
    },
    {
      useLayout: true,
      pageTitle: "Reservation Created",
      preheader: "A new SpKuLeHaS reservation was created."
    }
  ),
  "reservation-deleted": createEmailContext(
    {
      title: "Summer Trip",
      startDate: "Friday, June 1, 2027",
      endDate: "Tuesday, June 5, 2027",
      url: "https://spkulehas.com?date=2027-06-01T12:00:00.000Z"
    },
    {
      useLayout: true,
      pageTitle: "Reservation Canceled",
      preheader: "A SpKuLeHaS reservation has been canceled."
    }
  ),
  "new-member-alert": createEmailContext(
    {
      user: { name: "Test User", email: "member@test.local" },
      admin: { name: "Admin User", email: "admin@test.local" },
      date: "8/14/2026, 1:00:00 PM"
    },
    {
      useLayout: true,
      pageTitle: "New Member Created",
      preheader: "A new SpKuLeHaS member account was created."
    }
  ),
  "bulk-reservations-delete": createEmailContext(
    {
      deletedReservations: [
        {
          id: 1,
          title: "Old Trip",
          start: "01/01/2024",
          end: "01/05/2024"
        }
      ],
      numberOfReservations: 1,
      date: "Today at 1:00 PM",
      environment: "test"
    },
    {
      useLayout: true,
      pageTitle: "Bulk Reservation Deletion",
      preheader: "Past SpKuLeHaS reservations were deleted."
    }
  ),
  "session-deletion-count": createEmailContext(
    {
      count: 2,
      isSingular: false,
      date: "Today at 1:00 AM",
      environment: "test"
    },
    {
      useLayout: true,
      pageTitle: "Session Deletion",
      preheader: "Expired sessions were deleted from SpKuLeHaS."
    }
  ),
  "session-deletion-error": createEmailContext(
    {
      date: "Friday, August 14, 2026, 1:00 AM",
      environment: "test",
      errorMessage: "db down"
    },
    {
      useLayout: true,
      pageTitle: "Session Deletion Error",
      preheader: "An error occurred during SpKuLeHaS session cleanup."
    }
  )
};

describe("email templates", () => {
  it.each(Object.entries(templateFixtures))(
    "renders %s with the shared layout",
    async (templateName, context) => {
      const html = await renderTemplate(templateName, context);

      expect(html).toContain("SpKuLeHaS Inc");
      expect(html).toContain("#33691e");
      expect(html).toContain("#880e4f");
      expect(html).toContain("spkulehas@gmail.com");
      expect(html).toContain('class="email-heading"');
    }
  );
});
