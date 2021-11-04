import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddLocationResponse = Location | LocationExists;

export type AddTaskResponse = LocationNotFound | Task;

export type Location = {
  __typename?: 'Location';
  name: Scalars['String'];
};

export type LocationExists = {
  __typename?: 'LocationExists';
  message: Scalars['String'];
};

export type LocationNotFound = {
  __typename?: 'LocationNotFound';
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addLocation: AddLocationResponse;
  addTask: AddTaskResponse;
};


export type MutationAddLocationArgs = {
  name: Scalars['String'];
};


export type MutationAddTaskArgs = {
  locationName: Scalars['String'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  tasks: Array<Task>;
};

export type Task = {
  __typename?: 'Task';
  location?: Maybe<Location>;
  name: Scalars['String'];
};

export type GetTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTasksQuery = { __typename?: 'Query', tasks: Array<{ __typename?: 'Task', name: string, location?: { __typename?: 'Location', name: string } | null | undefined }> };

export type TaskFieldsFragment = { __typename?: 'Task', name: string, location?: { __typename?: 'Location', name: string } | null | undefined };

export type AddTaskMutationVariables = Exact<{
  name: Scalars['String'];
  locationName: Scalars['String'];
}>;


export type AddTaskMutation = { __typename?: 'Mutation', addTask: { __typename: 'LocationNotFound', message: string } | { __typename: 'Task', name: string, location?: { __typename?: 'Location', name: string } | null | undefined } };

export type AddLocationMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type AddLocationMutation = { __typename?: 'Mutation', addLocation: { __typename: 'Location', name: string } | { __typename: 'LocationExists', message: string } };

export const TaskFieldsFragmentDoc = gql`
    fragment TaskFields on Task {
  name
  location {
    name
  }
}
    `;
export const GetTasksDocument = gql`
    query getTasks {
  tasks {
    ...TaskFields
  }
}
    ${TaskFieldsFragmentDoc}`;

export function useGetTasksQuery(options: Omit<Urql.UseQueryArgs<GetTasksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetTasksQuery>({ query: GetTasksDocument, ...options });
};
export const AddTaskDocument = gql`
    mutation AddTask($name: String!, $locationName: String!) {
  addTask(name: $name, locationName: $locationName) {
    __typename
    ... on LocationNotFound {
      __typename
      message
    }
    ... on Task {
      __typename
      ...TaskFields
    }
  }
}
    ${TaskFieldsFragmentDoc}`;

export function useAddTaskMutation() {
  return Urql.useMutation<AddTaskMutation, AddTaskMutationVariables>(AddTaskDocument);
};
export const AddLocationDocument = gql`
    mutation AddLocation($name: String!) {
  addLocation(name: $name) {
    __typename
    ... on LocationExists {
      __typename
      message
    }
    ... on Location {
      __typename
      name
    }
  }
}
    `;

export function useAddLocationMutation() {
  return Urql.useMutation<AddLocationMutation, AddLocationMutationVariables>(AddLocationDocument);
};