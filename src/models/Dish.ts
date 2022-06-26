import {Context} from '../context';
import {objectType} from 'nexus';

export const DishOptions = objectType({
  name: 'DishOptions',
  definition(t) {
    t.id('id');
    t.string('name');
    t.list.string('flavour');
    t.int('extraPrice');
    t.list.string('extraItems');
    t.field('size', {type: 'DishSize'});
    t.field('spiceLevel', {type: 'SpiceLevel'});
    t.list.field('OtherChoices', {type: 'JSONObject'});
  },
});
export const Dish = objectType({
  name: 'Dish',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('photo');
    t.string('description');
    t.int('price');
    t.date('createdAt');
    t.date('updatedAt');
    t.date('deletedAt');
    t.field('Restaurant', {type: 'Restaurant'});
    t.field('options', {type: 'DishOptions'});
    // t.field('order', {type:"Order"})
  },
});

// {
//   "data": {
//     "RestaurantId": "cl4k6gyc70014iokg0a4x2bxl",
//     "name": "Hot And Spicy Biryani",
//     "price": 200,
//     "photo": "www.photo.com",
//     "description": "This is new Level Of Awesomeness",
//     "flavour": "null",
//     "extraPrice": null,
//     "extraItems": null,
//     "size": null,
//     "spiceLevel": null,
//     "OtherChoices": null
//   }
// }
