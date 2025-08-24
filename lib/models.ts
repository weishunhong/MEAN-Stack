import mongoose from 'mongoose'

const MeowSchema = new mongoose.Schema({
  text: { type: String, required: true, minlength: 5 },
  user: mongoose.Schema.Types.Mixed,
  username: String,
  deactivated: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
})

const AuditEventSchema = new mongoose.Schema({
  text: String,
  created: { type: Date, default: Date.now }
})

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  lastLogin: Date
})

export const Meow = mongoose.models.Meow || mongoose.model('Meow', MeowSchema)
export const AuditEvent = mongoose.models.AuditEvent || mongoose.model('AuditEvent', AuditEventSchema)
export const User = mongoose.models.User || mongoose.model('User', UserSchema) 