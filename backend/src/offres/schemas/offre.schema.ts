import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OffreDocument = Offre & Document;

@Schema({ timestamps: true })
export class Offre {
  @Prop({ required: true })
  entreprise: string;

  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['presentiel', 'hybride', 'distanciel'] })
  type: string;

  @Prop({ required: true, enum: [1, 2, 6] })
  duree: number;

  @Prop({ required: true })
  ville: string;
}

export const OffreSchema = SchemaFactory.createForClass(Offre);