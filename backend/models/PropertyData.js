import mongoose from "mongoose"

const ShowdataSchema = new mongoose.Schema({
  // Basic tracking fields
  slug: { type: String },
  propertyId: { type: Number },
  propertyName: { type: String },

  // Complete API response data
  data: {
    pageProps: {
      property: {
        _id: { type: String },
        architecture: [{ url: String }],
        area: { type: String },
        area_unit: { type: String },
        buildings: [[{
          Building_ID: String,
          Name: String,
          Description: String,
          Completion_date: Date,
          Building_image: [{
            access: String,
            meta: { height: Number, width: Number },
            mime: String,
            name: String,
            path: String,
            size: Number,
            type: String,
            url: String
          }]
        }]],
        city: { type: String },
        country: { type: String },
        coordinates: { type: String },
        completion_datetime: { type: String },
        cover_image_url: {
          access: String,
          path: String,
          name: String,
          type: String,
          size: Number,
          mime: String,
          meta: { width: Number, height: Number },
          url: String
        },
        deposit_description: { type: String },
        developer: { type: String },
        developer_data: {
          description: String,
          email: String,
          id: Number,
          logo_image: [{ url: String }],
          name: String,
          office_address: String,
          website: String,
          working_hours: [{ days: String, time_range: String }]
        },
        facilities: [{
          name: String,
          image: { url: String },
          image_source: String
        }],
        has_escrow: { type: Boolean },
        id: { type: Number },
        interior: [{ url: String }],
        lobby: [{ url: String }],
        map_points: [{ name: String, distance_km: Number }],
        master_plan: [{ url: String }],
        max_area: { type: Number },
        min_area: { type: Number },
        max_price: { type: Number },
        min_price: { type: Number },
        name: { type: String },
        overview: { type: String },
        parking: { type: String },
        payment_plans: [{
          Plan_name: String,
          months_after_handover: Number,
          Payments: [[[{
            Order: Number,
            Payment_time: String,
            Percent_of_payment: String
          }]]]
        }],
        post_handover: { type: Boolean },
        price_currency: { type: String },
        sale_status: { type: String },
        status: { type: String },
        unit_availability: [mongoose.Schema.Types.Mixed],
        unit_blocks: [{
          id: Number,
          normalized_type: String,
          unit_bedrooms: String,
          unit_type: String,
          units_amount: Number,
          units_area_from: Number,
          units_area_to: Number,
          units_price_from: Number,
          units_price_to: Number,
          typical_unit_image_url: [{
            access: String,
            path: String,
            name: String,
            type: String,
            size: Number,
            mime: String,
            meta: { width: Number, height: Number },
            url: String
          }],
          area_unit: String,
          price_currency: String
        }],
        website: { type: String },
        slug: { type: String },
        source: { type: String },
        timestamp: { type: Date }
      }
    },
    __N_SSP: { type: Boolean }
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'showdata'
});

// Add indexes for better query performance
ShowdataSchema.index({ propertyId: 1 });
ShowdataSchema.index({ slug: 1 });
ShowdataSchema.index({ propertyName: 1 });
ShowdataSchema.index({ 'data.pageProps.property.id': 1 });
ShowdataSchema.index({ 'data.pageProps.property._id': 1 });

const Showdata = mongoose.model("Showdata", ShowdataSchema);

export default Showdata;