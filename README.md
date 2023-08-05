#

**Cannot find module 'next/image'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?ts(2792)**

If you see this error after the installation, go to the tsconfig.json and change the setting:

```javascript
// From
"moduleResolution": "bundler",

// To
"moduleResolution": "Node",
```

#

**shadcn**

```bash
✔ Would you like to use TypeScript (recommended)? / yes
✔ Which style would you like to use? › New York
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? app/globals.css
✔ Would you like to use CSS variables for colors? yes
✔ Where is your tailwind.config.js located? tailwind.config.js
✔ Configure the import alias for components: @/components
✔ Configure the import alias for utils: @/lib/utils
✔ Are you using React Server Components? yes
✔ Write configuration to components.json. Proceed? yes
```

#

**Change ECMAScript version to support latest javascript functions (and to avoid few TypeScript Errors)**

```javascript
// From
"compilerOptions": {
   "target": "es5",
   ...
}

// To
"compilerOptions": {
   "target": "es2022",
   ...
}
```

#
