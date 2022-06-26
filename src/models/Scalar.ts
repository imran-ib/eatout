import {asNexusMethod, enumType, scalarType} from 'nexus';

import {GraphQLDateTime} from 'graphql-iso-date';
import {GraphQLUpload} from 'graphql-upload';
import {JSONObjectResolver} from 'graphql-scalars';

export const AuthType = enumType({
  name: 'AuthType',
  members: ['Email', 'Facebook', 'Google', 'Apple'],
});

enum GenderType {
  male = 'male',
  female = 'female',
}

export const ROLE = enumType({
  name: 'Role',
  members: ['CLIENT', 'OWNER', 'DELIVERY'],
  asNexusMethod: 'role',
});

export const SPICE_LEVEL = enumType({
  name: 'SpiceLevel',
  members: ['LOW', 'MEDIUM', 'HIGH', 'KILL_ME'],
  asNexusMethod: 'role',
});

export const DISH_SIZE = enumType({
  name: 'DishSize',
  members: ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
  asNexusMethod: 'role',
});

export const ORDER_STATUS = enumType({
  name: 'OrderStatus',
  members: ['PENDING', 'COOKING', 'PICKED_UP', 'DELIVERED'],
  asNexusMethod: 'role',
});

export const Gender = scalarType({
  name: 'Gender',
  asNexusMethod: 'gender',
  parseValue(value: GenderType): GenderType | undefined {
    if (GenderType[value]) {
      return value;
    }
  },
  serialize(value) {
    return value;
  },
});

export const Upload = GraphQLUpload;
export const DateTime = asNexusMethod(GraphQLDateTime, 'date');
export const jsonScalar = asNexusMethod(JSONObjectResolver, 'json');
