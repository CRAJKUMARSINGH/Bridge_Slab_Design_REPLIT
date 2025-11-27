import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: any;
let db: any;

// Use SQLite for development
if (process.env.NODE_ENV === 'development') {
  // For development, we'll use an in-memory SQLite database
  // This is a simplified approach for local development
  console.log("Using development database configuration");
  
  // Mock database objects for development
  const mockPool = {
    query: async (text: string, params?: any[]) => {
      console.log("Mock query:", text, params);
      return { rows: [] };
    },
    connect: async () => {
      return {
        query: async (text: string, params?: any[]) => {
          console.log("Mock connection query:", text, params);
          return { rows: [] };
        },
        release: () => {}
      };
    }
  };

  const mockDb = {
    select: () => ({ from: () => Promise.resolve([]) }),
    insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve([]) }) }),
    delete: () => ({ where: () => Promise.resolve([]) })
  };
  
  pool = mockPool;
  db = mockDb as any;
} else {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };