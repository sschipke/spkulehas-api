import "@babel/polyfill";
import app from "./app";

app.set("port", process.env.PORT || 8080);
app.set("hostname", process.env.HOSTNAME || "localhost");

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on ${app.get("hostname")}:${app.get(
      "port"
    )}`
  );
});
