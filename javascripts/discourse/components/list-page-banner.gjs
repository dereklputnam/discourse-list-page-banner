import Component from "@glimmer/component";
import { service } from "@ember/service";
import { trustHTML } from "@ember/template";
import { findBanner, safeColor } from "../lib/list-banner";

export default class ListPageBanner extends Component {
  @service router;

  get banner() {
    return findBanner(this.router.currentURL);
  }

  get style() {
    const color = safeColor(this.banner?.color);
    return color ? trustHTML(`--category-color: ${color}`) : null;
  }

  <template>
    {{#if this.banner}}
      {{! custom-banner classes match the category banners already on the site }}
      <div class="list-page-banner custom-banner" style={{this.style}}>
        <div class="list-page-banner__content custom-banner__content">
          <div class="list-page-banner__location custom-banner__location">
            <h1 class="list-page-banner__title custom-banner__title">
              {{this.banner.title}}
            </h1>
          </div>
          {{#if this.banner.description}}
            <div class="list-page-banner__details custom-banner__details">
              {{this.banner.description}}
            </div>
          {{/if}}
        </div>
      </div>
    {{/if}}
  </template>
}
