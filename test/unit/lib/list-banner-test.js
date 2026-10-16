import { module, test } from "qunit";
import {
  findBanner,
  isCustomListPage,
  safeColor,
} from "../../../discourse/lib/list-banner";

module("Unit | Lib | list-banner", function () {
  const banners = [
    { slug: "events", title: "Events" },
    { slug: "Endpoint-Management", title: "Endpoint Management" },
  ];

  test("isCustomListPage detects /lists/ URLs", function (assert) {
    assert.true(isCustomListPage("/lists/events"));
    assert.true(isCustomListPage("/community/lists/events?order=views"));
    assert.false(isCustomListPage("/latest"));
    assert.false(isCustomListPage("/c/events/12"));
    assert.false(isCustomListPage(undefined));
  });

  test("findBanner matches the slug after /lists/", function (assert) {
    assert.strictEqual(findBanner("/lists/events", banners), banners[0]);
    assert.strictEqual(
      findBanner("/lists/events?order=views", banners),
      banners[0]
    );
    assert.strictEqual(findBanner("/lists/events/", banners), banners[0]);
  });

  test("findBanner ignores case and rows without a slug", function (assert) {
    assert.strictEqual(
      findBanner("/lists/endpoint-management", banners),
      banners[1]
    );
    assert.strictEqual(
      findBanner("/lists/events", [{ title: "x" }]),
      undefined
    );
  });

  test("findBanner does not match partial slugs or other routes", function (assert) {
    assert.strictEqual(findBanner("/lists/events-archive", banners), undefined);
    assert.strictEqual(findBanner("/latest", banners), undefined);
    assert.strictEqual(findBanner(undefined, banners), undefined);
    assert.strictEqual(findBanner("/lists/events", []), undefined);
  });

  test("safeColor only allows hex values and plain color names", function (assert) {
    assert.strictEqual(safeColor("#0073e6"), "#0073e6");
    assert.strictEqual(safeColor(" crimson "), "crimson");
    assert.strictEqual(safeColor("red; background: url(x)"), null);
    assert.strictEqual(safeColor("url(javascript:alert(1))"), null);
    assert.strictEqual(safeColor(""), null);
    assert.strictEqual(safeColor(undefined), null);
  });
});
