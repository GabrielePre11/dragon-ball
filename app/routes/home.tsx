import type { Route } from "./+types/home";
import { Link } from "react-router";

// Metatags
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dragon Ball" },
    { name: "description", content: "Welcome to Dragon Ball!" },
  ];
}

export default function Home() {
  return (
    <section className="pt-30 md:pt-40">
      <div className="container mx-auto px-4 md:max-w-4xl lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-2.5">
        {/*============= Hero Content =============*/}
        <div className="flex flex-col">
          <span className="bg-amber-300 text-sm w-max text-amber-800 font-semibold px-1.5 py-1 rounded-full ring ring-amber-700 ring-offset-2">
            Esplora tutti i tuoi personaggi preferiti
          </span>

          {/*============= Hero Title =============*/}
          <h1 className="text-7xl md:text-8xl font-bangers bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent mt-4">
            DRAGON BALL <span className="text-amber-300">CHARACTERS</span>
          </h1>
          <p className="text-gray-100 text-sm md:text-[15px] lg:text-lg md:max-w-[500px] py-5">
            Benvenuto! Qui troverai tutti i personaggi del leggendario Dragon
            Ball, e inoltre, cliccando su uno dei personaggi, potrai vedere
            dettagli e tanto altro! Sei pronto?
          </p>

          {/*============= Hero Buttons =============*/}
          <Link to={"/characters"}>
            <button className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-300 to-amber-600 w-max rounded-full px-3 py-1.5 text-amber-900 font-bold uppercase cursor-pointer ring-2 ring-amber-300 mt-3 hover:shadow-lg shadow-amber-500 transition-shadow duration-200">
              <h3 className="lg:text-lg">Vai ai personaggi</h3>
              <img
                src="https://th.bing.com/th/id/R.18562ed8f889621eccd0c1bc38dd923e?rik=1%2fonqdqsVEk6Sg&riu=http%3a%2f%2fvignette2.wikia.nocookie.net%2fdragonball%2fimages%2f5%2f50%2fKanji_Goku.png%2frevision%2flatest%3fcb%3d20150730191256%26path-prefix%3des&ehk=BDL1QyX8dzBk%2bWIoP6JiBb%2fYiHU%2bUFlU0pGUFTMwTtg%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"
                alt="Kanji"
                className="size-8"
              />
            </button>
          </Link>
        </div>

        {/*============= Hero Image =============*/}
        <figure className="grid place-content-center">
          <img
            src="https://www.pngplay.com/wp-content/uploads/12/Shenron-Transparent-Image.png"
            alt="Shenron Dragon"
            className="w-full mt-10 md:mt-20 lg:mt-0"
          />
        </figure>
      </div>
    </section>
  );
}
