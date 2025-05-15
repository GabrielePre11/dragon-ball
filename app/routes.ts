import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  ...prefix("characters", [
    index("routes/characters.tsx"),
    route(":characterId", "routes/character.tsx"),
  ]),
] satisfies RouteConfig;
