import { Document } from 'mongoose';
import { MenuItem } from '../../models';

export interface MenuItemModel extends MenuItem, Document {}
