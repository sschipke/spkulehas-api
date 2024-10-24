import "@babel/polyfill";
import app from "./app";

app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
  console.log(`${app.locals.title} is running on localhost:${app.get("port")}`);
});
