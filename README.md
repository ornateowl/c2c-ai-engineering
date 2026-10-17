# Pocketdex

A small interactive Pokédex featuring six Pokémon at a time. Select a sprite to see its types, field note, ability, measurements, and base stats. Shuffle replaces the entire roster with six new Pokémon, one from each of six different generations selected across generations I–IX.

## Run locally

```sh
npm install
npm run dev
```

## Imports explained

In `src/main.jsx`:

- `React` provides the JSX runtime expected by Vite's default JSX transform.
- `StrictMode` from `react` enables extra development checks for React components.
- `createRoot` from `react-dom/client` attaches the React app to the `#root` element in `index.html`.
- `BrowserRouter` from `react-router-dom` provides browser-history-based routing without full document reloads.
- `App` from `./App.jsx` is the app component containing the shared header and page routes.
- `./styles.css` loads the app's styles; CSS imports are processed by Vite.

In `src/App.jsx`:

- `React` provides the JSX runtime expected by Vite's default JSX transform.
- `useState` tracks which Pokémon is selected in the roster.
- `NavLink` from `react-router-dom` renders navigation links and marks the current route active.
- `Route` maps a URL path to a page component, and `Routes` selects the matching route.

The initial roster is local. Shuffling fetches each Pokémon's details and species description from PokeAPI, then uses its ID for the sprite and official artwork URLs. Each entry has an `id`, display number, name, species, generation, types, accent color, height, weight, abilities, description, and base stats.
