import Course from "../models/courses.js";
import Student from "../models/students.js";

const resolvers = {
  Query: {
    students: async () => {
      const students = await Student.find();
      return students.map((student) => ({
        id: String(student._id),
        name: student.name,
        email: student.email,
        age: student.age,
        major: student.major ?? null,
      }));
    },
    student: async (_, { id }) => {
      const student = await Student.findById(id);
      return student
        ? {
            id: String(student._id),
            name: student.name,
            email: student.email,
            age: student.age,
            major: student.major ?? null,
          }
        : null;
    },
    courses: async () => {
      const courses = await Course.find();
      return courses.map((course) => ({
        id: String(course._id),
        title: course.title,
        code: course.code,
        credits: course.credits,
        instructor: course.instructor,
      }));
    },
    course: async (_, { id }) => {
      const course = await Course.findById(id);
      return course
        ? {
            id: String(course._id),
            title: course.title,
            code: course.code,
            credits: course.credits,
            instructor: course.instructor,
          }
        : null;
    },
  },
  Mutation: {
    addStudent: async (_, { name, email, age, major }) => {
      const student = await Student.create({ name, email, age, major });
      return {
        id: String(student._id),
        name: student.name,
        email: student.email,
        age: student.age,
        major: student.major ?? null,
      };
    },
    updateStudent: async (_, { id, name, email, age, major }) => {
      const update = {};
      if (typeof name !== "undefined") update.name = name;
      if (typeof email !== "undefined") update.email = email;
      if (typeof age !== "undefined") update.age = age;
      if (typeof major !== "undefined") update.major = major;

      const student = await Student.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

      return student
        ? {
            id: String(student._id),
            name: student.name,
            email: student.email,
            age: student.age,
            major: student.major ?? null,
          }
        : null;
    },
    deleteStudent: async (_, { id }) => {
      const result = await Student.findByIdAndDelete(id);
      return Boolean(result);
    },
    addCourse: async (_, { title, code, credits, instructor }) => {
      const course = await Course.create({ title, code, credits, instructor });
      return {
        id: String(course._id),
        title: course.title,
        code: course.code,
        credits: course.credits,
        instructor: course.instructor,
      };
    },
    updateCourse: async (_, { id, title, code, credits, instructor }) => {
      const update = {};
      if (typeof title !== "undefined") update.title = title;
      if (typeof code !== "undefined") update.code = code;
      if (typeof credits !== "undefined") update.credits = credits;
      if (typeof instructor !== "undefined") update.instructor = instructor;

      const course = await Course.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

      return course
        ? {
            id: String(course._id),
            title: course.title,
            code: course.code,
            credits: course.credits,
            instructor: course.instructor,
          }
        : null;
    },
    deleteCourse: async (_, { id }) => {
      const result = await Course.findByIdAndDelete(id);
      return Boolean(result);
    },
  },
};

export default resolvers;
