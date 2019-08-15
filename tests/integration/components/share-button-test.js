import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import Service from '@ember/service';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

class MockRouterService extends Service {
  get currentURL() {
    return '/foo/bar/baz?some=page#anchor';
  }
}

module('Integration | Component | share-button', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:router', MockRouterService);

    this.getShareURL = () => {
      let { href } = find('a');
      return new URL(href);
    };

    this.getShareParam = param => {
      let { searchParams } = this.getShareURL();
      return searchParams.get(param);
    };
  });

  test('basic usage', async function(assert) {
    await render(hbs`<ShareButton>Tweet this!</ShareButton>`);

    assert.dom('a').exists();
    assert.dom('a').hasAttribute('target', '_blank');
    assert.dom('a').hasAttribute('rel', 'external,nofollow,noopener,noreferrer');
    assert.dom('a').hasAttribute('href');
    assert.dom('a').hasClass('share');
    assert.dom('a').hasClass('button');
    assert.dom('a').containsText('Tweet this!');

    let currentURL = new URL('/foo/bar/baz?some=page#anchor', window.location.origin);
    let { origin, pathname } = this.getShareURL();

    assert.equal(origin, 'https://twitter.com');
    assert.equal(pathname, '/intent/tweet');
    assert.equal(this.getShareParam('url'), currentURL.toString());
  });

  test('it supports passing @text', async function(assert) {
    await render(hbs`<ShareButton @text="Hello Twitter!">Tweet this!</ShareButton>`);
    assert.equal(this.getShareParam('text'), 'Hello Twitter!');
  });

  test('it supports passing @hashtags', async function(assert) {
    await render(hbs`<ShareButton @hashtags="foo,bar,baz">Tweet this!</ShareButton>`);
    assert.equal(this.getShareParam('hashtags'), 'foo,bar,baz');
  });

  test('it supports passing @via', async function(assert) {
    await render(hbs`<ShareButton @via="emberjs">Tweet this!</ShareButton>`);
    assert.equal(this.getShareParam('via'), 'emberjs');
  });

  test('it supports adding extra classes', async function(assert) {
    await render(hbs`<ShareButton class="extra things">Tweet this!</ShareButton>`);

    assert.dom('a').hasClass('share');
    assert.dom('a').hasClass('button');
    assert.dom('a').hasClass('extra');
    assert.dom('a').hasClass('things');
  });

  test('the target, rel and href attributes cannot be overriden', async function(assert) {
    await render(hbs`<ShareButton targe="_self" rel="" href="/">Not a Tweet!</ShareButton>`);

    assert.dom('a').hasAttribute('target', '_blank');
    assert.dom('a').hasAttribute('rel', 'external,nofollow,noopener,noreferrer');
    assert.equal(this.getShareURL().origin, 'https://twitter.com');
  });
});
