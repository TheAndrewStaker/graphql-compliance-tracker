import { GraphQLError } from 'graphql';
import { Control } from '../models/Control';
import { Task } from '../models/Task';

export const controlResolvers = {
  Query: {
    controls: () => Control.find().exec(),
    control: (_: unknown, { id }: { id: string }) => Control.findById(id).exec(),
  },

  Mutation: {
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
      ).exec();
      if (!control) {throw new GraphQLError(`Control ${input.id} not found`);}
      return control;
    },

    updateControl: async (
      _: unknown,
      { input }: { input: { id: string; title: string; description?: string; category: string; status: string } }
    ) => {
      const control = await Control.findByIdAndUpdate(
        input.id,
        { title: input.title, description: input.description, category: input.category, status: input.status },
        { new: true }
      ).exec();
      if (!control) {throw new GraphQLError(`Control ${input.id} not found`);}
      return control;
    },

    deleteControl: async (_: unknown, { id }: { id: string }) => {
      const control = await Control.findById(id).exec();
      if (!control) {throw new GraphQLError(`Control ${id} not found`);}
      await Task.deleteMany({ control: id }).exec();
      await Control.findByIdAndDelete(id).exec();
      return id;
    },
  },

  Control: {
    id: (control: { _id: unknown }) => control._id?.toString(),
  },
};
