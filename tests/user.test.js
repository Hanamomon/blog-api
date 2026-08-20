import userRouter from "../routes/userRouter";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { PrismaClientRustPanicError } from "@prisma/client/runtime/client";

import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import errorHandler from "../middlewares/errorMiddleware";
const app = express();

app.use(express.json());
app.use("/", userRouter);
app.use(errorHandler);

let user;

beforeAll(async () => {
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash("Cacapipi!1", salt);

  user = await prisma.user.create({
    data: {
      username: "Caca4",
      email: "caca4@gmail.com",
      hash,
      salt,
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function logUser(username, password) {
  const logRes = await request(app)
    .post("/login")
    .type("json")
    .send({ username, password });

  return logRes.body;
}

describe("/users POST", () => {
  describe("sign up route", () => {
    it("invalid sign up data", async () => {
      const res = await request(app)
        .post("/sign-up")
        .type("json")
        .send({
          username: "",
          email: "stuffNotGmail.com",
          password: "cqweqe",
          confirmPassword: "cqweqe",
        })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400);

      expect(res.body.errors.username.msg).toEqual("Username is required.");
      expect(res.body.errors.password.msg).toEqual(
        "Valid password contains a minimum of 8 characters and at least one lowercase letter, one uppercase letter, one number, and one symbol.",
      );
      expect(res.body.errors.email.msg).toEqual("Valid email is required.");
    });

    it("not matching passwords", async () => {
      const res = await request(app)
        .post("/sign-up")
        .type("json")
        .send({
          username: "aUser",
          email: "aUser@gmail.com",
          password: "Cacapipi!1",
          confirmPassword: "Cacapipi!2",
        })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400);

      expect(res.body.errors.confirmPassword.msg).toEqual(
        "Passwords do not match.",
      );
    });

    it("username is taken", async () => {
      const res = await request(app)
        .post("/sign-up")
        .type("json")
        .send({
          username: user.username,
          email: "Caca5@gmail.com",
          password: "Cacapipi!1",
          confirmPassword: "Cacapipi!1",
        })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400);

      expect(res.body.errors.username.msg).toEqual("Username is taken.");
    });

    it("email is taken", async () => {
      const res = await request(app)
        .post("/sign-up")
        .type("json")
        .send({
          username: "Caca5",
          email: user.email,
          password: "Cacapipi!1",
          confirmPassword: "Cacapipi!1",
        })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400);

      expect(res.body.errors.email.msg).toEqual(
        "An account is associated with this email.",
      );
    });

    it("successful sign up", async () => {
      const res = await request(app)
        .post("/sign-up")
        .type("json")
        .send({
          username: "Caca5",
          email: "Caca5@gmail.com",
          password: "Cacapipi!1",
          confirmPassword: "Cacapipi!1",
        })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(201);
      expect(res.body).toHaveProperty("username");
    });

    it("handles errors", async () => {
      const error = new PrismaClientRustPanicError(
        "Mocking a prisma client error.",
        {
          clientVersion: "7.9.1",
        },
      );
      const spyFunction = jest
        .spyOn(prisma.user, "create")
        .mockRejectedValueOnce(error);

      const res = await request(app)
        .post("/sign-up")
        .type("json")
        .send({
          username: "Caca6",
          email: "Caca6@gmail.com",
          password: "Cacapipi!1",
          confirmPassword: "Cacapipi!1",
        })
        .expect(500);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("login route", () => {
    it("invalid login data", async () => {
      const res = await request(app)
        .post("/login")
        .type("json")
        .send({ username: "", password: "cqweqe" })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400);

      expect(res.body.errors.username.msg).toEqual("Username is required.");
    });

    it("user does not exist", async () => {
      const res = await request(app)
        .post("/login")
        .type("json")
        .send({ username: "WhoIsThis", password: "!nc0rrecT" })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400);

      expect(res.body.errors.username.msg).toEqual(
        "No user with this username exists.",
      );
    });

    it("incorrect password", async () => {
      const res = await request(app)
        .post("/login")
        .type("json")
        .send({ username: "Caca4", password: "!nc0rrecT" })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(401);

      expect(res.body.errors.password.msg).toEqual("Incorrect password.");
    });

    it("successful login", async () => {
      const res = await request(app)
        .post("/login")
        .type("json")
        .send({ username: user.username, password: "Cacapipi!1" })
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200);

      const decoded = jwt.verify(res.body, process.env.JWT_SECRET);

      expect(decoded).toEqual({
        id: user.id,
        username: "Caca4",
        role: "USER",
        exp: expect.any(Number),
        iat: expect.any(Number),
      });
    });
  });
});

describe("/users GET", () => {
  it("user is not authenticated", async () => {
    const res = await request(app).get("/").expect(401);
  });

  it("user is autheticated", async () => {
    const token = await logUser(user.username, "Cacapipi!1");

    const res = await request(app)
      .get("/")
      .auth(token, { type: "bearer" })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("username");
  });
});

describe("/users PATCH", () => {
  it("user is not authenticated", async () => {
    const res = await request(app).patch("/").expect(401);
  });

  it("invalid role", async () => {
    const token = await logUser(user.username, "Cacapipi!1");

    const res = await request(app)
      .patch("/")
      .auth(token, { type: "bearer" })
      .type("json")
      .send({ role: "USERS" })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body.errors.role.msg).toEqual("Invalid role provided.");
  });

  it("successful role change", async () => {
    const token = await logUser(user.username, "Cacapipi!1");

    const res = await request(app)
      .patch("/")
      .auth(token, { type: "bearer" })
      .type("json")
      .send({ role: "AUTHOR" })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    const patchedUser = await prisma.user.findUnique({
      where: { username: user.username },
    });
    expect(patchedUser.role).toEqual("AUTHOR");
  });
});
