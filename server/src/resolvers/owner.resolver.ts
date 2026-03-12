import { GraphQLError } from 'graphql';
import { Owner } from '../models/Owner';
import { Task } from '../models/Task';

export const ownerResolvers = {
  Query: {
    owners: () => Owner.find().exec(),
  },

  Mutation: {
    createOwner: (
      _: unknown,
      { input }: { input: { name: string; email: string } }
    ) => Owner.create(input),

    updateOwner: async (
      _: unknown,
      { input }: { input: { id: string; name: string; email: string } }
    ) => {
      const owner = await Owner.findByIdAndUpdate(
        input.id,
        { name: input.name, email: input.email },
        { new: true }
      ).exec();
      if (!owner) {throw new GraphQLError(`Owner ${input.id} not found`);}
      return owner;
    },

    deleteOwner: async (_: unknown, { id }: { id: string }) => {
      const owner = await Owner.findById(id).exec();
      if (!owner) {throw new GraphQLError(`Owner ${id} not found`);}
      await Task.deleteMany({ owner: id }).exec();
      await Owner.findByIdAndDelete(id).exec();
      return id;
    },
  },

  Owner: {
    id: (owner: { _id: unknown }) => owner._id?.toString(),
  },
};
