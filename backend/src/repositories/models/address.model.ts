import { Document } from 'mongoose';
import { Address } from '../../models';

export interface AddressModel extends Address, Document {}
