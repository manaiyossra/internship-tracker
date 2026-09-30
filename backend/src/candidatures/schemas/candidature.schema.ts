import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CandidatureDocument = Candidature & Document;

@Schema({ timestamps: true })
export class Candidature {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  utilisateur: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Offre', required: true })
  offre: Types.ObjectId;

  @Prop({ required: true, enum: ['envoyee', 'entretien', 'acceptee', 'refusee'], default: 'envoyee' })
  statut: string;

  @Prop()
  notes: string;
}

export const CandidatureSchema = SchemaFactory.createForClass(Candidature);