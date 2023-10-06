# Contribution

## Create a new tool

- Write a TSX file in `/tools/`;
- Add to `/components/tools/info.tsx`; 
- Add to `/components/tools/component.tsx`. 

## Add a new language

- Write a JSON file in `/locales/`;
- Add to `/pages/_app.tsx`.

## Make a commit

- Do something;
- `npm run modifyPackage`;
- Push it to GitHub.

## Criteria

- Don't use JavaScript instead of TypeScript.
- If your commit involves large or breaking changes, create a new branch and create a pull request.  
  Even if you have write access to this repository, do not modify main directly.  
  If there are only some minor changes, you can change main.
- Indentation must be used, and the indentation is 4 spaces.
- Multiple declarations require newlines.
- Do not use "any" (except as a default value for a type parameter).
- You must use the latest dependencies. If they are incompatible, fix them.

## zIndexes
