import { GrandExchangeCategory, Item, ItemGraph } from "../lib/RuneScape";
import { AlphaNumeric, Jagex } from "../types";
export declare const getCategories: () => Promise<GrandExchangeCategory[]>;
export declare const getCategoryCounts: (category: number | GrandExchangeCategory) => Promise<{
    letter: string;
    items: number;
}[]>;
export declare const getCategoryCountsByPrefix: (categoryId: number | GrandExchangeCategory, prefix: AlphaNumeric, page?: number) => Promise<Jagex.GrandExchange.Item[]>;
export declare const getItem: (id: number) => Promise<Item>;
export declare const getItemGraph: (id: number) => Promise<ItemGraph>;
//# sourceMappingURL=grandexchange.d.ts.map