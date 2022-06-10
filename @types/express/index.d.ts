import express from "express";
declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        name: string;
        username: string;
        todos: Todo[];
      }
    }
  }
}


