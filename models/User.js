const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "student", "super-admin", "teacher"],
      required: true,
    },
    phone: {
      type: String,
      required: function () {
        return this.role !== "student";
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: { type: String, enum: ["male", "female"] },
    isActive: { type: Boolean, enum: [true, false], default: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

function formatDisplayName(name) {
  if (!name) return name;
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

userSchema.virtual("displayName").get(function () {
  return formatDisplayName(this.name);
});

userSchema.pre("save", function (next) {
  if (this.name && typeof this.name === "string") {
    this.name = this.name.toLowerCase().trim();
  }
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update) {
    if (typeof update.name === "string") {
      update.name = update.name.toLowerCase().trim();
    }
    if (update.$set && typeof update.$set.name === "string") {
      update.$set.name = update.$set.name.toLowerCase().trim();
    }
    this.setUpdate(update);
  }
  next();
});

userSchema.pre("updateOne", function (next) {
  const update = this.getUpdate();
  if (update) {
    if (typeof update.name === "string") {
      update.name = update.name.toLowerCase().trim();
    }
    if (update.$set && typeof update.$set.name === "string") {
      update.$set.name = update.$set.name.toLowerCase().trim();
    }
    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
