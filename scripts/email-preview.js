import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  brandContext,
  createEmailContext,
  createEmailRenderer
} from "../src/email/templateConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, "../tmp/email-previews");
const renderTemplate = createEmailRenderer();
const siteUrl = brandContext().siteUrl;

const resolvePreviewLogoUrl = () => {
  const bundledFavicon = path.resolve(
    __dirname,
    "../src/email/assets/favicon.png"
  );
  const siblingFavicon = path.resolve(
    __dirname,
    "../../spkulehas/public/favicon.png"
  );
  const faviconSource = [bundledFavicon, siblingFavicon].find((candidate) =>
    fs.existsSync(candidate)
  );

  if (!faviconSource) {
    return brandContext().logoUrl;
  }

  fs.copyFileSync(faviconSource, path.join(outputDir, "favicon.png"));
  return "./favicon.png";
};

const withPreviewLogo = (context, logoUrl) => ({
  ...context,
  logoUrl
});

const previewTemplates = (logoUrl) => ({
  welcome: withPreviewLogo(
    createEmailContext(
      {
        user: {
          email: "member@example.com",
          password: "TempPass123!",
          profile: { name: "Alex Member" }
        },
        loginUrl: `${siteUrl}/login`
      },
      {
        useLayout: true,
        pageTitle: "Welcome to SpKuLeHaS",
        preheader: "Your SpKuLeHaS account is ready."
      }
    ),
    logoUrl
  ),
  "password-reset": withPreviewLogo(
    createEmailContext(
      {
        user: { email: "member@example.com", name: "Alex Member" },
        url: `${siteUrl}/reset-password?token=preview-token`,
        expiration: "tomorrow at 5:00 PM"
      },
      {
        useLayout: true,
        pageTitle: "Password Reset",
        preheader: "Reset your SpKuLeHaS password."
      }
    ),
    logoUrl
  ),
  "new-member": withPreviewLogo(
    createEmailContext(
      {
        user: {
          name: "Alex Member",
          firstName: "Alex",
          email: "member@example.com"
        },
        loginUrl: `${siteUrl}/login`,
        createUrl: `${siteUrl}/create-password?token=preview-token`,
        expiration: "tomorrow at 5:00 PM"
      },
      {
        useLayout: true,
        pageTitle: "Welcome to SpKuLeHaS",
        preheader: "Create your password to get started with SpKuLeHaS."
      }
    ),
    logoUrl
  ),
  "email-change-alert": withPreviewLogo(
    createEmailContext(
      {
        oldEmail: "old@example.com",
        newEmail: "member@example.com",
        admin: { name: "Admin User", isAdmin: true },
        wasAdmin: true
      },
      {
        useLayout: true,
        pageTitle: "Email Change Notice",
        preheader: "Your SpKuLeHaS account email address was updated."
      }
    ),
    logoUrl
  ),
  "status-change-alert": withPreviewLogo(
    createEmailContext(
      {
        oldProfile: { name: "Alex Member", status: "G1" },
        newProfile: {
          name: "Alex Member",
          status: "S1",
          email: "member@example.com"
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
    logoUrl
  ),
  "profile-change-notification": withPreviewLogo(
    createEmailContext(
      {
        newProfile: {
          name: "Alex Member",
          street: "123 Cabin Lane",
          city: "Denver",
          state: "CO",
          zipcode: "80202",
          phone: "555-0100",
          email: "member@example.com"
        },
        admin: { name: "Admin User" },
        loginUrl: `${siteUrl}/login`
      },
      {
        useLayout: true,
        pageTitle: "Profile Updated",
        preheader: "Your SpKuLeHaS profile information was updated."
      }
    ),
    logoUrl
  ),
  "reservation-change": withPreviewLogo(
    createEmailContext(
      {
        previousMember: { name: "Alex Member", email: "alex@example.com" },
        currentMember: { name: "Jamie Member", email: "jamie@example.com" },
        oldReservation: { start: "06/01/2027", end: "06/05/2027" },
        newReservation: { start: "06/02/2027", end: "06/06/2027" },
        viewReservationUrl: `${siteUrl}?reservationId=42`,
        admin: { name: "Admin User", email: "admin@example.com" }
      },
      {
        useLayout: true,
        pageTitle: "Reservation Change",
        preheader: "A SpKuLeHaS reservation has been updated."
      }
    ),
    logoUrl
  ),
  "reservation-created": withPreviewLogo(
    createEmailContext(
      {
        currentMember: { name: "Alex Member" },
        reservation: { start: "06/01/2027", end: "06/05/2027" },
        viewReservationUrl: `${siteUrl}?reservationId=42`
      },
      {
        useLayout: true,
        pageTitle: "Reservation Created",
        preheader: "A new SpKuLeHaS reservation was created."
      }
    ),
    logoUrl
  ),
  "reservation-deleted": withPreviewLogo(
    createEmailContext(
      {
        title: "Summer Trip",
        startDate: "Friday, June 1, 2027",
        endDate: "Tuesday, June 5, 2027",
        url: `${siteUrl}?date=2027-06-01T12:00:00.000Z`
      },
      {
        useLayout: true,
        pageTitle: "Reservation Canceled",
        preheader: "A SpKuLeHaS reservation has been canceled."
      }
    ),
    logoUrl
  ),
  "new-member-alert": withPreviewLogo(
    createEmailContext(
      {
        user: { name: "Alex Member", email: "member@example.com" },
        admin: { name: "Admin User", email: "admin@example.com" },
        date: new Date().toLocaleString()
      },
      {
        useLayout: true,
        pageTitle: "New Member Created",
        preheader: "A new SpKuLeHaS member account was created."
      }
    ),
    logoUrl
  ),
  "bulk-reservations-delete": withPreviewLogo(
    createEmailContext(
      {
        deletedReservations: [
          {
            id: 1,
            title: "Old Trip",
            start: "01/01/2024",
            end: "01/05/2024",
            notes: "Cleanup"
          }
        ],
        numberOfReservations: 1,
        date: "Today at 1:00 PM",
        environment: "development"
      },
      {
        useLayout: true,
        pageTitle: "Bulk Reservation Deletion",
        preheader: "Past SpKuLeHaS reservations were deleted."
      }
    ),
    logoUrl
  ),
  "session-deletion-count": withPreviewLogo(
    createEmailContext(
      {
        count: 3,
        isSingular: false,
        date: "Today at 1:00 AM",
        environment: "development"
      },
      {
        useLayout: true,
        pageTitle: "Session Deletion",
        preheader: "Expired sessions were deleted from SpKuLeHaS."
      }
    ),
    logoUrl
  ),
  "session-deletion-error": withPreviewLogo(
    createEmailContext(
      {
        date: "Friday, August 14, 2026, 1:00 AM",
        environment: "development",
        errorMessage: "Database connection failed"
      },
      {
        useLayout: true,
        pageTitle: "Session Deletion Error",
        preheader: "An error occurred during SpKuLeHaS session cleanup."
      }
    ),
    logoUrl
  )
});

const main = async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const logoUrl = resolvePreviewLogoUrl();
  const templates = previewTemplates(logoUrl);

  for (const [templateName, context] of Object.entries(templates)) {
    const html = await renderTemplate(templateName, context);
    const outputPath = path.join(outputDir, `${templateName}.html`);

    fs.writeFileSync(outputPath, html, "utf8");
    console.log(`Wrote ${outputPath}`);
  }

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>SpKuLeHaS Email Previews</title>
    <style>
      body { font-family: sans-serif; margin: 24px; }
      ul { line-height: 1.8; columns: 2; }
    </style>
  </head>
  <body>
    <h1>SpKuLeHaS Email Previews</h1>
    <ul>
      ${Object.keys(templates)
        .map((name) => `<li><a href="./${name}.html">${name}</a></li>`)
        .join("\n      ")}
    </ul>
  </body>
</html>
`;

  fs.writeFileSync(path.join(outputDir, "index.html"), indexHtml, "utf8");
  console.log(`Wrote ${path.join(outputDir, "index.html")}`);
  console.log(`Logo source: ${logoUrl}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
