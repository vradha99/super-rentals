import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

const TWEET_INTENT = 'https://twitter.com/intent/tweet';

export default class ShareButtonComponent extends Component {
  @service router;

  get currentURL() {
    let base = window.location.origin;
    return new URL(this.router.currentURL, base);
  }

  get shareURL() {
    let url = new URL(TWEET_INTENT);
    let { searchParams } = url;

    searchParams.set('url', this.currentURL);

    if (this.args.text) {
      searchParams.set('text', this.args.text);
    }

    if (this.args.hashtags) {
      searchParams.set('hashtags', this.args.hashtags);
    }

    if (this.args.via) {
      searchParams.set('via', this.args.via);
    }

    return url;
  }
}
