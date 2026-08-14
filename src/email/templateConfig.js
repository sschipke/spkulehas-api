import path from "path";
import config from "config";
import { create as createHandlebarsEngine } from "express-handlebars";

export const getTemplatePath = () =>
  path.resolve(config.get("emailTemplatePath"));

export const brandContext = () => {
  const baseUrl = config.get("frontEndBaseUrl");
  const siteUrl = baseUrl.replace(/\/$/, "");

  return {
    siteName: "SpKuLeHaS Inc",
    siteUrl,
    contactEmail: "spkulehas@gmail.com",
    logoUrl: config.get("emailLogoUrl"),
    primaryColor: "#33691e",
    headerColor: config.get("emailHeaderColor"),
    year: new Date().getFullYear()
  };
};

export const createEmailContext = (
  context,
  { useLayout = false, pageTitle, preheader } = {}
) => ({
  ...brandContext(),
  ...context,
  ...(pageTitle ? { pageTitle } : {}),
  ...(preheader ? { preheader } : {}),
  ...(useLayout ? { layout: "main" } : {})
});

export const handlebarHelpers = {
  concat(...args) {
    args.pop();
    return args.join("");
  }
};

export const createHandlebarOptions = (templatePath = getTemplatePath()) => ({
  viewEngine: {
    layoutsDir: path.join(templatePath, "layouts"),
    partialsDir: path.join(templatePath, "partials"),
    defaultLayout: false,
    helpers: handlebarHelpers
  },
  viewPath: templatePath
});

export const createEmailRenderer = (templatePath = getTemplatePath()) => {
  const engine = createHandlebarsEngine({
    layoutsDir: path.join(templatePath, "layouts"),
    partialsDir: path.join(templatePath, "partials"),
    defaultLayout: false,
    extname: ".handlebars",
    helpers: handlebarHelpers
  });

  return (templateName, context) =>
    engine.renderView(
      path.join(templatePath, `${templateName}.handlebars`),
      context
    );
};
