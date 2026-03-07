import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Control = {
  __typename?: 'Control';
  category: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: ControlStatus;
  title: Scalars['String']['output'];
};

export type ControlStatus =
  | 'FAILING'
  | 'PASSING'
  | 'UNKNOWN';

export type CreateControlInput = {
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateOwnerInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateTaskInput = {
  controlId: Scalars['ID']['input'];
  dueDate: Scalars['DateTime']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  ownerId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  completeTask: Task;
  createControl: Control;
  createOwner: Owner;
  createTask: Task;
  updateControlStatus: Control;
};


export type MutationCompleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateControlArgs = {
  input: CreateControlInput;
};


export type MutationCreateOwnerArgs = {
  input: CreateOwnerInput;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationUpdateControlStatusArgs = {
  input: UpdateControlStatusInput;
};

export type Owner = {
  __typename?: 'Owner';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  control?: Maybe<Control>;
  controls: Array<Control>;
  owners: Array<Owner>;
  tasks: Array<Task>;
  tasksByControl: Array<Task>;
};


export type QueryControlArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTasksByControlArgs = {
  controlId: Scalars['ID']['input'];
};

export type Task = {
  __typename?: 'Task';
  completed: Scalars['Boolean']['output'];
  control: Control;
  dueDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  owner: Owner;
};

export type UpdateControlStatusInput = {
  id: Scalars['ID']['input'];
  status: ControlStatus;
};

export type UpdateControlStatusMutationVariables = Exact<{
  input: UpdateControlStatusInput;
}>;


export type UpdateControlStatusMutation = { __typename?: 'Mutation', updateControlStatus: { __typename?: 'Control', id: string, status: ControlStatus } };

export type CreateControlMutationVariables = Exact<{
  input: CreateControlInput;
}>;


export type CreateControlMutation = { __typename?: 'Mutation', createControl: { __typename?: 'Control', id: string, title: string, description?: string | null, category: string, status: ControlStatus } };

export type CompleteTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CompleteTaskMutation = { __typename?: 'Mutation', completeTask: { __typename?: 'Task', id: string, completed: boolean } };

export type GetControlsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetControlsQuery = { __typename?: 'Query', controls: Array<{ __typename?: 'Control', id: string, title: string, description?: string | null, category: string, status: ControlStatus }> };

export type GetTasksByControlQueryVariables = Exact<{
  controlId: Scalars['ID']['input'];
}>;


export type GetTasksByControlQuery = { __typename?: 'Query', tasksByControl: Array<{ __typename?: 'Task', id: string, notes?: string | null, completed: boolean, dueDate: any, owner: { __typename?: 'Owner', id: string, name: string, email: string } }> };


export const UpdateControlStatusDocument = gql`
    mutation UpdateControlStatus($input: UpdateControlStatusInput!) {
  updateControlStatus(input: $input) {
    id
    status
  }
}
    `;
export type UpdateControlStatusMutationFn = Apollo.MutationFunction<UpdateControlStatusMutation, UpdateControlStatusMutationVariables>;

/**
 * __useUpdateControlStatusMutation__
 *
 * To run a mutation, you first call `useUpdateControlStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateControlStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateControlStatusMutation, { data, loading, error }] = useUpdateControlStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateControlStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateControlStatusMutation, UpdateControlStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateControlStatusMutation, UpdateControlStatusMutationVariables>(UpdateControlStatusDocument, options);
      }
export type UpdateControlStatusMutationHookResult = ReturnType<typeof useUpdateControlStatusMutation>;
export type UpdateControlStatusMutationResult = Apollo.MutationResult<UpdateControlStatusMutation>;
export type UpdateControlStatusMutationOptions = Apollo.BaseMutationOptions<UpdateControlStatusMutation, UpdateControlStatusMutationVariables>;
export const CreateControlDocument = gql`
    mutation CreateControl($input: CreateControlInput!) {
  createControl(input: $input) {
    id
    title
    description
    category
    status
  }
}
    `;
export type CreateControlMutationFn = Apollo.MutationFunction<CreateControlMutation, CreateControlMutationVariables>;

/**
 * __useCreateControlMutation__
 *
 * To run a mutation, you first call `useCreateControlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateControlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createControlMutation, { data, loading, error }] = useCreateControlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateControlMutation(baseOptions?: Apollo.MutationHookOptions<CreateControlMutation, CreateControlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateControlMutation, CreateControlMutationVariables>(CreateControlDocument, options);
      }
export type CreateControlMutationHookResult = ReturnType<typeof useCreateControlMutation>;
export type CreateControlMutationResult = Apollo.MutationResult<CreateControlMutation>;
export type CreateControlMutationOptions = Apollo.BaseMutationOptions<CreateControlMutation, CreateControlMutationVariables>;
export const CompleteTaskDocument = gql`
    mutation CompleteTask($id: ID!) {
  completeTask(id: $id) {
    id
    completed
  }
}
    `;
export type CompleteTaskMutationFn = Apollo.MutationFunction<CompleteTaskMutation, CompleteTaskMutationVariables>;

/**
 * __useCompleteTaskMutation__
 *
 * To run a mutation, you first call `useCompleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeTaskMutation, { data, loading, error }] = useCompleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCompleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<CompleteTaskMutation, CompleteTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteTaskMutation, CompleteTaskMutationVariables>(CompleteTaskDocument, options);
      }
export type CompleteTaskMutationHookResult = ReturnType<typeof useCompleteTaskMutation>;
export type CompleteTaskMutationResult = Apollo.MutationResult<CompleteTaskMutation>;
export type CompleteTaskMutationOptions = Apollo.BaseMutationOptions<CompleteTaskMutation, CompleteTaskMutationVariables>;
export const GetControlsDocument = gql`
    query GetControls {
  controls {
    id
    title
    description
    category
    status
  }
}
    `;

/**
 * __useGetControlsQuery__
 *
 * To run a query within a React component, call `useGetControlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetControlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetControlsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetControlsQuery(baseOptions?: Apollo.QueryHookOptions<GetControlsQuery, GetControlsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetControlsQuery, GetControlsQueryVariables>(GetControlsDocument, options);
      }
export function useGetControlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetControlsQuery, GetControlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetControlsQuery, GetControlsQueryVariables>(GetControlsDocument, options);
        }
// @ts-ignore
export function useGetControlsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetControlsQuery, GetControlsQueryVariables>): Apollo.UseSuspenseQueryResult<GetControlsQuery, GetControlsQueryVariables>;
export function useGetControlsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetControlsQuery, GetControlsQueryVariables>): Apollo.UseSuspenseQueryResult<GetControlsQuery | undefined, GetControlsQueryVariables>;
export function useGetControlsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetControlsQuery, GetControlsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetControlsQuery, GetControlsQueryVariables>(GetControlsDocument, options);
        }
export type GetControlsQueryHookResult = ReturnType<typeof useGetControlsQuery>;
export type GetControlsLazyQueryHookResult = ReturnType<typeof useGetControlsLazyQuery>;
export type GetControlsSuspenseQueryHookResult = ReturnType<typeof useGetControlsSuspenseQuery>;
export type GetControlsQueryResult = Apollo.QueryResult<GetControlsQuery, GetControlsQueryVariables>;
export const GetTasksByControlDocument = gql`
    query GetTasksByControl($controlId: ID!) {
  tasksByControl(controlId: $controlId) {
    id
    notes
    completed
    dueDate
    owner {
      id
      name
      email
    }
  }
}
    `;

/**
 * __useGetTasksByControlQuery__
 *
 * To run a query within a React component, call `useGetTasksByControlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTasksByControlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTasksByControlQuery({
 *   variables: {
 *      controlId: // value for 'controlId'
 *   },
 * });
 */
export function useGetTasksByControlQuery(baseOptions: Apollo.QueryHookOptions<GetTasksByControlQuery, GetTasksByControlQueryVariables> & ({ variables: GetTasksByControlQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTasksByControlQuery, GetTasksByControlQueryVariables>(GetTasksByControlDocument, options);
      }
export function useGetTasksByControlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTasksByControlQuery, GetTasksByControlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTasksByControlQuery, GetTasksByControlQueryVariables>(GetTasksByControlDocument, options);
        }
// @ts-ignore
export function useGetTasksByControlSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTasksByControlQuery, GetTasksByControlQueryVariables>): Apollo.UseSuspenseQueryResult<GetTasksByControlQuery, GetTasksByControlQueryVariables>;
export function useGetTasksByControlSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTasksByControlQuery, GetTasksByControlQueryVariables>): Apollo.UseSuspenseQueryResult<GetTasksByControlQuery | undefined, GetTasksByControlQueryVariables>;
export function useGetTasksByControlSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTasksByControlQuery, GetTasksByControlQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTasksByControlQuery, GetTasksByControlQueryVariables>(GetTasksByControlDocument, options);
        }
export type GetTasksByControlQueryHookResult = ReturnType<typeof useGetTasksByControlQuery>;
export type GetTasksByControlLazyQueryHookResult = ReturnType<typeof useGetTasksByControlLazyQuery>;
export type GetTasksByControlSuspenseQueryHookResult = ReturnType<typeof useGetTasksByControlSuspenseQuery>;
export type GetTasksByControlQueryResult = Apollo.QueryResult<GetTasksByControlQuery, GetTasksByControlQueryVariables>;