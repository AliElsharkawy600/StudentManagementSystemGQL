import jwt from "jsonwebtoken";

import Course from "../models/courses.js";
import Student from "../models/students.js";
import User from "../models/user.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const toStudent = (student) => ({
  id: String(student._id),
  name: student.name,
  email: student.email,
  age: student.age,
  major: student.major ?? null,
});

const toCourse = (course) => ({
  id: String(course._id),
  title: course.title,
  code: course.code,
  credits: course.credits,
  instructor: course.instructor,
});

const requireAuth = (context) => {
  if (!context.user) {
    throw new Error("UNAUTHENTICATED");
  }
};

const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    students: async () => {
      const students = await Student.find();
      return students.map(toStudent);
    },
    student: async (_, { id }) => {
      const student = await Student.findById(id);
      return student ? toStudent(student) : null;
    },
    courses: async () => {
      const courses = await Course.find();
      return courses.map(toCourse);
    },
    course: async (_, { id }) => {
      const course = await Course.findById(id);
      return course ? toCourse(course) : null;
    },
  },
  Mutation: {
    signup: async (_, { email, password }) => {
      if (!EMAIL_REGEX.test(email ?? "")) {
        throw new Error("Invalid email address");
      }
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const existing = await User.findOne({ email });
      if (existing) {
        throw new Error("Email already in use");
      }

      const user = await User.create({ email, password });
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return {
        token,
        user: { id: user.id, email: user.email },
      };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return {
        token,
        user: { id: user.id, email: user.email },
      };
    },
    addStudent: async (_, { input }, context) => {
      requireAuth(context);
      const { name, email, age, major } = input;
      const student = await Student.create({ name, email, age, major });
      return toStudent(student);
    },
    updateStudent: async (_, { id, name, email, age, major }, context) => {
      requireAuth(context);
      const update = {};
      if (typeof name !== "undefined") update.name = name;
      if (typeof email !== "undefined") update.email = email;
      if (typeof age !== "undefined") update.age = age;
      if (typeof major !== "undefined") update.major = major;

      const student = await Student.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

      return student ? toStudent(student) : null;
    },
    deleteStudent: async (_, { id }, context) => {
      requireAuth(context);
      const result = await Student.findByIdAndDelete(id);
      return Boolean(result);
    },
    addCourse: async (_, { title, code, credits, instructor }, context) => {
      requireAuth(context);
      const course = await Course.create({ title, code, credits, instructor });
      return toCourse(course);
    },
    updateCourse: async (_, { id, title, code, credits, instructor }, context) => {
      requireAuth(context);
      const update = {};
      if (typeof title !== "undefined") update.title = title;
      if (typeof code !== "undefined") update.code = code;
      if (typeof credits !== "undefined") update.credits = credits;
      if (typeof instructor !== "undefined") update.instructor = instructor;

      const course = await Course.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

      return course ? toCourse(course) : null;
    },
    deleteCourse: async (_, { id }, context) => {
      requireAuth(context);
      const result = await Course.findByIdAndDelete(id);
      return Boolean(result);
    },
  },
};

export default resolvers;
