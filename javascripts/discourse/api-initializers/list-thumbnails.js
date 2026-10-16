import { apiInitializer } from "discourse/lib/api";
import { findBannerBySlug, thumbnailMode } from "../lib/list-banner";

export default apiInitializer((api) => {
  // The Topic List Thumbnails theme reads customThumbnailMode from the current
  // route's metadata. The getter picks the mode of whichever list is open.
  api.modifyClass("route:list", {
    pluginId: "list-page-banner",

    buildRouteInfoMetadata() {
      const router = this.router;

      return {
        get customThumbnailMode() {
          const slug = router.currentRoute?.params?.topicListName;
          return thumbnailMode(findBannerBySlug(slug));
        },
      };
    },
  });
});
