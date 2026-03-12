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
    mockControl.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) } as never);

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
    mockControl.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as never);

    await expect(
      resolvers.Mutation.updateControlStatus(undefined, {
        input: { id: 'missing', status: 'FAILING' },
      })
    ).rejects.toThrow(GraphQLError);
  });
});

// ─── updateControl ───────────────────────────────────────────────────────────

describe('updateControl', () => {
  it('returns the updated control with all fields applied', async () => {
    const updated = { _id: 'ctrl1', title: 'New Title', category: 'Access', status: 'PASSING' };
    mockControl.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) } as never);

    const result = await resolvers.Mutation.updateControl(undefined, {
      input: { id: 'ctrl1', title: 'New Title', category: 'Access', status: 'PASSING' },
    });

    expect(result).toEqual(updated);
  });

  it('throws GraphQLError when the control does not exist', async () => {
    mockControl.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as never);

    await expect(
      resolvers.Mutation.updateControl(undefined, {
        input: { id: 'missing', title: 'x', category: 'x', status: 'UNKNOWN' },
      })
    ).rejects.toThrow(GraphQLError);
  });
});

// ─── deleteControl ───────────────────────────────────────────────────────────

describe('deleteControl', () => {
  it('cascades to tasks and returns the deleted id', async () => {
    const control = { _id: 'ctrl1', title: 'Old Control' };
    mockControl.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(control) } as never);
    mockTask.deleteMany.mockReturnValue({ exec: jest.fn().mockResolvedValue({ deletedCount: 2 }) } as never);
    mockControl.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(control) } as never);

    const result = await resolvers.Mutation.deleteControl(undefined, { id: 'ctrl1' });

    expect(mockTask.deleteMany).toHaveBeenCalledWith({ control: 'ctrl1' });
    expect(result).toBe('ctrl1');
  });

  it('throws GraphQLError when the control does not exist', async () => {
    mockControl.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as never);

    await expect(
      resolvers.Mutation.deleteControl(undefined, { id: 'missing' })
    ).rejects.toThrow(GraphQLError);
  });
});

// ─── deleteOwner ─────────────────────────────────────────────────────────────

describe('deleteOwner', () => {
  it('cascades to tasks and returns the deleted id', async () => {
    const owner = { _id: 'owner1', name: 'Alice' };
    mockOwner.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(owner) } as never);
    mockTask.deleteMany.mockReturnValue({ exec: jest.fn().mockResolvedValue({ deletedCount: 2 }) } as never);
    mockOwner.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(owner) } as never);

    const result = await resolvers.Mutation.deleteOwner(undefined, { id: 'owner1' });

    expect(mockTask.deleteMany).toHaveBeenCalledWith({ owner: 'owner1' });
    expect(result).toBe('owner1');
  });

  it('throws GraphQLError when the owner does not exist', async () => {
    mockOwner.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as never);

    await expect(
      resolvers.Mutation.deleteOwner(undefined, { id: 'missing' })
    ).rejects.toThrow(GraphQLError);
  });
});

// ─── deleteTask ──────────────────────────────────────────────────────────────

describe('deleteTask', () => {
  it('deletes the task and returns its id', async () => {
    const task = { _id: 'task1', description: 'Do something' };
    mockTask.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(task) } as never);

    const result = await resolvers.Mutation.deleteTask(undefined, { id: 'task1' });

    expect(result).toBe('task1');
  });

  it('throws GraphQLError when the task does not exist', async () => {
    mockTask.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as never);

    await expect(
      resolvers.Mutation.deleteTask(undefined, { id: 'missing' })
    ).rejects.toThrow(GraphQLError);
  });
});

// ─── tasksByControl ─────────────────────────────────────────────────────────

describe('tasksByControl', () => {
  it('queries by controlId and returns matching tasks', async () => {
    const tasks = [
      { _id: 't1', description: 'First task', completed: false },
      { _id: 't2', description: 'Second task', completed: true },
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
          description: 'Review access logs',
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
          description: 'Review access logs',
        },
      })
    ).rejects.toThrow(GraphQLError);
  });
});
