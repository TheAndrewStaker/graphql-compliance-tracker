import { type createOwnerLoader } from '../dataloaders/ownerLoader';

export interface AppContext {
  ownerLoader: ReturnType<typeof createOwnerLoader>;
}
