import {objectType} from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('coverImage');
    t.string('slug');
    t.date('createdAt');
    t.field('Restaurant', {type: 'Restaurant'});
  },
});
