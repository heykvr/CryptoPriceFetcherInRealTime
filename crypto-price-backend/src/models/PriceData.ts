import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceData extends Document {
  timestamp: Date;
  prices: Map<string, number>;
}

const PriceDataSchema: Schema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  prices: {
    type: Map,
    of: Number
  }
});

export default mongoose.model<IPriceData>('PriceData', PriceDataSchema);