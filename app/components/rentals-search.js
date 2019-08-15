import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class RentalsSearchComponent extends Component {
  @tracked query = '';

  get results() {
    let results = this.args.rentals;
    let { query } = this;

    if (query) {
      results = results.filter(rental => rental.title.includes(query));
    }

    return results;
  }
}
