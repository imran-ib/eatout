import {objectType} from 'nexus';

export const PageCountInput = objectType({
  name: 'PageCountInput',
  definition(t) {
    t.int('TotalCount');
    t.int('PageCount');
  },
});
