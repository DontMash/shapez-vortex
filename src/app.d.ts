import type PocketBase from 'pocketbase';
import type UAParser from 'ua-parser-js';
import type { User } from '$lib/user';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      pb: PocketBase;
      user: User | undefined;
    }
    interface PageData {
      seo?: {
        title: string;
        description: string;
        keywords?: Array<string>;
        og?: {
          title?: string;
          image?: string;
        };
      };
      user: User | undefined;
      agent: UAParser.IResult | undefined;
    }
    // interface Platform {}
  }
}

declare module '$env/static/private' {
  export const POCKETBASE_URL: string;
}

export {};
