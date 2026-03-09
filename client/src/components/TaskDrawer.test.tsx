import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TaskDrawer from '@/components/TaskDrawer';
import { GetTasksByControlDocument } from '@/graphql/__generated__/types';

// Midday UTC avoids date shifting across timezone boundaries
const DUE_DATE = '2026-04-15T12:00:00.000Z';
const FORMATTED_DATE = new Date(DUE_DATE).toLocaleDateString();

const mocks = [
  {
    request: {
      query: GetTasksByControlDocument,
      variables: { controlId: 'ctrl1' },
    },
    result: {
      data: {
        tasksByControl: [
          {
            __typename: 'Task',
            id: 't1',
            notes: 'Review access logs',
            completed: false,
            dueDate: DUE_DATE,
            owner: {
              __typename: 'Owner',
              id: 'o1',
              name: 'Alice',
              email: 'alice@example.com',
            },
          },
        ],
      },
    },
  },
];

describe('TaskDrawer', () => {
  it('renders task notes and owner name after query resolves', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TaskDrawer controlId="ctrl1" onClose={() => {}} />
      </MockedProvider>
    );

    expect(await screen.findByText('Review access logs')).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it('renders due date for each task', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TaskDrawer controlId="ctrl1" onClose={() => {}} />
      </MockedProvider>
    );

    expect(await screen.findByText(new RegExp(FORMATTED_DATE))).toBeInTheDocument();
  });

  it('does not render the drawer when controlId is not provided', () => {
    render(
      <MockedProvider mocks={[]}>
        <TaskDrawer onClose={() => {}} />
      </MockedProvider>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
