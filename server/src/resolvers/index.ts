import { DateTimeScalar } from '../schema/scalars';
import { controlResolvers } from './control.resolver';
import { ownerResolvers } from './owner.resolver';
import { taskResolvers } from './task.resolver';

export type { AppContext } from './context';

export const resolvers = {
  DateTime: DateTimeScalar,

  Query: {
    ...controlResolvers.Query,
    ...ownerResolvers.Query,
    ...taskResolvers.Query,
  },

  Mutation: {
    ...controlResolvers.Mutation,
    ...ownerResolvers.Mutation,
    ...taskResolvers.Mutation,
  },

  Control: controlResolvers.Control,
  Owner: ownerResolvers.Owner,
  Task: taskResolvers.Task,
};
