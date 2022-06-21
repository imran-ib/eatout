/* eslint-disable jest/valid-expect */

import {CreateRestaurant, GetRestaurant} from './queries/Restaurants-queries';

import {GraphQLClient} from 'graphql-request';
import {PrismaClient} from '@prisma/client';
import {USER} from './User.tests';
import {UserLogin} from './queries';
import {getTestUtils} from '../testUtils';
import {testHost} from '../testSetup';

export function restaurant(): void {
  describe('RESTAURANTS', () => {
    let graphqlClient: GraphQLClient;
    let Restaurant;

    beforeEach(async () => {
      graphqlClient = new GraphQLClient(testHost);

      const Response = await graphqlClient.request(UserLogin, {
        email: USER.email,
        password: USER.password,
      });
      const token = Response.UserLogin.token;
      graphqlClient.setHeader('Authorization', `${token}`);
    });

    const RestaurantArgs = {
      data: {
        address: 'Main Street 124 New York',
        category: 'BBQ Eat Spice Here',
        name: 'Hot&Spicy',
        coverImage: 'https://someUrl.com',
      },
    };

    it('should create restaurant', async () => {
      const res = await graphqlClient.request(CreateRestaurant, RestaurantArgs);
      const CategoryName = RestaurantArgs.data.category.trim().toLowerCase();
      const CategorySlug = CategoryName.replace(/ /g, '-');

      expect(typeof CategoryName).toBe('string');
      expect(typeof CategorySlug).toBe('string');
      expect(res).toHaveProperty('CreateRestaurant');
      expect(res.CreateRestaurant).toHaveProperty('id');
      expect(res.CreateRestaurant).toHaveProperty('name');
      expect(res.CreateRestaurant).toHaveProperty('coverImage');
      expect(res.CreateRestaurant).toHaveProperty('address');
      Restaurant = res;
    });

    // it.todo('it should Find Restaurant', async () => {});
    it('it should Update Restaurant', async () => {
      const RestaurantId = Restaurant.CreateRestaurant.id;
    });
    // it.todo('it should Search for a  Restaurant', async () => {});
    // it.todo('it should Delete Restaurant', async () => {});
  });
}
