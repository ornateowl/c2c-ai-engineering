import React from "react";
import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";

const initialPokemon = [
  {
    id: 1,
    number: "001",
    name: "Bulbasaur",
    species: "Seed Pokémon",
    generation: "GEN I",
    types: ["Grass", "Poison"],
    color: "#a6c96a",
    height: "0.7 m",
    weight: "6.9 kg",
    abilities: ["Overgrow"],
    description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
    stats: { HP: 45, Attack: 49, Defense: 49, "Sp. Atk": 65, "Sp. Def": 65, Speed: 45 },
  },
  {
    id: 4,
    number: "004",
    name: "Charmander",
    species: "Lizard Pokémon",
    generation: "GEN I",
    types: ["Fire"],
    color: "#ed9862",
    height: "0.6 m",
    weight: "8.5 kg",
    abilities: ["Blaze"],
    description: "The flame on its tail shows the strength of its life force. If Charmander is weak, the flame also burns low.",
    stats: { HP: 39, Attack: 52, Defense: 43, "Sp. Atk": 60, "Sp. Def": 50, Speed: 65 },
  },
  {
    id: 7,
    number: "007",
    name: "Squirtle",
    species: "Tiny Turtle Pokémon",
    generation: "GEN I",
    types: ["Water"],
    color: "#78b8d3",
    height: "0.5 m",
    weight: "9.0 kg",
    abilities: ["Torrent"],
    description: "When it retracts its long neck into its shell, it squirts out water with vigorous force.",
    stats: { HP: 44, Attack: 48, Defense: 65, "Sp. Atk": 50, "Sp. Def": 64, Speed: 43 },
  },
  {
    id: 25,
    number: "025",
    name: "Pikachu",
    species: "Mouse Pokémon",
    generation: "GEN I",
    types: ["Electric"],
    color: "#e8c954",
    height: "0.4 m",
    weight: "6.0 kg",
    abilities: ["Static"],
    description: "Pikachu raises its tail to check its surroundings. The tail is sometimes struck by lightning in this pose.",
    stats: { HP: 35, Attack: 55, Defense: 40, "Sp. Atk": 50, "Sp. Def": 50, Speed: 90 },
  },
  {
    id: 94,
    number: "094",
    name: "Gengar",
    species: "Shadow Pokémon",
    generation: "GEN I",
    types: ["Ghost", "Poison"],
    color: "#a58cbd",
    height: "1.5 m",
    weight: "40.5 kg",
    abilities: ["Cursed Body"],
    description: "To steal the life of its target, it slips into the prey's shadow and silently waits for an opportunity.",
    stats: { HP: 60, Attack: 65, Defense: 60, "Sp. Atk": 130, "Sp. Def": 75, Speed: 110 },
  },
  {
    id: 133,
    number: "133",
    name: "Eevee",
    species: "Evolution Pokémon",
    generation: "GEN I",
    types: ["Normal"],
    color: "#c79467",
    height: "0.3 m",
    weight: "6.5 kg",
    abilities: ["Run Away", "Adaptability"],
    description: "Its irregularly configured DNA is affected by its surroundings. It evolves if its environment changes.",
    stats: { HP: 55, Attack: 55, Defense: 50, "Sp. Atk": 45, "Sp. Def": 65, Speed: 55 },
  },
];

const pokemonGenerations = [
  { label: "GEN I", start: 1, end: 151 },
  { label: "GEN II", start: 152, end: 251 },
  { label: "GEN III", start: 252, end: 386 },
  { label: "GEN IV", start: 387, end: 493 },
  { label: "GEN V", start: 494, end: 649 },
  { label: "GEN VI", start: 650, end: 721 },
  { label: "GEN VII", start: 722, end: 809 },
  { label: "GEN VIII", start: 810, end: 905 },
  { label: "GEN IX", start: 906, end: 1025 },
];

const typeColors = {
  bug: "#a9b94c",
  dark: "#827775",
  dragon: "#7b84cf",
  electric: "#e6c94c",
  fairy: "#e58ea9",
  fighting: "#d77b64",
  fire: "#ef8e55",
  flying: "#9ca7dd",
  ghost: "#8a77bd",
  grass: "#87c66a",
  ground: "#d9b466",
  ice: "#9bd8d4",
  normal: "#c6c2ad",
  poison: "#b681c9",
  psychic: "#df81a7",
  rock: "#c2aa7a",
  steel: "#9ba8ac",
  water: "#70b9d3",
};

const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const formatLabel = (value) =>
  value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

async function fetchPokemonEntry(id) {
  const [pokemonResponse, speciesResponse] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);

  if (!pokemonResponse.ok || !speciesResponse.ok) {
    throw new Error("Could not load this Pokémon.");
  }

  const [pokemonData, speciesData] = await Promise.all([
    pokemonResponse.json(),
    speciesResponse.json(),
  ]);
  const englishDescription = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === "en",
  )?.flavor_text;
  const statLabels = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };
  const primaryType = pokemonData.types[0].type.name;

  return {
    id,
    number: String(id).padStart(3, "0"),
    name: formatLabel(pokemonData.name),
    species: speciesData.genera.find((entry) => entry.language.name === "en")?.genus ?? "Pokémon",
    generation: speciesData.generation.name.replace("generation-", "GEN ").toUpperCase(),
    types: pokemonData.types.map((entry) => formatLabel(entry.type.name)),
    color: typeColors[primaryType] ?? "#a6c96a",
    height: `${(pokemonData.height / 10).toFixed(1)} m`,
    weight: `${(pokemonData.weight / 10).toFixed(1)} kg`,
    abilities: pokemonData.abilities.map((entry) => formatLabel(entry.ability.name)),
    description: englishDescription?.replace(/[\n\f\r]+/g, " ").replace(/\s+/g, " ").trim()
      ?? `${formatLabel(pokemonData.name)} is part of this field guide.`,
    stats: Object.fromEntries(pokemonData.stats.map((entry) => [
      statLabels[entry.stat.name] ?? formatLabel(entry.stat.name),
      entry.base_stat,
    ])),
  };
}

function Home() {
  const [roster, setRoster] = useState(initialPokemon);
  const [selected, setSelected] = useState(initialPokemon[0]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleError, setShuffleError] = useState("");

  async function shufflePokemon() {
    setIsShuffling(true);
    setShuffleError("");

    const previousIds = new Set(roster.map((entry) => entry.id));
    const shuffledGenerations = [...pokemonGenerations];
    for (let index = shuffledGenerations.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledGenerations[index], shuffledGenerations[randomIndex]] = [
        shuffledGenerations[randomIndex], shuffledGenerations[index],
      ];
    }

    const newIds = shuffledGenerations.slice(0, 6).map((generation) => {
      let id;
      do {
        id = Math.floor(Math.random() * (generation.end - generation.start + 1)) + generation.start;
      } while (previousIds.has(id));
      return id;
    });

    try {
      const nextRoster = await Promise.all(newIds.map(fetchPokemonEntry));
      setRoster(nextRoster);
      setSelected(nextRoster[0]);
    } catch {
      setShuffleError("Couldn't load a fresh roster. Check your connection and try again.");
    } finally {
      setIsShuffling(false);
    }
  }

  return (
    <main className="dex-main">
      <div className="dex-heading">
        <div>
          <p className="eyebrow">Field guide / generations I–IX</p>
          <h1>Choose your <span>partner.</span></h1>
        </div>
        <p className="dex-instruction">Shuffle for six new Pokémon from six different generations.</p>
      </div>

      <div className="dex-layout">
        <section className="roster" aria-label="Choose a Pokémon">
          <div className="roster-heading">
            <span>THE ROSTER</span>
            <button
              className="shuffle-button"
              type="button"
              onClick={shufflePokemon}
              disabled={isShuffling}
              aria-busy={isShuffling}
            >
              <span aria-hidden="true">⇄</span> {isShuffling ? "Shuffling…" : "Shuffle"}
            </button>
          </div>
          <div className="pokemon-grid">
            {roster.map((entry) => (
              <button
                key={entry.id}
                className={`pokemon-choice${selected.id === entry.id ? " is-selected" : ""}`}
                data-type={entry.types[0].toLowerCase()}
                style={{ "--pokemon-color": entry.color }}
                type="button"
                aria-label={`Show ${entry.name}, number ${entry.number}`}
                aria-pressed={selected.id === entry.id}
                onClick={() => setSelected(entry)}
                disabled={isShuffling}
              >
                <span className="choice-number">NO. {entry.number} · {entry.generation}</span>
                <img src={spriteUrl(entry.id)} alt="" />
                <span className="choice-name">{entry.name}</span>
                <span className="choice-indicator" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <p className="roster-note" aria-live="polite">
            {shuffleError || (isShuffling ? "Finding six fresh partners…" : "Shuffle for a new team from across the generations.")}
          </p>
        </section>

        <section
          key={selected.id}
          className="detail-panel"
          style={{ "--pokemon-color": selected.color }}
          aria-label={`${selected.name} details`}
        >
          <div className="detail-topline">
            <span>FIELD NOTES</span>
            <span>NO. {selected.number} <b>·</b> {selected.generation}</span>
          </div>

          <div className="art-well">
            <div className="art-orbit" aria-hidden="true" />
            <img src={artworkUrl(selected.id)} alt={`${selected.name}, official Pokémon artwork`} />
            <span className="art-caption">{selected.species.toUpperCase()}</span>
          </div>

          <div className="pokemon-copy">
            <p className="species-label">SPECIMEN / {selected.number}</p>
            <h2>{selected.name}</h2>
            <div className="type-list" aria-label={`Types: ${selected.types.join(", ")}`}>
                {selected.types.map((type) => (
                  <span
                    key={type}
                    className="type-chip"
                    style={{ "--type-color": typeColors[type.toLowerCase()] ?? "#d8d6c8" }}
                  >
                    {type}
                  </span>
                ))}
            </div>
            <p className="pokemon-description">{selected.description}</p>
            <dl className="pokemon-facts">
              <div><dt>Height</dt><dd>{selected.height}</dd></div>
              <div><dt>Weight</dt><dd>{selected.weight}</dd></div>
              <div className="ability-fact"><dt>Ability</dt><dd>{selected.abilities.join(" / ")}</dd></div>
            </dl>
          </div>

          <div className="stats-block">
            <div className="stats-heading"><span>BASE STATS</span><span>MAX 255</span></div>
            <div className="stat-list">
              {Object.entries(selected.stats).map(([name, value], index) => (
                <div className="stat-row" key={name}>
                  <span>{name}</span>
                  <div className="stat-track" aria-label={`${name}: ${value}`}>
                    <span className={`stat-fill stat-color-${index}`} style={{ width: `${Math.min((value / 255) * 100, 100)}%` }} />
                  </div>
                  <b>{value}</b>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function About() {
  return (
    <main className="about-page">
      <p className="eyebrow">About this field guide</p>
      <h1>Small sprites.<br />Big <span>stories.</span></h1>
      <p className="about-copy">
        A pocket-sized field guide to Pokémon across all nine generations. Shuffle
        for a fresh six-specimen roster, then explore each one’s type, abilities,
        measurements, and base stats.
      </p>
      <NavLink className="text-link" to="/">Back to the roster <span aria-hidden="true">↗</span></NavLink>
      <p className="about-index">FIELD GUIDE / GENERATIONS I–IX</p>
    </main>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="wordmark" to="/" aria-label="Field guide home">
          pocket<span>dex</span>
        </NavLink>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Pokédex</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <span className="header-note">FIELD GUIDE / GEN I–IX</span>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <footer className="site-footer">
        <span>POCKETDEX / FIELD EDITION</span>
        <span>DATA VIA POKEAPI</span>
      </footer>
    </div>
  );
}