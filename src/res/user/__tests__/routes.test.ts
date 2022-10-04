import request from "supertest";
import { app } from "../../../utils/createServer";
import { omit, pick } from "../../../utils/helpers";
import { User } from "../user.model";
import bcrypt from "bcrypt";
import { Todo } from "../../todo/todo.model";

const email = "email@email.com";
const newEmail = "email@email2.com";
const password = "1234567";
const newPassword = "7654321";
const key = "0957a94b-ce6c-4858-bab3-6fe04795850c";
const user = {
  id: "6adc0d6a-d9a5-4838-bf8f-95e80cef0e42",
  key,
  email,
  password,
  updatedAt: "2022-10-03T09:03:52.383Z",
  createdAt: "2022-10-03T09:03:52.383Z",
};

// create tests
describe("POST /users/create", () => {
  it("Should fail if no email is provided", () => {
    return request(app).post("/users/create").send({}).expect(200, {
      message: "No email",
      code: 400,
    });
  });
  it("Should fail if no password is provided", () => {
    return request(app).post("/users/create").send({ email }).expect(200, {
      message: "No password",
      code: 400,
    });
  });
  it("Should fail if user already exists", async () => {
    const mockFindOne = jest.fn(async () =>
      User.build(
        pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
          "id",
          "key",
          "email",
          "password",
        ])
      )
    );
    const mockCreate = jest.fn(async () => user);
    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
    jest.spyOn(User, "create").mockImplementation(() => mockCreate());

    const res = await request(app)
      .post("/users/create")
      .send({ email, password });
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(0);
    expect(res.body).toEqual({
      message: "This email is already in use",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });
  it("Should create user successfully", async () => {
    const mockFindOne = jest.fn(async () => null);
    const mockFindByPk = jest.fn(async () => null);
    const mockCreate = jest.fn(async () =>
      User.build(
        pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
          "id",
          "key",
          "email",
          "password",
        ])
      )
    );
    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
    jest.spyOn(User, "create").mockImplementation(() => mockCreate());
    jest.spyOn(User, "findByPk").mockImplementation(() => mockFindByPk());

    const res = await request(app)
      .post("/users/create")
      .send({ email, password });
    // .expect(function (res) {
    //   res.body.email = "email@email.com";
    // })
    expect(mockFindOne).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual(omit(user, ["password"]));
    expect(res.statusCode).toBe(200);
  });
});

// login tests
describe("POST /users/login", () => {
  it("Should fail if no email is provided", () => {
    return request(app).post("/users/login").send({}).expect(200, {
      message: "No email",
      code: 400,
    });
  });
  it("Should fail if no password is provided", () => {
    return request(app).post("/users/login").send({ email }).expect(200, {
      message: "No password",
      code: 400,
    });
  });
  it("Should fail if no user is found", async () => {
    const mockedFindOne = jest.fn(async () => null);

    jest.spyOn(User, "findOne").mockImplementation(() => mockedFindOne());
    const res = await request(app)
      .post("/users/login")
      .send({ email, password });
    expect(mockedFindOne).toBeCalledTimes(1);
    expect(res.body).toEqual({
      message: "Invalid login credentials",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });
  it("Should fail if password is not valid", async () => {
    const mockedFindOne = jest.fn(async () =>
      User.build(
        pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
          "id",
          "key",
          "email",
          "password",
        ])
      )
    );
    const mockCompareBcrypt = jest.fn(async () => false);

    jest.spyOn(User, "findOne").mockImplementation(() => mockedFindOne());
    jest.spyOn(bcrypt, "compare").mockImplementation(() => mockCompareBcrypt());
    const res = await request(app)
      .post("/users/login")
      .send({ email, password });
    expect(mockedFindOne).toBeCalledTimes(1);
    expect(mockCompareBcrypt).toBeCalledTimes(1);
    expect(res.body).toEqual({
      message: "Invalid login credentials",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });
  it("Should successfully login user", async () => {
    const mockedFindOne = jest.fn(async () =>
      User.build(
        pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
          "id",
          "key",
          "email",
          "password",
        ])
      )
    );
    const mockCompareBcrypt = jest.fn(async () => true);

    jest.spyOn(User, "findOne").mockImplementation(() => mockedFindOne());
    jest.spyOn(bcrypt, "compare").mockImplementation(() => mockCompareBcrypt());
    const res = await request(app)
      .post("/users/login")
      .send({ email, password });
    expect(mockedFindOne).toBeCalledTimes(1);
    expect(mockCompareBcrypt).toBeCalledTimes(1);
    expect(res.body).toEqual(pick(user, ["id", "key", "email"]));
    expect(res.statusCode).toBe(200);
  });
});

// find tests
describe("POST /users/:id", () => {
  it("Should fail if id is not valid", async () => {
    const res = await request(app).get(`/users/1`);
    expect(res.body).toEqual({
      message: "Invalid id",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });
  // todo if no id is provided, search for all users
  it("Should successfully find a user", async () => {
    const mockedFindByPk = jest.fn(async () =>
      User.build(
        pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
          "id",
          "key",
          "email",
          "password",
        ])
      )
    );
    jest.spyOn(User, "findByPk").mockImplementation(() => mockedFindByPk());

    const res = await request(app).get(`/users/${user.id}`);
    expect(res.body).toEqual(pick(user, ["id", "email"]));
    expect(res.statusCode).toBe(200);
  });
});

// update tests
describe("POST /users/update?key", () => {
  it("Should fail if no API key", async () => {
    const res = await request(app).post(`/users/update`).query({});
    expect(res.body).toEqual({
      code: 400,
      message: "No API key",
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid API key", async () => {
    const res = await request(app).post(`/users/update`).query({ key: "aa" });
    expect(res.body).toEqual({
      message: "Invalid API key",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  describe("Updating email", () => {
    it("Should fail if email already exists", async () => {
      const mockFindOne = jest.fn(async () =>
        User.build(
          pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
            "id",
            "key",
            "email",
            "password",
          ])
        )
      );
      jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
      const res = await request(app)
        .post(`/users/update`)
        .query({ key })
        .send({ email });
      expect(mockFindOne).toBeCalledTimes(2);
      expect(res.body).toEqual({
        message: "This email is already in use",
        code: 400,
      });
      expect(res.statusCode).toBe(200);
    });

    it("Should be sucessful", async () => {
      const mockFindOne = jest
        .fn()
        .mockImplementationOnce(async () =>
          User.build(
            pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
              "id",
              "key",
              "email",
              "password",
            ])
          )
        )
        .mockImplementationOnce(async () => null);

      const mockUpdate = jest.fn().mockImplementation(async () => [
        1,
        [
          User.build({
            ...pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
              "id",
              "key",
              "email",
              "password",
            ]),
            email: newEmail,
          }),
        ],
      ]);

      jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
      jest.spyOn(User, "update").mockImplementation(() => mockUpdate());

      const res = await request(app)
        .post(`/users/update`)
        .query({ key })
        .send({ email });
      expect(mockFindOne).toBeCalledTimes(2);
      expect(mockUpdate).toBeCalledTimes(1);
      expect(res.body).toEqual({
        ...pick(user, ["email", "id"]),
        email: newEmail,
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe("Updating other fields", () => {
    it("Should successfully update other fields", async () => {
      const mockFindOne = jest.fn(async () =>
        User.build(
          pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
            "id",
            "key",
            "email",
            "password",
          ])
        )
      );
      const mockUpdate = jest.fn().mockImplementation(async () => [
        1,
        [
          User.build({
            ...pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
              "id",
              "key",
              "email",
              "password",
            ]),
            email: newEmail,
          }),
        ],
      ]);

      jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
      jest.spyOn(User, "update").mockImplementation(() => mockUpdate());

      const res = await request(app)
        .post(`/users/update`)
        .query({ key })
        .send({ password: newPassword });
      expect(mockFindOne).toBeCalledTimes(1);
      expect(mockUpdate).toBeCalledTimes(1);
      expect(res.body).toEqual({
        ...pick(user, ["email", "id"]),
        email: newEmail,
      });
      expect(res.statusCode).toBe(200);
    });
  });
});

// delete tests
// todo check if the key is passed
describe("DELETE /users?key", () => {
  it("Should delete user account", async () => {
    const mockDelete = jest.fn(async () => 1);
    const mockFindOne = jest.fn(async () =>
      User.build(
        pick<Omit<typeof user, "updatedAt" | "createdAt">>(user, [
          "id",
          "key",
          "email",
          "password",
        ])
      )
    );
    jest.spyOn(User, "destroy").mockImplementation(() => mockDelete());
    jest.spyOn(Todo, "destroy").mockImplementation(() => mockDelete());
    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());

    const res = await request(app).delete(`/users`).query({ key });

    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockDelete).toBeCalledTimes(2);
    expect(res.statusCode).toBe(200);
  });
});
