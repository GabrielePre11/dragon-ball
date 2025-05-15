import type { Route } from "./+types/character";

/*============= BUTTONS ICONS =============*/

// Genders
import { IoIosMale, IoIosFemale } from "react-icons/io";

// Symbols
import { GiRollingEnergy } from "react-icons/gi";
import { GiSaiyanSuit } from "react-icons/gi";
import { SiRedragon } from "react-icons/si";

/*============= INTERFACES =============*/

// singleCharacterPage's INTERFACE

/*
- This interface handles the structure for the singleCharacterPage, with all the infos and its types needed from the API.
- originPlanet is a single object which contains all the informations about the planets the characters come from.
*/

interface singleCharacterPage {
  name: string;
  description: string;
  gender: string;
  image: string;
  affiliation: string;
  ki: string;
  maxKi: string;
  race: string;
  originPlanet: Planet;
}

// Planet's INTERFACE

/*
- This interface handles the structure for the Planet
*/

interface Planet {
  id: number;
  image: string;
  name: string;
}

/*============= CLIENT LOADER =============*/

/*
  - This async function is responsible for fetching the initial data from the Dragon Ball API 
    when the client loads the page.
  - It runs before rendering the component to provide the needed data.
  - It handles the fetching process and error checking.
*/
export async function clientLoader({ params }: Route.LoaderArgs) {
  // It extracts the characterId from the route parameters to use it in the API request ${characterId}
  const characterId = params.characterId;

  try {
    // Fetching the result...
    const res =
      await fetch(`https://dragonball-api.com/api/characters/${characterId}
  `);

    // If the response is not okay (ex. 404) it throws an error.
    if (!res.ok) {
      throw new Error("Failed to fetch data.");
    }
    const data = await res.json();

    // The data is returned, so that it can be used from the components.
    return data;
  } catch (error: unknown) {
    console.log(error);
  }
}

/*============= CHARACTER COMPONENT =============*/

/*
  - This component represents the detailed page of a single Dragon Ball character.
  - It receives the data from the clientLoader via the loaderData, which contains all the character's information.
*/

export default function Character({ loaderData }: Route.ComponentProps) {
  /*
  - The data is explicitly typed as singleCharacterPage to ensure type safety and help with auto-completion (ex. {character.name}).
  */
  const character: singleCharacterPage = loaderData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] lg:max-w-7xl lg:mx-auto lg:gap-9 py-28 px-4 md:px-6">
      {/*=========== CHARACTER'S NAME (if longer than 10 it becomes smaller) ===========*/}
      <h1
        className={`text-7xl sm:text-8xl lg:${character.name.length > 10 ? "text-4xl" : "text-8xl"} font-bangers text-center lg:absolute bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent`}
      >
        {character.name}
      </h1>

      {/*=========== CHARACTER'S IMAGE ===========*/}
      <figure className="grid place-items-center lg:place-items-start py-12">
        <img
          src={character.image}
          alt={character.name}
          className="w-[180px] lg:w-[250px] lg:mt-22 transition-transform duration-500 hover:scale-105 hover:drop-shadow-xl hover:drop-shadow-amber-400"
        />
      </figure>

      {/*=========== CHARACTER'S CONTENT ===========*/}
      <div className="grid gap-2.5 lg:gap-5 rounded-xl ring-2 ring-amber-300 ring-offset-2 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-amber-300 to-amber-600">
        <div>
          {/*=========== CHARACTER'S PRESENTATION (NAME AND DESCRIPTION) ===========*/}
          <h2 className="font-bangers text-2xl lg:text-4xl text-gray-900 md:text-center lg:text-left">
            LET'S INTRODUCE {character.name}!
          </h2>

          {/*=========== CHARACTER'S DESCRIPTION ===========*/}
          <p className="text-sm lg:text-lg font-semibold text-gray-900 md:max-w-[500px] md:mx-auto lg:max-w-full lg:pt-3">
            {character.description}
          </p>
        </div>

        {/*=========== FURTHER INFORMATIONS ===========*/}
        <div>
          {/*=========== INFORMATIONS LIST ===========*/}
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5 mx-auto pt-3 sm:pt-5">
            {/*=========== GENDER BOX ===========*/}
            <li className="flex flex-col items-center justify-center gap-2 w-30 h-30 sm:w-40 sm:h-40 lg:w-50 lg:h-50 p-4 mx-auto rounded-lg ring-2 ring-amber-300 ring-offset-1 bg-amber-600">
              <h3 className="text-2xl lg:text-4xl font-bangers">Gender</h3>
              <span className="text-5xl lg:text-7xl">
                {character.gender === "Male" ? <IoIosMale /> : <IoIosFemale />}
              </span>
            </li>

            {/*=========== ORIGIN PLANET BOX ===========*/}
            <li className="flex flex-col items-center justify-center gap-2 w-30 h-30 sm:w-40 sm:h-40 lg:w-50 lg:h-50 p-4 mx-auto ring-2 ring-amber-300 ring-offset-1 rounded-lg bg-amber-600">
              <h3 className="text-2xl lg:text-4xl font-bangers flex flex-col text-center">
                From {character.originPlanet.name || "Unknown"}
              </h3>
              <img
                src={character.originPlanet.image || "Unknown"}
                alt={character.originPlanet.name || "Unknown"}
                className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[85px] lg:h-[85px] rounded-full object-cover"
              />
            </li>

            {/*=========== KI BOX ===========*/}
            <li className="flex flex-col items-center justify-center gap-2 ring-2 ring-amber-300 ring-offset-1 w-30 h-30 sm:w-40 sm:h-40 lg:w-50 lg:h-50 rounded-lg p-4 bg-amber-600 text-center mx-auto">
              <h3 className="text-lg sm:text-xl lg:text-3xl font-bangers">
                Ki {character.ki}
              </h3>
              <span className="text-4xl sm:text-7xl">
                <GiRollingEnergy />
              </span>
            </li>

            {/*=========== MAX. KI BOX ===========*/}
            <li className="flex flex-col items-center justify-center gap-2 ring-2 ring-amber-300 ring-offset-1 w-30 h-30 sm:w-40 sm:h-40 lg:w-50 lg:h-50 rounded-lg p-4 bg-amber-600 text-center mx-auto">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bangers">
                Max. Ki <br /> {character.maxKi}
              </h3>
              <span className="text-2xl sm:text-5xl lg:text-7xl">
                <GiRollingEnergy />
              </span>
            </li>

            {/*=========== RACE BOX ===========*/}
            <li className="flex flex-col items-center justify-center gap-2 ring-2 ring-amber-300 ring-offset-1 w-30 h-30 sm:w-40 sm:h-40 lg:w-50 lg:h-50 rounded-lg p-4 bg-amber-600 text-center mx-auto">
              <h3 className="text-2xl lg:text-4xl font-bangers">
                Race {character.race}
              </h3>
              <span className="text-4xl sm:text-5xl lg:text-7xl">
                <GiSaiyanSuit />
              </span>
            </li>

            {/*=========== AFFILIATION BOX ===========*/}
            <li className="flex flex-col items-center justify-center gap-2 ring-2 ring-amber-300 ring-offset-1 w-30 h-30 sm:w-40 sm:h-40 lg:w-50 lg:h-50 rounded-lg p-4 bg-amber-600 text-center mx-auto">
              <h3 className="text-2xl lg:text-3xl font-bangers">
                Affiliation {character.affiliation}
              </h3>
              <span className="text-4xl sm:text-6xl lg:text-7xl">
                <SiRedragon />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
