import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('rental', { path: '/rentals/:rental_id' });
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
});

export default Router;
