import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}
export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}
export interface User {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: string;
}
export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}
export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId?: number;
  authorUserId?: number;
  assignedUserId?: number;
  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}
export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}
export interface Team {
  teamId: number;
  teamName: string;
  productownerUserId?: number;
}
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders:async(headers)=>{
    const session=fetchAuthSession();
    const { accessToken}=(await session).tokens ?? {};
    if(accessToken){
      headers.set("Authorization",`Bearer ${accessToken}`);
    }
    return headers;
  } 
  }),
  reducerPath: "api",
  tagTypes: ["projects", "Tasks", "Users","Teams"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["projects"],
    }),
    getAuthUser:build.query({
      queryFn:async(_, _queryApi, _extraoptions, fetchWithBQ) =>{
try{
const user = await getCurrentUser();
const session= await fetchAuthSession();
if(!session) throw new Error("No session");
const {userSub}=session;
const { accessToken}=session.tokens ?? {};
const userDetailsResponse = await fetchWithBQ(`users/${userSub}`);
const userDetails = userDetailsResponse.data as User;
return {data: {user , userSub, userDetails}}
} catch(error:any){
 return{error:error.message || "Error fetching user data"};
}
      } 
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks",  id }))
          : [{ type: "Tasks", id:userId  }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
  }),
});
export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery
} = api;
