import gql from 'graphql-tag';

export const CreateUser = /* GraphQL */ `
  mutation CreateUser(
    $password: String!
    $email: String!
    $name: String
    $role: RoleInput
  ) {
    CreateUser(password: $password, email: $email, name: $name, role: $role) {
      id
      email
      name
    }
  }
`;

export const UserLogin = /* GraphQL */ `
  mutation UserLogin($email: String!, $password: String!) {
    UserLogin(email: $email, password: $password) {
      token
      User {
        id
        email
        name
      }
    }
  }
`;

export const UpdateProfile = /* GraphQL */ `
  mutation UpdateProfile(
    $updateProfileId: String!
    $email: String
    $password: String
    $name: String
    $role: RoleInput
  ) {
    UpdateProfile(
      id: $updateProfileId
      email: $email
      password: $password
      name: $name
      role: $role
    ) {
      id
      email
    }
  }
`;

export const VerifyEmail = /* Graphql */ `
mutation VerifyEmail($code: String!) {
  VerifyEmail(code: $code)
}
`;

export const SingleUser = /* GraphQL */ `
  query SingleUser($userId: String, $email: String) {
    SingleUser(userId: $userId, email: $email) {
      id
      email
      name
      IsVerified
      role
    }
  }
`;
export const CurrentUser = /* GraphQL */ `
  query CurrentUser {
    CurrentUser {
      id
      email
      name
      IsVerified
      role
    }
  }
`;

// export const createDraftMutation = /* GraphQL */ `;
//   mutation createDraft($title: String!, $content: String!) {
//     createDraft(title: $title, content: $content) {
//       id
//       title
//     }
//   }
// `;

// export const publishMutation = /* GraphQL */ `
//   mutation publish($id: Int!) {
//     publish(id: $id) {
//       id
//       title
//     }
//   }
// `;

// export const deletePostMutation = /* GraphQL */ `
//   mutation deletePost($id: Int!) {
//     deletePost(id: $id) {
//       id
//     }
//   }
// `;

// export const feedQuery = /* GraphQL */ `
//   query feed {
//     feed {
//       id
//       title
//     }
//   }
// `;

// export const filterPostsQuery = /* GraphQL */ `
//   query filterPosts($searchString: String!) {
//     filterPosts(searchString: $searchString) {
//       id
//       title
//     }
//   }
// `;

// export const postQuery = /* GraphQL */ `
//   query post($id: Int!) {
//     post(id: $id) {
//       id
//       title
//     }
//   }
// `;

// export const userUpdatedSubscription = gql`
//   subscription userUpdated($userId: String!) {
//     userUpdated(userId: $userId) {
//       id
//       email
//       name
//       gender
//     }
//   }
// `;

// export const userSignedInSubscription = gql`
//   subscription userSignedIn($userId: String!) {
//     userSignedIn(userId: $userId) {
//       id
//       email
//       name
//       gender
//       createdAt
//     }
//   }
// `;
