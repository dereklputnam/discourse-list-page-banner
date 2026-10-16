# List Page Banner

A Discourse theme component that adds a banner to pages created with [Discourse Custom Topic Lists](https://meta.discourse.org/t/discourse-custom-topic-lists/311186), and can hide the Custom Lists dropdown everywhere else.

It started from [netwrix-modifications-for-solutions](https://github.com/dereklputnam/netwrix-modifications-for-solutions), which patched the page with scripts. This version renders the banner as a real component and uses CSS for the rest.

## Requirements

- Custom Topic Lists, which creates the `/lists/<slug>` pages.

## Settings

### `list_banners`

One row per list that should show a banner.

| Field        | Description                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| List slug    | The slug as set in Custom Topic Lists, for example `events` for `/lists/events`. Matched exactly, ignoring case. |
| Title        | Heading shown in the banner.                                                                                     |
| Description  | Optional text under the title.                                                                                   |
| Accent color | Optional color of the banner's top border: a hex value like `#0073e6` or a color name. Defaults to blue.         |

A list with a banner shows it in place of the plugin's own title header, which is hidden on that page. Lists themselves, including which topics they show, stay managed in Custom Topic Lists.

### `hide_custom_lists_dropdown`

Hides the Custom Lists dropdown in the navigation breadcrumb everywhere except on list pages. On by default.

## How it works

- The banner renders in the `above-main-container-outlet` and only appears when the current URL is `/lists/<slug>` for a row in `list_banners`.
- Body classes drive the CSS: `is-custom-list-page` on any `/lists/` page and `has-list-page-banner` on pages with a banner.
- The banner's look follows the tag page banners on the community: centered title in a padded box with a colored top border.

## Tests

`test/unit/lib/list-banner-test.js` covers URL and slug matching and the color check. It runs as part of the theme's QUnit suite.

## License

MIT. See [LICENSE](LICENSE).
