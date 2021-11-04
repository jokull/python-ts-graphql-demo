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

export type AddTaskResponse = Task;

export type Location = {
  __typename?: 'Location';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type LocationExists = {
  __typename?: 'LocationExists';
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
  locationName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  locations: Array<Location>;
  tasks: Array<Task>;
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID'];
  location?: Maybe<Location>;
  name: Scalars['String'];
};

export type TasksQueryVariables = Exact<{ [key: string]: never; }>;


export type TasksQuery = { __typename?: 'Query', tasks: Array<{ __typename?: 'Task', id: string, name: string, location?: { __typename?: 'Location', name: string } | null | undefined }> };

export type LocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type LocationsQuery = { __typename?: 'Query', locations: Array<{ __typename?: 'Location', id: string, name: string }> };

export type TaskFieldsFragment = { __typename?: 'Task', id: string, name: string, location?: { __typename?: 'Location', name: string } | null | undefined };

export type LocationFieldsFragment = { __typename?: 'Location', id: string, name: string };

export type AddTaskMutationVariables = Exact<{
  name: Scalars['String'];
  locationName: Scalars['String'];
}>;


export type AddTaskMutation = { __typename?: 'Mutation', addTask: { __typename: 'Task', id: string, name: string, location?: { __typename?: 'Location', name: string } | null | undefined } };

export type AddLocationMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type AddLocationMutation = { __typename?: 'Mutation', addLocation: { __typename: 'Location', id: string, name: string } | { __typename: 'LocationExists', message: string } };

export const TaskFieldsFragmentDoc = gql`
    fragment TaskFields on Task {
  id
  name
  location {
    name
  }
}
    `;
export const LocationFieldsFragmentDoc = gql`
    fragment LocationFields on Location {
  id
  name
}
    `;
export const TasksDocument = gql`
    query Tasks {
  tasks {
    ...TaskFields
  }
}
    ${TaskFieldsFragmentDoc}`;

export function useTasksQuery(options: Omit<Urql.UseQueryArgs<TasksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TasksQuery>({ query: TasksDocument, ...options });
};
export const LocationsDocument = gql`
    query Locations {
  locations {
    ...LocationFields
  }
}
    ${LocationFieldsFragmentDoc}`;

export function useLocationsQuery(options: Omit<Urql.UseQueryArgs<LocationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LocationsQuery>({ query: LocationsDocument, ...options });
};
export const AddTaskDocument = gql`
    mutation AddTask($name: String!, $locationName: String!) {
  addTask(name: $name, locationName: $locationName) {
    __typename
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
      ...LocationFields
    }
  }
}
    ${LocationFieldsFragmentDoc}`;

export function useAddLocationMutation() {
  return Urql.useMutation<AddLocationMutation, AddLocationMutationVariables>(AddLocationDocument);
};