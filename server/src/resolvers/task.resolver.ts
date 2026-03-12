import { GraphQLError } from 'graphql';
import { Control } from '../models/Control';
import { Owner } from '../models/Owner';
import { Task, type ITask } from '../models/Task';
import type { AppContext } from './context';

export const taskResolvers = {
  Query: {
    tasks: () => Task.find().exec(),
    tasksByControl: (_: unknown, { controlId }: { controlId: string }) =>
      Task.find({ control: controlId }).exec(),
  },

  Mutation: {
    createTask: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          controlId: string;
          ownerId: string;
          dueDate: Date;
          description: string;
          notes?: string;
        };
      },
    ) => {
      const [control, owner] = await Promise.all([
        Control.findById(input.controlId),
        Owner.findById(input.ownerId),
      ]);
      if (!control) {
        throw new GraphQLError(`Control ${input.controlId} not found`);
      }
      if (!owner) {
        throw new GraphQLError(`Owner ${input.ownerId} not found`);
      }
      return await Task.create({
        control: input.controlId,
        owner: input.ownerId,
        dueDate: input.dueDate,
        description: input.description,
        notes: input.notes,
        completed: false,
      });
    },

    completeTask: async (_: unknown, { id }: { id: string }) => {
      const task = await Task.findByIdAndUpdate(id, { completed: true }, { new: true }).exec();
      if (!task) {
        throw new GraphQLError(`Task ${id} not found`);
      }
      return task;
    },

    updateTask: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          id: string;
          controlId: string;
          ownerId: string;
          dueDate: Date;
          description: string;
          notes?: string;
        };
      },
    ) => {
      const [control, owner] = await Promise.all([
        Control.findById(input.controlId),
        Owner.findById(input.ownerId),
      ]);
      if (!control) {
        throw new GraphQLError(`Control ${input.controlId} not found`);
      }
      if (!owner) {
        throw new GraphQLError(`Owner ${input.ownerId} not found`);
      }
      const task = await Task.findByIdAndUpdate(
        input.id,
        {
          control: input.controlId,
          owner: input.ownerId,
          dueDate: input.dueDate,
          description: input.description,
          notes: input.notes,
        },
        { new: true },
      ).exec();
      if (!task) {
        throw new GraphQLError(`Task ${input.id} not found`);
      }
      return task;
    },

    deleteTask: async (_: unknown, { id }: { id: string }) => {
      const task = await Task.findByIdAndDelete(id).exec();
      if (!task) {
        throw new GraphQLError(`Task ${id} not found`);
      }
      return id;
    },
  },

  Task: {
    control: (task: ITask) => Control.findById(task.control).exec(),
    owner: (task: ITask, _: unknown, { ownerLoader }: AppContext) =>
      ownerLoader.load(task.owner.toString()),
  },
};
