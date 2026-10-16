const SLUG_PATTERN = /\/lists\/([^/?#]+)/;
const COLOR_PATTERN = /^(#[0-9a-f]{3,8}|[a-z]+)$/i;

export function isCustomListPage(url) {
  return SLUG_PATTERN.test(url || "");
}

// Custom Topic Lists pages live at /lists/<slug>. Returns the `list_banners` row
// whose slug matches the current URL.
export function findBanner(url, banners = settings.list_banners) {
  const match = SLUG_PATTERN.exec(url || "");
  const slug = match && decodeURIComponent(match[1]).toLowerCase();

  return (banners || []).find(
    (banner) => banner.slug && banner.slug.trim().toLowerCase() === slug
  );
}

// Button links may point at this site or another one. Anything that is not an
// http(s) URL or a path on this site, such as javascript:, is dropped.
export function safeUrl(value) {
  const url = (value || "").trim();
  return /^(https?:\/\/|\/(?!\/))/i.test(url) ? url : null;
}

// Builds what the banner shows. The title and description come from the list in
// Custom Topic Lists; the row only adds the accent color.
export function resolveBanner(url, banners, lists) {
  const row = findBanner(url, banners);
  if (!row) {
    return;
  }

  const slug = row.slug.trim().toLowerCase();
  const list = (lists || []).find((l) => l.slug?.trim().toLowerCase() === slug);

  return {
    title: list?.name || row.slug,
    description: list?.description,
    color: row.color,
    buttons: (row.buttons || []).flatMap((button) => {
      const href = safeUrl(button.url);
      return href && button.text ? [{ text: button.text, url: href }] : [];
    }),
  };
}

// Only hex values and plain color names are accepted, so the value is safe to
// place in a style attribute. Anything else falls back to the default accent.
export function safeColor(value) {
  const color = (value || "").trim();
  return COLOR_PATTERN.test(color) ? color : null;
}
