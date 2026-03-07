import { GraphQLError } from 'graphql';
import { DateTimeScalar } from '../schema/scalars';
import { Control } from '../models/Control';
import { Owner } from '../models/Owner';
import { Task, ITask } from '../models/Task';
import { createOwnerLoader } from '../dataloaders/ownerLoader';

export interface AppContext {
  ownerLoader: ReturnType<typeof createOwnerLoader>;
}

export const resolvers = {
  DateTime: DateTimeScalar,

  Query: {
    controls: () => Control.find().exec(),
    control: (_: unknown, { id }: { id: string }) => Control.findById(id).exec(),
    tasks: () => Task.find().exec(),
    tasksByControl: (_: unknown, { controlId }: { controlId: string }) =>
      Task.find({ control: controlId }).exec(),
    owners: () => Owner.find().exec(),
  },

  Mutation: {
    createOwner: (
      _: unknown,
      { input }: { input: { name: string; email: string } }
    ) => Owner.create(input),

    createControl: (
      _: unknown,
      { input }: { input: { title: string; description?: string; category: string } }
    ) => Control.create({ ...input, status: 'UNKNOWN' }),

    updateControlStatus: async (
      _: unknown,
      { input }: { input: { id: string; status: string } }
    ) => {
      const control = await Control.findByIdAndUpdate(
        input.id,
        { status: input.status },
        { new: true }
      );
      if (!control) throw new GraphQLError(`Control ${input.id} not found`);
      return control;
    },

    createTask: async (
      _: unknown,
      { input }: { input: { controlId: string; ownerId: string; dueDate: Date; notes?: string } }
    ) => {
      const [control, owner] = await Promise.all([
        Control.findById(input.controlId),
        Owner.findById(input.ownerId),
      ]);
      if (!control) throw new GraphQLError(`Control ${input.controlId} not found`);
      if (!owner) throw new GraphQLError(`Owner ${input.ownerId} not found`);
      return Task.create({
        control: input.controlId,
        owner: input.ownerId,
        dueDate: input.dueDate,
        notes: input.notes,
        completed: false,
      });
    },

    completeTask: async (_: unknown, { id }: { id: string }) => {
      const task = await Task.findByIdAndUpdate(
        id,
        { completed: true },
        { new: true }
      );
      if (!task) throw new GraphQLError(`Task ${id} not found`);
      return task;
    },
  },

  Task: {
    control: (task: ITask) => Control.findById(task.control).exec(),
    owner: (task: ITask, _: unknown, { ownerLoader }: AppContext) =>
      ownerLoader.load(task.owner.toString()),
  },

  // Map Mongoose _id to GraphQL id for all types
  Owner: {
    id: (owner: { _id: unknown }) => owner._id?.toString(),
  },
  Control: {
    id: (control: { _id: unknown }) => control._id?.toString(),
  },
};
