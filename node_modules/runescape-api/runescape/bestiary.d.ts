import { Area, Beast, BeastSearchResult, SlayerCategory, Weakness } from "../lib/RuneScape";
import { Letter } from "../types";
export declare const getAreas: () => Promise<Area[]>;
export declare const getBeast: (search: number | BeastSearchResult) => Promise<Beast>;
export declare const getBeastsByArea: (search: string | Area) => Promise<BeastSearchResult[]>;
export declare const getBeastsByFirstLetter: (search: Letter) => Promise<BeastSearchResult[]>;
export declare const getBeastsByLevelRange: (min: number, max: number) => Promise<BeastSearchResult[]>;
export declare const getBeastsBySlayerCategory: (search: number | SlayerCategory) => Promise<BeastSearchResult[]>;
export declare const getBeastsByTerms: (search: string) => Promise<BeastSearchResult[]>;
export declare const getBeastsByWeakness: (search: number | Weakness) => Promise<BeastSearchResult[]>;
export declare const getSlayerCategories: () => Promise<SlayerCategory[]>;
export declare const getWeaknesses: () => Promise<Weakness[]>;
//# sourceMappingURL=bestiary.d.ts.map