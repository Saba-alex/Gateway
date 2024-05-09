import mongoose from "mongoose";

const auditTrailSchema = new mongoose.Schema({
  timestamp: Date,
  microservice: String,
  url: String,
  method: String,
  statusCode: Number,
  userId: String,
  userAgent: String,
  success: Boolean,
  result: Object,
  headers: Object,
  params: Object,
  body: Object,
});

const AuditTrail = mongoose.model("AuditTrail", auditTrailSchema);

export default AuditTrail;