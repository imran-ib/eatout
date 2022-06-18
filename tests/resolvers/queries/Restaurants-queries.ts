export const CreateRestaurant = /* GraphQL */ `
  mutation CreateRestaurant($data: CreateRestaurantInput!) {
    CreateRestaurant(data: $data) {
      id
      name
      coverImage
      address
      owner {
        id
      }
      category {
        name
      }
    }
  }
`;

export const DeleteRestaurant = /* GraphQL */ `
  mutation DeleteRestaurant($deleteRestaurantId: String!) {
    DeleteRestaurant(id: $deleteRestaurantId)
  }
`;
export const GetRestaurant = /* GraphQL */ `
  query GetRestaurant($getRestaurantId: String!) {
    GetRestaurant(id: $getRestaurantId) {
      id
      name
      name
      address
    }
  }
`;
