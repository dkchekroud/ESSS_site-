// centralise toutes les connexions vers tes 4 bases MySQL
// lib/prisma.js
import { PrismaClient as PrismaAdmins } from "../node_modules/.prisma/admin-client";
import { PrismaClient as PrismaStudents } from "../node_modules/.prisma/student-client";
import { PrismaClient as PrismaTeachers } from "../node_modules/.prisma/teacher-client";
import { PrismaClient as PrismaMain } from "../node_modules/.prisma/main-client";

// ✅ Empêche Prisma de recréer plusieurs instances en mode hot-reload
const globalForPrisma = globalThis;

// === Clients ===
export const prismaAdmin =
  globalForPrisma.prismaAdmin || new PrismaAdmins();

export const prismaStudent =
  globalForPrisma.prismaStudent || new PrismaStudents();

export const prismaTeacher =
  globalForPrisma.prismaTeacher || new PrismaTeachers();

export const prismaMain =
  globalForPrisma.prismaMain || new PrismaMain();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaAdmin = prismaAdmin;
  globalForPrisma.prismaStudent = prismaStudent;
  globalForPrisma.prismaTeacher = prismaTeacher;
  globalForPrisma.prismaMain = prismaMain;
}


