import { resolvers } from './index';
import { Control } from '../models/Control';
import { Owner } from '../models/Owner';
import { Task } from '../models/Task';
import { GraphQLError } from 'graphql';

jest.mock('../models/Control');
jest.mock('../models/Owner');
jest.mock('../models/Task');

const mockControl = jest.mocked(Control);
const mockOwner = jest.mocked(Owner);
const mockTask = jest.mocked(Task);

beforeEach(() => jest.clearAllMocks());

// ─── updateControlStatus ────────────────────────────────────────────────────

describe('updateControlStatus', () => {
  it('returns the updated control with the new status', async () => {
    const updated = { _id: 'ctrl1', title: 'Access Review', status: 'PASSING' };
    mockControl.findByIdAndUpdate.mockResolvedValue(updated as never);

    const result = await resolvers.Mutation.updateControlStatus(undefined, {
      input: { id: 'ctrl1', status: 'PASSING' },
    });

    expect(result).toEqual(updated);
    expect(mockControl.findByIdAndUpdate).toHaveBeenCalledWith(
      'ctrl1',
      { status: 'PASSING' },
      { new: true }
    );
  });

  it('throws GraphQLError when the control does not exist', async () => {
    mockControl.findByIdAndUpdate.mockResolvedValue(null as never);

    await expect(
      resolvers.Mutation.updateControlStatus(undefined, {
        input: { id: 'missing', status: 'FAILING' },
      })
    ).rejects.toThrow(GraphQLError);
  });
});

// ─── tasksByControl ─────────────────────────────────────────────────────────

describe('tasksByControl', () => {
  it('queries by controlId and returns matching tasks', async () => {
    const tasks = [
      { _id: 't1', notes: 'First task', completed: false },
      { _id: 't2', notes: 'Second task', completed: true },
    ];
    mockTask.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(tasks) } as never);

    const result = await resolvers.Query.tasksByControl(undefined, { controlId: 'ctrl1' });

    expect(mockTask.find).toHaveBeenCalledWith({ control: 'ctrl1' });
    expect(result).toEqual(tasks);
  });
});

// ─── createTask ─────────────────────────────────────────────────────────────

describe('createTask', () => {
  it('throws GraphQLError when the owner does not exist', async () => {
    mockControl.findById.mockResolvedValue({ _id: 'ctrl1', title: 'Access Review' } as never);
    mockOwner.findById.mockResolvedValue(null as never);

    await expect(
      resolvers.Mutation.createTask(undefined, {
        input: {
          controlId: 'ctrl1',
          ownerId: 'ghost',
          dueDate: new Date('2026-04-01'),
        },
      })
    ).rejects.toThrow(GraphQLError);
  });

  it('throws GraphQLError when the control does not exist', async () => {
    mockControl.findById.mockResolvedValue(null as never);
    mockOwner.findById.mockResolvedValue({ _id: 'owner1', name: 'Alice' } as never);

    await expect(
      resolvers.Mutation.createTask(undefined, {
        input: {
          controlId: 'missing',
          ownerId: 'owner1',
          dueDate: new Date('2026-04-01'),
        },
      })
    ).rejects.toThrow(GraphQLError);
  });
});
