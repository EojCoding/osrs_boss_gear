import { Jagex, RuneScape } from "../types";
export declare class Area {
    name: string;
    constructor(area: Jagex.Bestiary.Area);
}
export declare class Beast {
    id: number;
    name: string;
    examine?: string;
    members?: boolean;
    level?: number;
    attack?: number;
    defence?: number;
    magic?: number;
    ranged?: number;
    lifepoints?: number;
    xp?: string;
    areas?: Jagex.Bestiary.Areas;
    animations?: Jagex.Bestiary.Animations;
    size?: number;
    attackable?: boolean;
    aggressive?: boolean;
    poisonous?: boolean;
    weakness?: Weakness;
    constructor(beast: Jagex.Bestiary.Beast);
    get meta(): {
        id: number;
        name: string;
        examine: string | undefined;
        members: boolean | undefined;
    };
    get combatModifiers(): {
        attackable: boolean | undefined;
        aggressive: boolean | undefined;
        poisonous: boolean | undefined;
        weakness: Weakness | undefined;
    };
    get combatStats(): {
        magic: number | undefined;
        defence: number | undefined;
        ranged: number | undefined;
        attack: number | undefined;
        lifepoints: number | undefined;
    };
}
export declare class BeastSearchResult {
    id: number;
    name: string;
    constructor(beast: Jagex.Bestiary.BeastBySearch);
}
export declare class ClanMember {
    name: string;
    rank: string;
    experience: number;
    kills: number;
    constructor(member: Jagex.Clan.Member);
}
export declare class GrandExchangeCategory {
    id: number;
    name: string;
    constructor(category: Jagex.GrandExchange.Category | number);
}
export declare class Item {
    id: number;
    name: string;
    examine: string;
    category: GrandExchangeCategory;
    members: boolean;
    icons: {
        default: string;
        large: string;
    };
    trends: {
        current: {
            trend: string;
            price: string;
        };
        today: {
            trend: string;
            price: string;
        };
        day30?: {
            trend: string;
            price: string;
        };
        day90?: {
            trend: string;
            price: string;
        };
        day180?: {
            trend: string;
            price: string;
        };
    };
    constructor(item: Jagex.GrandExchange.Item);
}
export declare class ItemGraph {
    id: number;
    daily: {
        [key: string]: number;
    };
    average: {
        [key: string]: number;
    };
    constructor(id: number, graph: Jagex.GrandExchange.ItemGraph);
}
export declare class Player {
    name: string;
    activities: Jagex.Hiscores.PlayerActivites;
    skills: Jagex.Hiscores.PlayerSkills;
    constructor(name: string, player: Jagex.Hiscores.PlayerJSON);
}
export declare class Quest {
    name: string;
    status: RuneScape.RuneMetrics.QuestStatus;
    difficulty: number;
    members: boolean;
    questPoints: number;
    eligible: boolean;
    constructor(quest: Jagex.RuneMetrics.Quest);
}
export declare class RuneMetricsMonthlyExperience {
    skill: Skill;
    totalExperience: number;
    totalGain: number;
    monthData: any[];
    constructor(monthlyExperienceGain: Jagex.RuneMetrics.MonthlyExperienceGain);
}
export declare class RuneMetricsProfile {
    name: string;
    combatLevel: number;
    activities: RuneScape.RuneMetrics.ProfileActivities[];
    overall: RuneScape.RuneMetrics.ProfileOverall;
    skills: RuneScape.RuneMetrics.ProfileSkills;
    quests: RuneScape.RuneMetrics.ProfileQuests;
    experience_distribution: RuneScape.RuneMetrics.ProfileExperienceDistribution;
    constructor(profile: Jagex.RuneMetrics.Profile);
}
export declare class Skill {
    id: number;
    name: string;
    constructor(skill: RuneScape.Hiscores.Skill | number);
}
export declare class SlayerCategory {
    id: number;
    name: string;
    constructor(category: string | number);
}
export declare class Weakness {
    id: number;
    name: string;
    constructor(weakness: Jagex.Bestiary.Weakness | number);
}
//# sourceMappingURL=RuneScape.d.ts.map