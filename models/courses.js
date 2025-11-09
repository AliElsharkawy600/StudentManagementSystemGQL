import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    credits: {
      type: Number,
      required: true,
      min: [1, "Course credits must be between 1 and 6"],
      max: [6, "Course credits must be between 1 and 6"],
    },

    instructor: {
      type: String,
      required: true,
      trim: true,
    },

    students: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
