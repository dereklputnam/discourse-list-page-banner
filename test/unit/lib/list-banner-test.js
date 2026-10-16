import { module, test } from "qunit";
import {
  findBanner,
  findBannerBySlug,
  isCustomListPage,
  resolveBanner,
  safeColor,
  safeUrl,
  thumbnailMode,
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

  test("resolveBanner reads the title and description from the list", function (assert) {
    const lists = [
      { slug: "events", name: "Events", description: "From the plugin" },
    ];

    assert.deepEqual(
      resolveBanner("/lists/events", [{ slug: "events", color: "red" }], lists),
      {
        title: "Events",
        description: "From the plugin",
        color: "red",
        buttons: [],
      }
    );
    assert.strictEqual(resolveBanner("/lists/events", [], lists), undefined);
    assert.strictEqual(
      resolveBanner("/lists/events", [{ slug: "events" }], undefined).title,
      "events"
    );
  });

  /* eslint-disable no-script-url */
  test("safeUrl allows http(s) links and site paths only", function (assert) {
    assert.strictEqual(
      safeUrl("https://docs.netwrix.com/x"),
      "https://docs.netwrix.com/x"
    );
    assert.strictEqual(safeUrl(" /t/123 "), "/t/123");
    assert.strictEqual(safeUrl("javascript:alert(1)"), null);
    assert.strictEqual(safeUrl("//evil.example.com"), null);
    assert.strictEqual(safeUrl("data:text/html,x"), null);
    assert.strictEqual(safeUrl("docs"), null);
    assert.strictEqual(safeUrl(""), null);
    assert.strictEqual(safeUrl(undefined), null);
  });

  test("resolveBanner keeps only buttons with text and a safe URL", function (assert) {
    const banner = resolveBanner(
      "/lists/events",
      [
        {
          slug: "events",
          buttons: [
            { text: "Docs", url: "https://docs.netwrix.com" },
            { text: "Bad", url: "javascript:alert(1)" },
            { text: "", url: "/t/1" },
            { text: "Post", url: "/t/123" },
          ],
        },
      ],
      []
    );

    assert.deepEqual(banner.buttons, [
      { text: "Docs", url: "https://docs.netwrix.com" },
      { text: "Post", url: "/t/123" },
    ]);
    assert.deepEqual(
      resolveBanner("/lists/events", [{ slug: "events" }], []).buttons,
      []
    );
  });
  /* eslint-enable no-script-url */

  test("findBannerBySlug ignores case", function (assert) {
    assert.strictEqual(findBannerBySlug("EVENTS", banners), banners[0]);
    assert.strictEqual(findBannerBySlug("nope", banners), undefined);
    assert.strictEqual(findBannerBySlug(undefined, banners), undefined);
  });

  test("thumbnailMode only returns known layouts", function (assert) {
    assert.strictEqual(thumbnailMode({ thumbnails: "grid" }), "grid");
    assert.strictEqual(
      thumbnailMode({ thumbnails: "blog-style" }),
      "blog-style"
    );
    assert.strictEqual(thumbnailMode({ thumbnails: "none" }), "none");
    assert.strictEqual(thumbnailMode({ thumbnails: "default" }), undefined);
    assert.strictEqual(thumbnailMode({ thumbnails: "bogus" }), undefined);
    assert.strictEqual(thumbnailMode({}), undefined);
    assert.strictEqual(thumbnailMode(undefined), undefined);
  });
});
