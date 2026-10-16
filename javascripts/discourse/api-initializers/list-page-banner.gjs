import { apiInitializer } from "discourse/lib/api";
import ListPageBanner from "../components/list-page-banner";
import { findBanner, isCustomListPage } from "../lib/list-banner";

export default apiInitializer((api) => {
  api.renderInOutlet("above-main-container", ListPageBanner);

  document.body.classList.toggle(
    "hides-custom-lists-dropdown",
    !!settings.hide_custom_lists_dropdown
  );

  api.onPageChange((url) => {
    document.body.classList.toggle(
      "is-custom-list-page",
      isCustomListPage(url)
    );
    document.body.classList.toggle("has-list-page-banner", !!findBanner(url));
  });
});
