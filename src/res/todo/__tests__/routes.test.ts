import request from "supertest";
import { app } from "../../../utils/createServer";
import { pick, omit } from "../../../utils/helpers";
import { User } from "../../user/user.model";
import { Todo } from "../todo.model";

// todo: join not being tested now

const email = "email@email.com";
const password = "1234567";
const key = "0957a94b-ce6c-4858-bab3-6fe04795850c";
const user = {
  id: "6adc0d6a-d9a5-4838-bf8f-95e80cef0e42",
  key,
  email,
  password,
  updatedAt: "2022-10-03T09:03:52.383Z",
  createdAt: "2022-10-03T09:03:52.383Z",
};
const todo = {
  id: "6adc0d6a-d9a5-4838-bf8f-95e80cef0e42",
  userId: "6adc0d6a-d9a5-4838-bf8f-95e80cef0e42",
  todo: "hello",
  completed: false,
  updatedAt: "2022-10-03T09:03:52.383Z",
  createdAt: "2022-10-03T09:03:52.383Z",
};

// create todo
describe("POST /todos?key", () => {
  it("Should fail if no API key", async () => {
    const res = await request(app)
      .post(`/todos`)
      .query({})
      .send({ description: todo.todo });
    expect(res.body).toEqual({
      code: 400,
      message: "No API key",
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid API key", async () => {
    const res = await request(app)
      .post(`/todos`)
      .query({ key: "aa" })
      .send({ description: todo.todo });
    expect(res.body).toEqual({
      message: "Invalid API key",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if no description", async () => {
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
    const res = await request(app).post(`/todos`).query({ key }).send({});
    // expect(res.body).toHaveProperty("message");
    // expect(res.body).toHaveProperty("code");
    // expect(res.body.message).not.toBe(undefined);
    // expect(res.body.code).not.toBe(undefined);
    expect(res.body).toEqual({
      message: "No description found",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should successfully create todo", async () => {
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
    const mockCreate = jest.fn(async () =>
      Todo.build(
        pick<Omit<typeof todo, "updatedAt" | "createdAt">>(todo, [
          "id",
          "userId",
          "todo",
          "completed",
        ])
      )
    );
    const mockFindByPk = jest.fn(async () => null);

    jest.mock("uuid", () => {
      v4: jest.fn(() => "");
    });

    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
    jest.spyOn(Todo, "create").mockImplementation(() => mockCreate());
    jest.spyOn(Todo, "findByPk").mockImplementation(() => mockFindByPk());

    const res = await request(app)
      .post(`/todos`)
      .query({ key })
      .send({ description: todo.todo });

    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockCreate).toBeCalledTimes(1);
    expect(mockFindByPk).toBeCalled();

    expect(res.body).toEqual(todo);
    expect(res.statusCode).toBe(200);
  });
});

// find all todos
describe("GET /todos?key", () => {
  it("Should fail if no API key", async () => {
    const res = await request(app).get(`/todos`).query({});
    expect(res.body).toEqual({
      code: 400,
      message: "No API key",
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid API key", async () => {
    const res = await request(app).get(`/todos`).query({ key: "aa" });
    expect(res.body).toEqual({
      message: "Invalid API key",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should successfully find todos", async () => {
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
    const mockFindAll = jest.fn(async () => [
      Todo.build(
        pick<Omit<typeof todo, "updatedAt" | "createdAt">>(todo, [
          "id",
          "userId",
          "todo",
          "completed",
        ])
      ),
    ]);
    jest.mock("uuid", () => {
      v4: jest.fn(() => "");
    });

    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
    jest.spyOn(Todo, "findAll").mockImplementation(() => mockFindAll());

    const res = await request(app).get(`/todos`).query({ key });

    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockFindAll).toBeCalledTimes(1);

    expect(res.body).toEqual({
      todos: [todo],
      owner: pick(user, ["email", "id"]),
    });
    expect(res.statusCode).toBe(200);
  });
});

// find a todo
describe("GET /todos/:id?key", () => {
  it("Should fail if no API key", async () => {
    const res = await request(app).get(`/todos/1`).query({});
    expect(res.body).toEqual({
      code: 400,
      message: "No API key",
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid API key", async () => {
    const res = await request(app).get(`/todos/1`).query({ key: "aa" });
    expect(res.body).toEqual({
      message: "Invalid API key",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid id", async () => {
    const res = await request(app).get(`/todos/1`).query({ key });
    expect(res.body).toEqual({
      message: "Invalid id",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if it cannot find todo", async () => {
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
    const mockTodoFindOne = jest.fn(async () => null);

    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
    jest.spyOn(Todo, "findOne").mockImplementation(() => mockTodoFindOne());

    const res = await request(app).get(`/todos/${todo.id}`).query({ key });

    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockTodoFindOne).toBeCalledTimes(1);

    expect(res.body).toEqual({
      message: "No todo found",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should successfully find todo", async () => {
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
    const mockTodoFindOne = jest.fn(async () =>
      Todo.build(
        pick<Omit<typeof todo, "updatedAt" | "createdAt">>(todo, [
          "id",
          "userId",
          "todo",
          "completed",
        ])
      )
    );

    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
    jest.spyOn(Todo, "findOne").mockImplementation(() => mockTodoFindOne());

    const res = await request(app).get(`/todos/${todo.id}`).query({ key });

    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockTodoFindOne).toBeCalledTimes(1);

    expect(res.body).toEqual({
      ...todo,
      // ...omit(todo, ["userId"]),
      // user: pick(user, ["email", "id"]),
    });
    expect(res.statusCode).toBe(200);
  });
});

// update a todo
describe("POST /todos/:id?key", () => {
  it("Should fail if no API key", async () => {
    const res = await request(app).post(`/todos/1`).query({});
    expect(res.body).toEqual({
      code: 400,
      message: "No API key",
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid API key", async () => {
    const res = await request(app).post(`/todos/1`).query({ key: "aa" });
    expect(res.body).toEqual({
      message: "Invalid API key",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid id", async () => {
    const res = await request(app).post(`/todos/1`).query({ key });
    expect(res.body).toEqual({
      message: "Invalid id",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should successfully update todo", async () => {
    const update = { todo: "hello", completed: true };
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
        Todo.build({
          ...pick<Omit<typeof todo, "updatedAt" | "createdAt">>(todo, [
            "id",
            "userId",
            "todo",
            "completed",
          ]),
          ...update,
        }),
      ],
    ]);

    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
    jest.spyOn(Todo, "update").mockImplementation(() => mockUpdate());

    const res = await request(app)
      .post(`/todos/${todo.id}`)
      .query({ key })
      .send(update);

    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockUpdate).toBeCalledTimes(1);

    expect(res.body).toEqual({
      ...todo,
      ...update,
    });

    expect(res.statusCode).toBe(200);
  });
});

// delete a todo
describe("DELETE /todos/:id?key", () => {
  it("Should fail if no API key", async () => {
    const res = await request(app).delete(`/todos/1`).query({});
    expect(res.body).toEqual({
      code: 400,
      message: "No API key",
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid API key", async () => {
    const res = await request(app).delete(`/todos/1`).query({ key: "aa" });
    expect(res.body).toEqual({
      message: "Invalid API key",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should fail if invalid id", async () => {
    const res = await request(app).delete(`/todos/1`).query({ key });
    expect(res.body).toEqual({
      message: "Invalid id",
      code: 400,
    });
    expect(res.statusCode).toBe(200);
  });

  it("Should successfully delete todo", async () => {
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

    jest.spyOn(User, "findOne").mockImplementation(() => mockFindOne());
    jest.spyOn(Todo, "destroy").mockImplementation(() => mockDelete());

    const res = await request(app).delete(`/todos/${todo.id}`).query({ key });

    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockDelete).toBeCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });
});
