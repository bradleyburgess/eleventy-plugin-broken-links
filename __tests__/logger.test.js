const log = require("../lib/logger");
const chalk = require("kleur");

describe("logger", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("console.log is called", () => {
    log().display("testing 123");
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls.length).toBe(1);
  });

  test("console.log has correct text", () => {
    log().display("testing 123");
    expect(consoleSpy.mock.calls[0][0]).toContain("testing 123");
    expect(consoleSpy.mock.calls[0][0]).toBe(chalk.white(log().pre + " testing 123"));
  });

  test("warn has correct color", () => {
    log().warn().display("testing 123");
    expect(consoleSpy.mock.calls[0][0]).toBe(chalk.yellow(log().pre + " testing 123"));
  });

  test("indent", () => {
    log().indent().display("testing 123");
    expect(consoleSpy.mock.calls[0][0]).toBe(chalk.white(log().pre + "   testing 123"));
  });

  test("bullet", () => {
    log().bullet().display("testing 123");
    expect(consoleSpy.mock.calls[0][0]).toBe(chalk.white(log().pre + " - testing 123"));
  });
});
