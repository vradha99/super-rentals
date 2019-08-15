import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

function factory(attributes) {
  return {
    id: 'grand-old-mansion',
    title: 'Grand Old Mansion',
    owner: 'Veruca Salt',
    city: 'San Francisco',
    location: {
      lat: 37.7749,
      lng: -122.4194
    },
    category: 'Estate',
    bedrooms: 15,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
    description: 'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    ...attributes
  };
}

module('Integration | Component | rentals-search', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.results = () => {
      return findAll('.result').map(result => result.textContent);
    };
  });

  test('it can handle empty data', async function(assert) {
    this.setProperties({
      rentals: []
    });

    await render(hbs`
      <RentalsSearch @rentals={{this.rentals}} as |results|>
        {{#each results as |result|}}
          <span class="result">{{result.title}}</span>
        {{/each}}
      </RentalsSearch>
    `);

    assert.deepEqual(this.results(), []);

    await fillIn('input', 'Grand');

    assert.deepEqual(this.results(), []);
  });

  test('it updates the results according to the search query', async function(assert) {
    this.setProperties({
      rentals: [
        factory({ id: 'grand-old-mansion', title: 'Grand Old Mansion' }),
        factory({ id: 'grand-old-villa', title: 'Grand Old Villa' }),
        factory({ id: 'old-grand-house', title: 'Old Grand House' }),
        factory({ id: 'granpas-mansion', title: "Grandpa's Mansion" }),
        factory({ id: 'urban-living', title: 'Urban Living' }),
        factory({ id: 'downtown-charm', title: 'Downtown Charm' })
      ]
    });

    await render(hbs`
      <RentalsSearch @rentals={{this.rentals}} as |results|>
        {{#each results as |result|}}
          <span class="result">{{result.title}}</span>
        {{/each}}
      </RentalsSearch>
    `);

    assert.deepEqual(this.results(), [
      'Grand Old Mansion',
      'Grand Old Villa',
      'Old Grand House',
      "Grandpa's Mansion",
      'Urban Living',
      'Downtown Charm'
    ]);

    await fillIn('input', 'Grand');

    assert.deepEqual(this.results(), [
      'Grand Old Mansion',
      'Grand Old Villa',
      'Old Grand House',
      "Grandpa's Mansion"
    ]);

    await fillIn('input', 'Grand Old');

    assert.deepEqual(this.results(), [
      'Grand Old Mansion',
      'Grand Old Villa'
    ]);

    await fillIn('input', 'Grand Old Villa');

    assert.deepEqual(this.results(), [
      'Grand Old Villa'
    ]);

    await fillIn('input', 'Grand Old Village');

    assert.deepEqual(this.results(), []);

    await fillIn('input', '');

    assert.deepEqual(this.results(), [
      'Grand Old Mansion',
      'Grand Old Villa',
      'Old Grand House',
      "Grandpa's Mansion",
      'Urban Living',
      'Downtown Charm'
    ]);
  });
});
