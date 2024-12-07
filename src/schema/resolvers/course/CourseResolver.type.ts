import { Course } from "../../entities/Course"; // Adjust path to your Course entity

export interface CourseResolverType {
  courses(limit?: number, sortOrder?: "ASC" | "DESC"): Promise<Course[]>;
  course(id: number): Promise<Course | null>;
  addCourse(
    title: string,
    description: string,
    duration: string,
    outcome: string
  ): Promise<Course>;
  updateCourse(
    id: number,
    title?: string,
    description?: string,
    duration?: string,
    outcome?: string
  ): Promise<Course>;
  deleteCourse(id: number): Promise<boolean>;
}