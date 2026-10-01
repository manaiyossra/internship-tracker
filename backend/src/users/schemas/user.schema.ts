import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['candidat', 'admin'], default: 'candidat' })
  role: string;

  @Prop()
  nom: string;

  @Prop()
  prenom: string;

  @Prop()
  telephone: string;

  @Prop()
  cvUrl: string;

  @Prop()
  lettreMotivationUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    delete ret.password;
    return ret;
  },
});