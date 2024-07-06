const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readingSchema = new Schema({
  //deviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
  //locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  timestamp: { type: Date, default: Date.now, required: true },
  tempC: { type: Number, required: true },
  humi: { type: Number, required: true },
  dsm_consentrate: { type: Number, required: true },
  dsm_particle: { type: Number, required: true },
  air_quality_label: { type: String, required: true },
  sensor_value: { type: Number, required: true }
});

module.exports = mongoose.model('Reading', readingSchema);
