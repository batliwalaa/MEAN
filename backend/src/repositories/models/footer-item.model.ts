import { Document } from 'mongoose';
import { FooterItem } from '../../models';

export interface FooterItemModel extends FooterItem, Document {}
