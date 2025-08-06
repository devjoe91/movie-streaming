// types/index.ts

// Movie object type
export interface Movie {
    id: string;                // Internet Archive identifier
    title: string;             // Movie title
    creator?: string;          // Director / Creator
    description?: string;      // Optional description
    playableUrl: string;       // Full embed player URL
  }
  
  // Category object type
  export interface Category {
    id: string;                // Internet Archive collection ID
    title: string;             // Category title
  }
  
  // Search result type (reuses Movie type)
  export type SearchResult = Movie;
  
  // API Response shape for Internet Archive
  export interface IAResponse<T> {
    response: {
      numFound: number;
      start: number;
      docs: T[];
    };
  }
  