import "@babel/polyfill";
import request from "supertest";
import app from "./app";
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

describe("Server", () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe("POST /api/v1/login", () => {
    it.skip("should return a 200 and a specific user ", async () => {
      // setup
      const expectedUser = await database("users").first();
      console.log("here ---->", expectedUser);
      const loginInfo = {
        username: "Greg",
        password: "password"
      };

      // execution
      const response = await request(app).post(`/api/v1/login`).send(loginInfo);
      console.log("res --->", response.body);
      const users = await database("users")
        .where("id", response.body.id)
        .select();
      const user = users[0];

      // expectation
      expect(response.status).toBe(200);
      expect(user.username).toEqual(expectedUser.username);
    });

    it('should return a 401 and the message "Username or password incorrect"', async () => {
      const invalidLoginInfo = {
        username: "Greg",
        password: "passwords"
      };

      const response = await request(app)
        .post(`/api/v1/login`)
        .send(invalidLoginInfo);

      expect(response.status).toBe(401);
      expect(response.body.error).toEqual("Username or password incorrect");
    });
  });

  describe("POST /api/v1/signup", () => {
    it("should return a 201 and a specific username and id", async () => {
      // setup
      const newUser = {
        username: "Pol",
        password: "password"
      };

      // execution
      const response = await request(app).post(`/api/v1/signup`).send(newUser);
      const users = await database("users")
        .where("id", response.body.id)
        .select();
      const user = users[0];

      // expectation
      expect(response.status).toBe(201);
      expect(user.username).toEqual(newUser.username);
    });

    it("should return a 422 and a message stating the missing parameter", async () => {
      const invalidNewUser = {
        name: "Greg",
        password: "passwords"
      };

      const response = await request(app)
        .post(`/api/v1/signup`)
        .send(invalidNewUser);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(
        "Expected format: {username: <string>, password <string>. You're missing a 'username' property."
      );
    });
  });

  describe("GET /api/v1/users/:user_id/projects", () => {
    it("should return a 200 and all projects for a specific user ", async () => {
      // setup
      const expectedUser = await database("users").first();
      const { id } = expectedUser;
      const expectedProjects = await database("projects")
        .where("user_id", id)
        .select();

      // execution
      const response = await request(app).get(`/api/v1/users/${id}/projects`);
      const projects = response.body;

      // expectation
      expect(response.status).toBe(200);
      expect(projects.length).toEqual(expectedProjects.length);
    });

    it("should return a 404 and a message that there are no projects", async () => {
      // setup
      const invalidId = -1;

      // execution
      const response = await request(app).get(
        `/api/v1/users/${invalidId}/projects`
      );

      // expectation
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual("No projects yet!");
    });
  });

  describe("GET /api/v1/projects/:project_id", () => {
    it("should return a 200 and a specific project for a specific user ", async () => {
      // setup
      const expectedUser = await database("users").first();
      const { id } = expectedUser;
      const expectedProject = await database("projects")
        .where("user_id", id)
        .select()
        .first();
      const project_id = expectedProject.id;
      // execution
      const response = await request(app).get(`/api/v1/projects/${project_id}`);

      const project = response.body;

      // expectation
      expect(response.status).toBe(200);
      expect(project.name).toEqual(expectedProject.name);
    });

    it('should return a 404 and the message "Project not found"', async () => {
      // setup
      const invalidID = -1;

      const response = await request(app).get(`/api/v1/projects/${invalidID}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual(
        `No project with  and id of ${invalidID} was found!`
      );
    });
  });

  describe("GET /api/v1/projects/:project_id/palettes", () => {
    it("should return a 200 and all palettes for a specific user's project", async () => {
      // setup
      const expectedUser = await database("users").first();
      const { id } = expectedUser;
      const expectedProject = await database("projects")
        .where("user_id", id)
        .select()
        .first();
      const project_id = expectedProject.id;
      const expectedPalettes = await database("palettes")
        .where("project_id", project_id)
        .select();

      // execution
      const response = await request(app).get(
        `/api/v1/projects/${project_id}/palettes`
      );
      const palettes = response.body;

      // expectation
      expect(response.status).toBe(200);
      expect(palettes.length).toEqual(expectedPalettes.length);
    });
    it("should return a 404 and a message that there are no palettes", async () => {
      // setup
      const invalidId = -1;

      // execution
      const response = await request(app).get(
        `/api/v1/projects/${invalidId}/palettes`
      );

      // expectation
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual("No palettes yet!");
    });
  });

  describe("POST /api/v1/projects", () => {
    it("should post a new project to the db", async () => {
      // setup
      const user = await database("users").first();
      const { id } = user;
      const newProject = { name: "Neature", user_id: id };

      // execution
      const response = await request(app)
        .post(`/api/v1/projects`)
        .send(newProject);

      const projects = await database("projects")
        .where("id", response.body.id)
        .select();
      const project = projects[0];

      // expectation
      expect(response.status).toBe(201);
      expect(project.name).toEqual(newProject.name);
    });

    it("should return a 422 if a new project's information is unprocessable", async () => {
      // setup
      const newProject = { name: "Neature", jinglehighmerblopins: "Lejobes" };

      // execution
      const response = await request(app)
        .post(`/api/v1/projects`)
        .send(newProject);

      // expectation
      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(
        "Expected format: { user_id: <integer>, name: <string>}. You're missing a 'user_id' property."
      );
    });
  });

  describe("POST /api/v1/palettes", () => {
    it("should post a new palette to the db", async () => {
      // setup
      const project = await database("projects").first();
      const { id } = project;
      const newPalette = {
        name: "Green",
        color1: "#asdfgh",
        color2: "#qwerty",
        color3: "#ghjklp",
        color4: "#123456",
        color5: "#098765",
        project_id: id
      };

      // execution
      const response = await request(app)
        .post(`/api/v1/palettes`)
        .send(newPalette);

      const palettes = await database("palettes")
        .where("id", response.body.id)
        .select();
      const palette = palettes[0];

      // expectation
      expect(response.status).toBe(201);
      expect(palette.name).toEqual(newPalette.name);
    });

    it("should return a 422 if a new palette's information is unprocessable", async () => {
      // setup
      const newPalette = { name: "Green", grarrarrarra: "rrrrrrrrrrrrr" };

      // execution
      const response = await request(app)
        .post(`/api/v1/palettes`)
        .send(newPalette);

      // expectation
      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(
        `Expected format: { project_id: <integer>, name: <string>, color1:<hexcode>, color2:<hexcode>, color3:<hexcode>, color4:<hexcode>, color5:<hexcode>}. You\'re missing a \'project_id\' property.`
      );
    });
  });

  describe("PATCH /api/v1/projects/:id", () => {
    it("should patch a project in the db", async () => {
      // setup
      const project = await database("projects").first();
      const { id } = project;
      const newProjectPatch = {
        name: "Wookrasamusen"
      };

      // execution
      const response = await request(app)
        .patch(`/api/v1/projects/${id}`)
        .send(newProjectPatch);

      // expectation
      expect(response.status).toBe(202);
      expect(response.body.message).toEqual("name updated");
    });

    it("should return a 404 if project does not exist with attempted id", async () => {
      // setup
      const newProjectPatch = {
        name: "Gunderflop"
      };
      const invalidID = -1;

      // execution
      const response = await request(app)
        .patch(`/api/v1/projects/${invalidID}`)
        .send(newProjectPatch);

      // expectation
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(
        `No existing project with id of ${invalidID}`
      );
    });
    it("should return a 422 if project patch attempts to change a parameter that does not exist", async () => {
      // setup
      const project = await database("projects").first();
      const { id } = project;
      const newProjectPatch = {
        hillmoprolly: "Frillmoprolly"
      };

      // execution
      const response = await request(app)
        .patch(`/api/v1/projects/${id}`)
        .send(newProjectPatch);

      // expectation
      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(
        `You can only update a projects's <name> not hillmoprolly`
      );
    });
  });

  describe("PUT /api/v1/palettes/:id", () => {
    it.skip("should put a palette in the db", async () => {
      // setup
      const palette = await database("palettes").first();
      const { id, project_id } = palette;
      const newPalettePut = {
        name: "Flargiblits",
        project_id: project_id,
        color1: "#FFFFFFF",
        color2: "#FFFFFFF",
        color3: "#FFFFFFF",
        color4: "#FFFFFFF",
        color5: "#FFFFFFF"
      };

      // execution
      const response = await request(app)
        .put(`/api/v1/palettes/${id}`)
        .send(newPalettePut);

      // expectation
      expect(response.status).toBe(202);
      expect(response.body.message).toEqual("Flargiblits updated");
    });

    it("should return a 404 if palette does not exist with attempted id", async () => {
      // setup
      const newPalettePut = {
        name: "Dimpleglarpin",
        project_id: 1,
        color1: "#FFFFFFF",
        color2: "#FFFFFFF",
        color3: "#FFFFFFF",
        color4: "#FFFFFFF",
        color5: "#FFFFFFF"
      };
      const invalidID = -1;

      // execution
      const response = await request(app)
        .put(`/api/v1/palettes/${invalidID}`)
        .send(newPalettePut);

      // expectation
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(
        `No existing palette with id of ${invalidID}`
      );
    });

    it("should return a 422 if palette patch attempts to change a parameter that does not exist", async () => {
      // setup
      const palette = await database("palettes").first();
      const { id } = palette;
      const newPalettePut = {
        grumplin: "Frumplin"
      };

      // execution
      const response = await request(app)
        .put(`/api/v1/palettes/${id}`)
        .send(newPalettePut);

      // expectation
      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(
        `Expected format: { project_id: <integer>, name: <string>, color1:<hexcode>, color2:<hexcode>, color3:<hexcode>, color4:<hexcode>, color5:<hexcode>}. You're missing a 'project_id' property.`
      );
    });
  });

  describe("DELETE /api/v1/projects/:id", () => {
    it("should delete a project from the db and respond with a 200 status code", async () => {
      // setup
      const project = await database("projects").first();
      const { id } = project;

      // execution
      const response = await request(app).delete(`/api/v1/projects/${id}`);

      // expectation
      expect(response.status).toBe(200);
      expect(response.body).toEqual(`Project deleted`);
    });

    it("should return a 404 if project id does not exist", async () => {
      // setup
      const invalidID = -1;

      // execution
      const response = await request(app).delete(
        `/api/v1/projects/${invalidID}`
      );

      // expectation
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        `Project with an id: ${invalidID} does not exist.`
      );
    });
  });

  describe("DELETE /api/v1/palettes/:id", () => {
    it("should delete a palette from the db and respond with a 200 status code", async () => {
      // setup
      const palette = await database("palettes").first();
      const { id } = palette;

      // execution
      const response = await request(app).delete(`/api/v1/palettes/${id}`);

      // expectation
      expect(response.status).toBe(200);
      expect(response.body).toEqual(`Palette deleted`);
    });

    it("should return a 404 if palette id does not exist", async () => {
      // setup
      const invalidID = -1;

      // execution
      const response = await request(app).delete(
        `/api/v1/palettes/${invalidID}`
      );

      // expectation
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        `Palette with an id: ${invalidID} does not exist.`
      );
    });
  });
});
