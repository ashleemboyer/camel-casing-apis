![CI checks](https://github.com/ashleemboyer/camel-casing-apis/actions/workflows/config.yaml/badge.svg)

# Camel Casing APIS

Currently queries and renders the normalized data from: https://api.openbrewerydb.org/breweries. [This API](https://www.openbrewerydb.org/documentation/01-listbreweries) was chosen because it was the first one I found that returns objects with `snake_case` keys.

## To run

1. `git clone git@github.com:ashleemboyer/camel-casing-apis.git`
2. `cd camel-casing-apis`
3. `yarn`
4. `yarn dev`

## What I did

I started this project because I wanted to try solving a common problem with a small solution that uses TypeScript, Jest, and GitHub workflows. One of my big focuses for the next few months is getting a better grasp of TypeScript. I'm very comfortable with the basics and debugging errors, but I want to learn how to use TypeScript in the most effective ways. I'll be spending a lot of time with two books in the coming weeks and [learning out loud](https://ashleemboyer.com/what-it-means-to-learn-out-loud):

- [Programming TypeScript (Boris Cherny)](https://www.oreilly.com/library/view/programming-typescript/9781492037644/)
- [Effective TypeScript (Dan Vanderkam)](https://www.oreilly.com/library/view/effective-typescript/9781492053736/)

For the rest of this README I'll step through the commit history and detail all of the new things I learned and tripped on.

## Table of Contents

- [1. Set up a Next.js project with TypeScript](https://github.com/ashleemboyer/camel-casing-apis#1-set-up-a-nextjs-project-with-typescript)
- [2. Adding an api utility](https://github.com/ashleemboyer/camel-casing-apis#2-adding-an-api-utility)
- [3. Adding utils for normalizing the casing](https://github.com/ashleemboyer/camel-casing-apis#3-adding-utils-for-normalizing-the-casing)
- [4. Updating api to use the new utils and type](https://github.com/ashleemboyer/camel-casing-apis#4-updating-api-to-use-the-new-utils-and-type)
- [5. Adding Jest tests](https://github.com/ashleemboyer/camel-casing-apis#5-adding-jest-tests)
- [6. Running the tests from a GitHub workflow](https://github.com/ashleemboyer/camel-casing-apis#6-running-the-tests-from-a-github-workflow)

## 1. Set up a Next.js project with TypeScript

I usually start new Next.js projects with [their manual approach](https://nextjs.org/docs/getting-started#manual-setup) because doing things like this repetively helps me retain the information. So, I created a new directory a new directory called `camel-casing-apis`, and installed the `next`,  `react`,  `react-dom`, and `sass` packages.

```bash
yarn add next react react-dom sass
```

Then I added some scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

After that, I added the initial files needed to run Next.js in development mode (`next dev`).

**pages/_app.tsx**
```tsx
import type { AppProps } from 'next/app';
import '@styles/global.scss';

const App = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default App;
```

**pages/index.tsx**
```tsx
const HomePage = () => <h1>Hello from HomePage!</h1>;

export default HomePage;
```

**styles/global.scss**
```tsx
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

At that point, I followed [the Next.js docs about TypeScript](https://nextjs.org/docs/basic-features/typescript) to get `next dev` working. First, I created an empty `tsconfig.json` file.

```bash
touch tsconfig.json
```

Then I ran `yarn dev` and found that I needed to install `@types/react` and `typescript`.

```bash
yarn add --dev typescript @types/react
```

Running `yarn dev` again generates the `tsconfig.json`. In there, I added the baseUrl and path aliasing I normally do in a `jsconfig.json` file. The following is what allows me to import files from the `styles` directory like I did in the `pages/_app.ts` file (`import '@styles/global.scss'`).

```
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@styles/*": ["styles/*"]
    },
    ...
  }
  ...
}
```

With this being everything I needed to get the app running in a browser, I added a `.gitignore` file and started committing my work.

```
.next
node_modules
```

## 2. Adding an `api` utility

I knew I wanted to use `axios` for making requests, so I added it.

```bash
yarn add axios
```

Then I added a `utils` directory and aliasing for it.

```
{
  "compilerOptions": {
    "paths": {
      "@styles/*": ["styles/*"],
      "@utils/*": ["utils/*]
    },
    ...
  },
  ...
}
```

In the `utils` directory, I added a starter `api` util that exports a `get` function for making `GET` requests with `axios`:

```ts
import axios from 'axios';

export const get = async (url: string, options?: Record<string, any>) => {
  try {
    const response = await axios.get(url, options);
    return response;
  } catch (error) {
    console.error(error);
  }
};
```

I wanted to render the result from this function on the main page (`pages/index.tsx`), so I updated the component and added some styles for it.

**pages/index.tsx**
```
import { useEffect, useState } from 'react';
import { get } from 'utils/api';
import styles from '@styles/HomePage.module.scss';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    get('https://api.openbrewerydb.org/breweries').then((res) => {
      setData(res.data);
      setIsLoading(false);
    });
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.HomePage}>
      <h1>Data loaded!</h1>
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </div>
  );
};

export default HomePage;
```

**styles/HomePage.module.scss**
```
.HomePage {
  padding: 24px;

  h1 {
    margin-bottom: 24px;
  }

  code {
    pre {
      background-color: rgba(black, 0.15);
      border-radius: 4px;
      padding: 16px;
      font-size: 1rem;
    }
  }
}
```

The app looked like this after running `yarn dev` (you can see that the object keys are `snake_case`):

![Webpage with a black header reading "Data loaded!" Below it is the JSON data in a black monospace font on a light gray rectangle with slightly rounded corners.](https://user-images.githubusercontent.com/43934258/113382884-9f0c9200-9350-11eb-99e7-4148c4a63300.png)

## 3. Adding utils for normalizing the casing

The main `util` I added was called `normalizeKeyCasing`. It needed to recursively look at objects and arrays within an object and convert all keys with `snake_case` to `camelCase`. My function looks at three cases:

- Is the given argument an array?
- Is the given argument an object?
- If it's not one of the previous two, we'll return it.

**normalizeKeyCasing**
```ts
import { capitalizeString, isArray, isObject } from '@utils';

const normalizeKeyCasing = (arg: any): any => {
  let normalizedObject: any;

  if (isArray(arg)) {
    normalizedObject = arg.map((o: any) => normalizeKeyCasing(o));
  } else if (isObject(arg)) {
    normalizedObject = {};
    for (const key in arg) {
      const normalizedKey = key
        .split('_')
        .map((piece, index) => (index === 0 ? piece : capitalizeString(piece)))
        .join('');
      normalizedObject[normalizedKey] = arg[key]
        ? normalizeKeyCasing(arg[key])
        : null;
    }
  } else {
    normalizedObject = arg;
  }

  return normalizedObject;
};

export default normalizeKeyCasing;
```

So the next `util` I added was `isArray`. It's a wrapper for `Array.isArray`:

**utils/isArray**
```ts
const isArray = (arg: any): boolean => Array.isArray(arg);

export default isArray;
```

Then I started working on the `isObject` util. Something is an object (like the traditional JSON object if it's not an array, not a function, and its value doesn't change when cased with `Object()`.

**utils/isObject**
```ts
import { isArray, isFunction } from '@utils';

const isObject = (arg: any): boolean =>
  !isArray(arg) && !isFunction(arg) && arg === Object(arg);

export default isObject;
```

The util needed to make this function work is `isFunction`. It checks the value of `typeof` to be `function`.

**utils/isFunction**
```ts
const isFunction = (arg: any): boolean => typeof arg === 'function';

export default isFunction;
```

The last util is `capitalizeString`. It capitalizes the first character of a string.

**utils/capitalizeString**
```ts
const capitalizeString = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1);
};

export default capitalizeString;
```

At this point I also decided that I wanted to simplify the import statements for these utils, so I decided to export everything from the directory from an `index.ts` file.

**utils/index.ts**
```ts
import api from './api';
import capitalizeString from './capitalizeString';
import isArray from './isArray';
import isFunction from './isFunction';
import isObject from './isObject';
import normalizeKeyCasing from './normalizeKeyCasing';

export {
  api,
  capitalizeString,
  isArray,
  isFunction,
  isObject,
  normalizeKeyCasing,
};
```

Now that the structure of the directory had been figured out, I could add the path aliasing for this directory in `tsconfig.json`. I also decided to add a `customTypes` directory and add a file for `apiTypes`.

**tsconfig.json**
```json
{
  "compilerOptions": {
    "paths": {
      "@customTypes/*": ["customTypes/*"],
      "@styles/*": ["styles/*"],
      "@utils": ["utils"]
    },
    ...
  },
  ...
}
```

**customTypes/apiTypes.ts**
```ts
export interface ApiResponse {
  data: any;
}
```

## 4. Updating `api` to use the new utils and type

This is how the `api` ended up with the new exporting approach for the `utils` directory, the new utils, and handling the `catch` block a little more nicely.

**utils/api.ts**
```ts
import axios from 'axios';
import { ApiResponse } from '@customTypes/apiTypes';
import { normalizeKeyCasing } from '@utils';

const get = async (
  url: string,
  options?: Record<string, any>,
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(url, options);
    return {
      data: normalizeKeyCasing(response.data) || {},
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
    };
  }
};

export default { get };
```

I also needed to update `pages/index.tsx` to import the `api` utility differently and use the new `ApiResponse` type.

**pages/index.tsx**
```tsx
import { useEffect, useState } from 'react';
import { ApiResponse } from '@customTypes/apiTypes';
import { api } from '@utils';
import styles from '@styles/HomePage.module.scss';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ApiResponse>();

  useEffect(() => {
    api
      .get('https://api.openbrewerydb.org/breweries')
      .then((res: ApiResponse) => {
        setData(res.data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.HomePage}>
      <h1>Data loaded!</h1>
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </div>
  );
};

export default HomePage;
```

After running the app again, the object keys in the data are now `camelCase` instead of `snake_case`. The view is the same as before other than that:

![](https://user-images.githubusercontent.com/43934258/113384611-6a9ad500-9354-11eb-84e0-3a1071c2f561.png)

## 5. Adding Jest tests

To configure Jest to work with the project, I first had to install a few `devDependencies` and add a script to `package.json`:

```bash
yarn add --dev jest @types/jest
```

**package.json**
```json
{
  "scripts": {
    "test:unit": "jest --testPathPattern=unit.test.ts$"
  },
  ...
}
```

The script I added is specific to the naming style I want to use for test files. Unit tests have a `unit.test.ts` suffix and integration tests would have a `int.test.ts` suffix.

A `jest.config.js` file needed to be added so that the tests can use the same path aliasing as the rest of the app.

**jest.config.js**
```js
module.exports = {
  moduleNameMapper: {
    '@utils': '<rootDir>/utils',
  },
};
```

The `tsconfig.json` file also had to be updated to include the new `"jest.config.js"` file name at the end of the `"include"` property's array.

After this, I added all of the test files for each utility (except `api` since it uses a util I'm writing tests for and it also only uses `axios`).

## 6. Running the tests from a GitHub workflow

[My first approach](https://github.com/ashleemboyer/camel-casing-apis/commit/6ad9d2a176746c7d7cbd7825e5e2898abf4cd2ae) to the GitHub workflow used `npm` to run tests. I'm not sure if that was part of the issue with that approach or if I was missing `actions/setup-node@v1`, but I changed both. [In my second approach](https://github.com/ashleemboyer/camel-casing-apis/commit/e1bcdf6117a182c39fa0aff699d81ee121927d77), I commented out the `unit-tests` job to see if using adding that previous mentioned action and using `yarn` instead of `npm` would help.

I then [took the same approach](https://github.com/ashleemboyer/camel-casing-apis/commit/b6dcd1c789451abf4cc75a4ffe5c2d4afde185c6) in the unit-tests job and uncommented it. Everything worked great! I found that there's a fun badge for show CI tests, so I added that to the README and added some initial details. That's the whole story!
