import Component from "@glimmer/component";
import { service } from "@ember/service";
import { trustHTML } from "@ember/template";
import DCookText from "discourse/ui-kit/d-cook-text";
import { resolveBanner, safeColor } from "../lib/list-banner";

export default class ListPageBanner extends Component {
  @service router;
  @service site;

  get banner() {
    return resolveBanner(
      this.router.currentURL,
      settings.list_banners,
      this.site.custom_topic_lists
    );
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
          {{#if this.banner.buttons.length}}
            <div class="list-page-banner__buttons custom-banner__buttons">
              {{#each this.banner.buttons as |button|}}
                <a
                  class="btn btn-primary"
                  href={{button.url}}
                >{{button.text}}</a>
              {{/each}}
            </div>
          {{/if}}
          {{#if this.banner.description}}
            <div class="list-page-banner__details custom-banner__details">
              <DCookText @rawText={{this.banner.description}} />
            </div>
          {{/if}}
        </div>
      </div>
    {{/if}}
  </template>
}
