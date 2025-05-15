import { useState } from "react";
import { NavLink } from "react-router";

export default function Navbar() {
  //====== NAVLINKS TYPE
  type navLinksType = {
    label: string;
    linkTo?: string;
  };

  //====== The navLinks follow the structure of the navLinksType[]
  const navLinks: navLinksType[] = [
    { label: "Home", linkTo: "/" },
    { label: "Characters", linkTo: "/characters" },
  ];

  //====== STATE WHICH HANDLES THE OPENING AND THE CLOSURE OF THE NAVBAR (mobile)
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-amber-600 text-gray-900 z-10">
      <div className="container px-4 h-15 md:h-20 flex items-center justify-between md:max-w-4xl lg:max-w-7xl mx-auto">
        {/*=========== Logo Wrapper ===========*/}
        <NavLink to={"/"} className={"flex items-center gap-1"}>
          <h2 className="text-3xl md:text-4xl uppercase font-bangers bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
            Dragon Ball
          </h2>
          <img
            src="https://i.ebayimg.com/images/g/cGgAAOSwIJVhsrHl/s-l400.png"
            alt="Sphere"
            className="size-10 md:size-15"
          />
        </NavLink>

        {/*=========== Links ===========*/}
        <ul className="hidden md:flex items-center gap-2 text-[1.2rem] font-semibold uppercase">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={`${link.linkTo}`}
              className={
                "text-2xl md:text-3xl uppercase font-bangers bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent"
              }
            >{`${link.label}`}</NavLink>
          ))}
        </ul>

        {/* =========== MENU ICON =========== */}
        <img
          src="https://png.pngtree.com/png-vector/20221208/ourmid/pngtree-4-dragon-ball-icon-vector-drgon-illustrtion-png-image_6515607.png"
          alt="Sphere"
          className={`size-10 cursor-pointer transition duration-200 md:hidden ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          aria-label="Open Menu"
        />

        {/* =========== MOBILE MENU/NAVBAR =========== */}
        <ul
          className={`absolute flex flex-col items-center gap-1.5 text-[1.1rem] -top-300 right-3 bg-amber-600 px-1 py-3 rounded-lg ring-2 ring-amber-400 opacity-0 ${
            isOpen ? "top-20 transition-opacity duration-300 opacity-100" : ""
          }`}
        >
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={`${link.linkTo}`}
              className={
                "text-2xl md:text-3xl uppercase font-bangers bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent"
              }
              onClick={() => setIsOpen(false)}
            >{`${link.label}`}</NavLink>
          ))}
        </ul>
      </div>
    </header>
  );
}
