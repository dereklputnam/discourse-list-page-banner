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
    return color ? trustHTML(`--list-page-banner-accent: ${color}`) : null;
  }

  <template>
    {{#if this.banner}}
      <div class="list-page-banner" style={{this.style}}>
        <h1 class="list-page-banner__title">{{this.banner.title}}</h1>
        {{#if this.banner.description}}
          <p class="list-page-banner__description">
            {{this.banner.description}}
          </p>
        {{/if}}
      </div>
    {{/if}}
  </template>
}
