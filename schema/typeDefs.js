import { gql } from "apollo-server";

const typeDefs = gql`
  type Student {
    id: ID!
    name: String!
    email: String!
    age: Int!
    major: String
  }

  type Course {
    id: ID!
    title: String!
    code: String!
    credits: Int!
    instructor: String!
  }

  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    students: [Student!]!
    student(id: ID!): Student
    courses: [Course!]!
    course(id: ID!): Course
  }

  input StudentInput {
    name: String!
    email: String!
    age: Int!
    major: String
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    addStudent(input: StudentInput!): Student!
    updateStudent(
      id: ID!
      name: String
      email: String
      age: Int
      major: String
    ): Student!
    deleteStudent(id: ID!): Boolean!

    addCourse(
      title: String!
      code: String!
      credits: Int!
      instructor: String!
    ): Course!
    updateCourse(
      id: ID!
      title: String
      code: String
      credits: Int
      instructor: String
    ): Course!
    deleteCourse(id: ID!): Boolean!
  }
`;

export default typeDefs;
