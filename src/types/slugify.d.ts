declare module 'slugify' {
  export default function slugify(
    string: string,
    options?: { lower?: boolean; strict?: boolean }
  ): string;
}
