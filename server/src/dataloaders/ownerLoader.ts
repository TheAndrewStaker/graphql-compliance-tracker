import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { Owner, type IOwner } from '../models/Owner';

export const createOwnerLoader = (): DataLoader<string, IOwner | null> =>
  new DataLoader<string, IOwner | null>(async (ids) => {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const owners = await Owner.find({ _id: { $in: objectIds } });
    const ownerMap = new Map(owners.map((o) => [o._id.toString(), o]));
    return ids.map((id) => ownerMap.get(id) ?? null);
  });
