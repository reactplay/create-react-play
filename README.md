# Create React Play

## Welcome to `reactplay.io` ecosystem

A package to generate boilerplate files for creating a play withing your local system. Another idea of this package to create a backbone structure for running all sort of maintenance and house keeping task.

[![Node.js Package](https://github.com/reactplay/create-react-play/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/reactplay/create-react-play/actions/workflows/npm-publish.yml)

## Command Line Options

Here are few options

- -h/help: Show all available arguments and flags
- -c/create: Creates a play boilerplate within local directory structure
- -u/update: Update an exsiting play
- -p/prepare: Prepre an environment for build/run
- -plays: set the path folder for your plays ( default is src/plays)
- -i: Create default images for missing plays, create thumbnail and adapt image extension. (usage -i="a value")

## How it works

### Example: Create a play

1. Fork [reactplay](https://github.com/reactplay/react-play)
2. Clone your branch
3. Install packages using
   ```bash
   yarn
   #or
   npm install
   #or
   pnpm install
   ```
4. run reactplay application using
   ```bash
   yarn start
   #or
   npm start
   #or
   pnpm start
   ```
5. Hit "Create" button on web portal
6. Provide necessary information
7. Submit your play request
8. It will generate an unique id for you
9. <b>Navigate to root directory of your local reactplay repo and run

   ```bash
   npx create-react-play -c <the_unique_id>
   ```
   This will create necessary resources and link them together.
   </b>
   <br />
   <b>
      or
   ```bash
   npx create-react-play -c <the_unique_id> -plays="plays"
   ```
   if you want to create it in a specific folder ( here in the "./plays" folder at the application root)
   </b>

   **Note:** If the play folder `<reactplay_directory>/plays/<your_play_name>` remain empty after running above command that means you might be in some older version of the package. Use `@latest` in that case

   ```bash
   npx create-react-play@latest -c <the_unique_id>
   ```

10. Now you will find your play under
    ```
    <reactplay_directory>/plays/<your_play_name>
    ```
11. Now its all with you, create an awesome play and flaunt it infront of the globe
12. Create a pull request when you are done

### Example: Prepare environemnt

```bash
   npx create-react-play@latest -p
```
