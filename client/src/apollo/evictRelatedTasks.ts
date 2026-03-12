import type { ApolloCache, Reference } from '@apollo/client';

interface EvictTaskArgs {
  deletedId: string;
  relationField: 'owner' | 'control';
}

export const evictRelatedTasks = (
  cache: ApolloCache,
  { deletedId, relationField }: EvictTaskArgs,
): void => {
  const taskIds: string[] = [];

  cache.modify({
    fields: {
      tasks(existingRefs: readonly Reference[] = [], { readField }) {
        return existingRefs.filter((ref) => {
          const relatedRef = readField(relationField, ref) as Reference | undefined;
          const relatedId = relatedRef ? readField('id', relatedRef) : undefined;

          if (typeof relatedId === 'string' && relatedId === deletedId) {
            const taskId = readField('id', ref);
            if (typeof taskId === 'string') {
              taskIds.push(taskId);
            }
            return false;
          }

          return true;
        });
      },
    },
  });

  for (const taskId of taskIds) {
    cache.evict({ id: cache.identify({ __typename: 'Task', id: taskId }) });
  }
};
