export interface Image {
    id: string;
    format: string;
  }
  
  export interface Project {
    id: number;
    userId: string;
    name: string;
    tools: {
      filterName: string;
      args: Record<string, unknown>;
    }[];
    images: Image[];
    result: {
      expireDate?: Date;
      output?: string;
    };
    ttl?: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  