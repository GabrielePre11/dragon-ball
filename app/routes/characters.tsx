import { useEffect, useState } from "react";
import type { Route } from "./+types/characters";

/*============= BUTTONS ICONS =============*/
// Previous and Next Page
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";

// Go Back Button
import { RiArrowGoBackFill } from "react-icons/ri";
import { Link } from "react-router";

/*============= INTERFACES AND ENUMS =============*/

// CHARACTER'S INTERFACE

/*
- This interface handles the structure for the Character, with all the infos and its types needed from the API.
- Since the API returns an array of objects (the characters [items], in the characters useState I specify that it'll 
be an array with <Character[]>.)
- On the other hand, when the user searches a character, the API still returns an array of objects, but with just ONE Character[], 
which will be the character that the user has searched (ex. Goku).
*/
interface Character {
  id: number;
  name: string;
  race: string;
  gender: string;
  affiliation: string;
  image: string;
}

// API'S DATA INTERFACE

/*
  - This interface defines the expected structure of the response returned by the API.
  - By default the API (which returns all characters) provides:
    1. items: an array of character objects, each following the structure defined in the Character interface.
    2. meta: an object that contains nested objects with pagination informations:
        - totalItems: the total number of characters available.
        - totalPages: the total number of pages based on the pagination limit.
        - currentPage: the current page number the user is viewing.
*/
interface ApiResponse {
  items: Character[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

// ENUMS

/*
- To filter the race and the gender of the characters I decided to use the enums, and their
values match the official documentation of the API.
*/

// Race
enum Race {
  Human = "Human",
  Saiyan = "Saiyan",
  Namekian = "Namekian",
  Android = "Android",
  FriezaRace = "Frieza Race",
  JirenRace = "Jiren Race",
  God = "God",
  Angel = "Angel",
  Evil = "Evil",
  Nucleico = "Nucleico",
  NucleicoBenigno = "Nucleico benigno",
  Unknown = "Unknown",
}

// Gender
enum Gender {
  Male = "Male",
  Female = "Female",
  Unknown = "Unknown",
}

/*============= CLIENT LOADER =============*/

/*
  - It runs before rendering the component to provide the needed data.
  - It handles the fetching process and error checking.
  - The function fetches the first page (`page=1`) with a limit of 10 characters per request.
*/
export async function clientLoader() {
  const dragonUrl = "https://dragonball-api.com/api/characters?page=1&limit=10";

  try {
    // Fetching the url...
    const res = await fetch(dragonUrl);

    // If the response is not okay (ex. 404) it throws an error.
    if (!res.ok) {
      throw new Error("Failed to fetch data.");
    }
    // The data follows the structure of ApiResponse's interface and it will be converted to JSON.
    const data: ApiResponse = await res.json();

    // The data is returned, so that it can be used from the components.
    return data;
  } catch (error: unknown) {
    console.log(error);
  }
}

/*============= CHARACTERS COMPONENT =============*/

/*
  - This is the Characters component, responsible for displaying the list of characters.
  - It receives loaderData from the clientLoader, which includes:
    - items: the array of Character objects
    - meta: pagination info (ex. totalItems, totalPages, currentPage)
*/
export default function Characters({ loaderData }: Route.ComponentProps) {
  /*============= STATES =============*/

  // STATE TO DISPLAY ALL THE CHARACTERS

  /*
  - loaderData?.items uses optional chaining (.?) to safely access the items property, avoiding errors if loaderData is undefined.
  - The nullish coalescing operator (??) checks if loaderData?.items is null or undefined. If it is, it returns an empty array [] 
  - to prevent runtime errors.
  */
  const [characters, setCharacters] = useState<Character[]>(
    loaderData?.items ?? []
  );

  // STATE TO DISPLAY THE CHARACTER THAT THE USER IS LOOKING FOR

  /*
  - Initially, it's set to null because no character has been searched yet.
  - When the user submits a valid search (ex. Goku, Vegeta, Celula [The creator of the API is Spanish]), 
  - the API returns a character object, which will follow the structure defined by the <Character> interface.
  */
  const [character, setCharacter] = useState<Character | null>(null);

  // STATES TO HANDLE PAGINATION

  /*
  - ====CURRENTPAGE ==== keeps track of the current page the user is on. 
  - It's initialized to 1, since the API starts from page 1.

  - ==== TOTALPAGES ==== stores the total number of pages available, based on the API response.
  - It's also initialized to 1 by default and updated once the data is fetched.
  */
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // STATE FOR HANDLING POSSIBLE ERRORS, BY DEFAULT IT'S SET TO FALSE
  // ('cause there are no errors).
  const [error, setError] = useState<boolean>(false);

  // STATES TO HANDLE THE USER'S SEARCH

  /*
  - searchName stores the value typed by the user in the input field.
  - This state is then used to fetch a specific character based on the input.
  */
  const [searchName, setSearchName] = useState<string>("");

  /*============= STATES TO HANDLE FILTERS FOR RACE AND GENDER =============*/

  /*
  - selectedRace and selectedGender store the user's filter selection.
  - They follow the structures of the enums Race and Gender.
  - Their initial values are NULL, which means that no filter is applied.
  - The values will update based on the user's interaction with the <select> dropdowns.
  */
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  /*
  - These FUNCTIONS update the filter states whenever the user selects a new value from the dropdowns.
  - The event's target value is cast as Race or Gender because the <select> element returns a string,
  - but we want to enforce the correct type with the enums.
  */

  // Race
  const handleRaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRace(event.target.value as Race);
  };

  // Gender
  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(event.target.value as Gender);
  };

  /*============= FUNCTIONS =============*/

  // FUNCTION TO LOAD CHARACTERS WITH PAGINATION

  /*
  - The loadCharacters function is used to fetch the character data from the API. It accepts a 'page' argument to determine which page of characters to fetch.
  - It constructs the API URL dynamically based on the page number and limits the number of characters per page to 12.
  - If the fetch operation is successful, it updates the state with the fetched data (characters and total pages) and sets the error state to false.
  - In case of error, it logs the error and sets the error state (setError) to true.
  */

  const loadCharacters = async (page: number) => {
    try {
      const res = await fetch(
        `https://dragonball-api.com/api/characters?page=${page}&limit=12`
      );
      if (!res.ok) throw new Error("Errore nel fetch");

      const data: ApiResponse = await res.json();
      setCharacters(data.items); // Updates the characters state with the fetched items
      setTotalPages(data.meta.totalPages); // Sets the totalPages state based on the API response
      setError(false); // If there's no error sets the value of Error to false.
    } catch (err: unknown) {
      console.error(err); // Logs any errors to the console for debugging
      setError(true); // Indicates an error occurred while fetching data.
    }
  };

  // USE EFFECT TO LOAD CHARACTERS WHEN THE PAGE CHANGES

  /*
  - This useEffect is triggered whenever the currentPage state changes.
  - When the page is updated, it calls the loadCharacters function to fetch the characters for the new page.
  */
  useEffect(() => {
    loadCharacters(currentPage);
  }, [currentPage]);

  // FUNCTIONS TO GO TO THE PREVIOUS PAGE
  const goToPrevPage = (): void => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // FUNCTIONS TO GO TO THE NEXT PAGE
  const goToNextPage = (): void => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // IF THERE IS AN ERROR LOADING THE CHARACTER, RETURNS THIS JSX
  {
    error && (
      <h1 className="text-red-600 text-4xl text-center mt-10">
        There was an error loading the characters!
      </h1>
    );
  }

  // FUNCTION THAT ALLOWS THE USER SEARCH A CHARACTER BY TYPING A NAME
  const searchCharByName = async (name: string) => {
    try {
      // Fetching data with the name typed by the user ${name}...
      const res = await fetch(
        `https://dragonball-api.com/api/characters?name=${name}`
      );
      // If the response is not okay throw an Error
      if (!res.ok) throw new Error("Errore nel fetch");

      /*
      - The API returns an array of objects, even when searching by name.
      - The data is expected to match the Character[] interface (array of Character objects).
      - When the user searches "Goku", for example, the result is an array with a single object: [ { Goku's data } ].
      */
      const data: Character[] = await res.json();

      /*
      - If the array is empty, it means the character was not found.
      - In this case, setCharacter is set to null, and setError is set to true to show an error message.
      */
      if (data.length === 0) {
        setError(true);
        setCharacter(null);
        return;
      }

      /*
      - If data is found, it takes the first object in the array (data[0]) as the searched character.
      - Then it updates the character state (setCharacter) and clear any previous error (setError(false)).
      */
      setCharacter(data[0]);
      setError(false);
    } catch (error: unknown) {
      // Catching any other unexpected error
      console.error(error);
      setError(true);
    }
  };

  // FUNCTION THAT HANDLES THE CHARACTER SEARCH SUBMISSION
  const handleSearch = () => {
    /*
    - It checks if the user has typed something (not just spaces).
    - The function calls searchCharByName with the trimmed and lowercased value.
    - This (lowercased) treates ("goku" or "GOKU" as the same thing).
    */
    if (searchName.trim()) {
      searchCharByName(searchName.trim().toLocaleLowerCase());

      // After that the user has searched a character the input get cleaned.
      setSearchName("");
    }
  };

  // FUNCTION THAT CLEARS THE SEARCH AND RESET ANY ERROR STATE
  const handleReset = () => {
    // It sets the character value to null to return to the full list of characters
    setCharacter(null);

    // It clears any previous error
    setError(false);
  };

  // FUNCTION TO FILTER CHARACTERS BASED ON SELECTED RACE AND GENDER
  const filteredCharacters = characters.filter((character) => {
    // It checks if the character's race matches the selected race (enum)
    // If no race is selected, all characters match
    const matchesRace = !selectedRace || character.race === selectedRace;

    // It checks if the character's gender matches the selected gender (enum)
    // If no race is selected, all characters match
    const matchesGender =
      !selectedGender || character.gender === selectedGender;

    // Returns the characters that match both the selected filters
    return matchesRace && matchesGender;
  });

  return (
    <section className="py-24 overflow-x-hidden">
      <div className="container grid px-4 max-w-7xl mx-auto">
        {/*================ SECTION TITLE ================*/}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bangers bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent mt-4 mx-auto mb-15 px-4">
          ALL THE CHARACTERS
        </h1>

        {/*================ SEARCH WRAPPER ================*/}
        <div className="flex flex-col sm:flex-row sm:items-center relative mb-14 sm:mb-20 max-w-7xl mx-auto sm:gap-3">
          <input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => setSearchName(e.target.value)}
            value={searchName}
            /*
            - If the user presses Enter after typing a character's name
            - it runs the handleSearch() function.
            */
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="bg-transparent ring-2 ring-amber-700 w-full mb-3 sm:mb-0 rounded-full px-3 py-1.5 text-lg text-white outline-0"
          />
          <button
            className="bg-amber-300 text-lg w-full sm:w-max text-amber-800 font-semibold px-3 py-1 rounded-full ring ring-amber-700 ring-offset-2 cursor-pointer"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/*================ FILTERS WRAPPER ================*/}
        <div
          className="flex flex-col sm:flex-row items-center gap-3 mt-1.5 mb-18
        sm:max-w-6xl sm:mx-auto"
        >
          {/* RACE FILTER */}
          <select
            id="race"
            // If no race is selected (null), it defaults to an empty string ("") to show "All Races".
            value={selectedRace ?? ""}
            onChange={handleRaceChange}
            className="bg-amber-300 text-lg w-full text-amber-800 font-semibold px-3 py-1 rounded-full ring ring-amber-700 ring-offset-2 cursor-pointer outline-0"
          >
            <option value="">All Races</option>
            {/* The rest of the options are dynamically generated from the Race enum values */}
            {Object.values(Race).map((race) => (
              <option value={race} key={race}>
                {race}
              </option>
            ))}
          </select>

          {/* GENDER FILTER */}
          <select
            id="gender"
            // If no gender is selected (null), it defaults to an empty string ("") to show "All Genders".
            value={selectedGender ?? ""}
            onChange={handleGenderChange}
            className="bg-amber-300 text-lg w-full text-amber-800 font-semibold px-1.5 py-1 rounded-full ring ring-amber-700 ring-offset-2 cursor-pointer outline-0"
          >
            <option value="">All Genders</option>
            {/* The rest of the options are dynamically generated from the Gender enum values */}
            {Object.values(Gender).map((gender) => (
              <option value={gender} key={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/*================ DISPLAY THE SINGLE CHARACTER ================*/}

        {/* 
        - If the character state is not NULL, display the card of a single character
         */}
        {character ? (
          <div className="text-white">
            <Link to={`/characters/${character.id}`}>
              <article className="relative flex flex-col items-center bg-amber-600 rounded-xl p-4 md:p-5 my-15 sm:my-52 lg:mt-52 cursor-pointer ring ring-amber-400 ring-offset-1 sm:max-w-[400px] sm:mx-auto">
                {/* ================ CHARACTER'S CARD ================ */}
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:-[400px] object-contain absolute -top-22 sm:-top-50 lg:-top-52 hover:drop-shadow-xl hover:drop-shadow-amber-400 transition-transform hover:scale-105 duration-300"
                />
                <div className="flex flex-col gap-2 items-center mt-24">
                  {/* ================ CHARACTER'S NAME ================ */}
                  <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl uppercase font-bangers">
                    {character.name}
                  </h3>

                  <div className="flex flex-col md:flex-row items-center gap-3 mt-2 text-center">
                    {/* ================ CHARACTER'S RACE ================ */}
                    <span className="bg-amber-300 text-sm w-full md:w-max text-amber-800 font-semibold px-2 py-1 rounded-full ring ring-amber-700 ring-offset-2">
                      {character.race}
                    </span>

                    {/* ================ CHARACTER'S AFFILIATION ================ */}
                    <span className="bg-amber-300 text-sm w-full md:w-max text-amber-800 font-semibold px-1.5 py-1 rounded-full ring ring-amber-700 ring-offset-2">
                      {character.affiliation}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        ) : (
          // ================ DISPLAY ALL THE CHARACTERS ================ //

          /*
          - When there is no specific character being searched (character === null)
          - and no filters are applied (selectedRace and selectedGender are null),
          - show the full list of characters.
          */
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5 mt-10 lg:mt-30">
            {filteredCharacters.map(
              ({ id, name, race, affiliation, image }) => (
                // ================ CHARACTER'S CARD ================ //
                <li
                  key={id}
                  className="relative flex flex-col items-center bg-amber-600 rounded-xl p-4 md:p-5 my-15 lg:mt-25 cursor-pointer ring ring-amber-400 ring-offset-1"
                >
                  <Link to={`/characters/${id}`}>
                    {/* ================ CHARACTER'S IMAGE ================ */}
                    <figure className="grid place-items-center">
                      <img
                        src={image}
                        alt={name}
                        className="w-[200px] h-[200px] lg:w-60 lg:h-60 object-contain absolute -top-22 lg:-top-35 hover:drop-shadow-xl hover:drop-shadow-amber-400 transition-transform hover:scale-105 duration-300"
                      />
                    </figure>

                    {/* ================ CHARACTER'S NAME ================ */}
                    <div className="flex flex-col gap-2 items-center mt-24">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl uppercase font-bangers">
                        {name}
                      </h3>

                      {/* ================ CHARACTER'S RACE AND AFFILIATION ================ */}
                      <div className="flex flex-col md:flex-row items-center gap-3 mt-2 text-center">
                        {/* Race */}
                        <span className="bg-amber-300 text-sm w-full md:w-max text-amber-800 font-semibold px-2 py-1 rounded-full ring ring-amber-700 ring-offset-2">
                          {race}
                        </span>

                        {/* Affiliation */}
                        <span className="bg-amber-300 text-sm w-full md:w-max text-amber-800 font-semibold px-1.5 py-1 rounded-full ring ring-amber-700 ring-offset-2">
                          {affiliation}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            )}
          </ul>
        )}

        {/* ================ PAGINATION AND GO BACK BUTTON <--- [IF THE USER HAS SEARCHED A CHARACTER] ================ */}
        <div className="flex justify-center items-center">
          {/* 
          - If the user has searched for a specific character (character !== null), 
          a "GO BACK" button is shown to reset the search and return to the full list.
  
          - Otherwise, the pagination controls are displayed, allowing the user 
          to navigate through the pages of characters.
          */}
          {character ? (
            // If a character has been searched, show a "Go Back" button
            <button
              // Calls the handleReset function to clear search results and filters
              onClick={handleReset}
              className="flex items-center gap-2 bg-amber-300 text-lg w-max text-amber-800 font-semibold px-1.5 py-1 rounded-full ring ring-amber-700 ring-offset-2 cursor-pointer hover:shadow-2xl hover:shadow-amber-300 transition-shadow duration-200"
            >
              Torna indietro
              <RiArrowGoBackFill />
            </button>
          ) : (
            // Otherwise, display pagination controls

            // ======== Go to previous page (disabled on first page)
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 justify-center bg-amber-300 text-lg w-full md:w-max text-amber-800 font-semibold px-3 py-1 rounded-full ring ring-amber-700 ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GrLinkPrevious />
                Prev
              </button>

              {/* Shows the current page (highlighted in amber) and the total number of pages (ex. Page 2 of 5)*/}
              <span className="text-lg font-semibold">
                Page{" "}
                <span className="font-bangers text-amber-400">
                  {currentPage}
                </span>{" "}
                di{" "}
                <span className="font-bangers text-amber-600">
                  {totalPages}
                </span>
              </span>

              {/* ======== Go to next page (disabled on last page) */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 justify-center bg-amber-300 text-lg w-full md:w-max text-amber-800 font-semibold px-3 py-1 rounded-full ring ring-amber-700 ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <GrLinkNext />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
