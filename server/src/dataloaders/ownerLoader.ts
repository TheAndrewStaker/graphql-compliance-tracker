import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { Owner, IOwner } from '../models/Owner';

export function createOwnerLoader(): DataLoader<string, IOwner | null> {
  return new DataLoader<string, IOwner | null>(async (ids) => {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const owners = await Owner.find({ _id: { $in: objectIds } });
    const ownerMap = new Map(owners.map((o) => [o._id.toString(), o]));
    return ids.map((id) => ownerMap.get(id) ?? null);
  });
}
