const Cache = require("nice-cache");
const cache = new Cache({});
const tryGetCached = require("../lib/to-be-published/try-get-cached");
const predicate = jest.fn(cb => cb(null, "something"));

test("If content is not cached, should and returned", done => {
  tryGetCached("bundle", "666", predicate, (err, res) => {
    expect(err).toBeNull();
    expect(res).toBe("something");
    expect(cache.get("bundle", "666")).toBe("something");
    done();
  });
});

test("If content was already cached return it without calling the predicate", done => {
  cache.set("bundle", "333", "something else");
  const predicate = jest.fn(cb => cb(null, "something"));

  tryGetCached("bundle", "333", predicate, (err, res) => {
    expect(err).toBeNull();
    expect(res).toBe("something else");
    expect(predicate).not.toHaveBeenCalled();
    done();
  });
});
