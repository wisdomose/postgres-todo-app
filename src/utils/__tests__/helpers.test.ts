const helpers = require("../helpers");

describe("Helpers", () => {
  test("It should omit password field", (done) => {
    const data = { email: "email@email.com", id: "1", password: "1234567" };
    let res = helpers.omit(data, ["password"]);
    expect(res).toStrictEqual({ email: "email@email.com", id: "1" });
    done();
  });
  test("It should pick email and id fields", (done) => {
    const data = { email: "email@email.com", id: "1", password: "1234567" };
    let res = helpers.pick(data, ["email", "id"]);
    expect(res).toStrictEqual({ email: "email@email.com", id: "1" });
    done();
  });
  test("It should remove undefined values from an object", (done) => {
    const data = { email: undefined, id: "1", password: "1234567" };
    helpers.removeUndefined(data);
    expect(data).toStrictEqual({ id: "1", password: "1234567" });
    done();
  });
});
