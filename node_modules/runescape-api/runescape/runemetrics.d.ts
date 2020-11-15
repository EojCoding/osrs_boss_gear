import { Quest, RuneMetricsMonthlyExperience, RuneMetricsProfile, Skill } from "../lib/RuneScape";
export declare const getMonthlyXp: (name: string, skill: number | Skill) => Promise<RuneMetricsMonthlyExperience>;
export declare const getProfile: (name: string) => Promise<RuneMetricsProfile>;
export declare const getQuests: (name: string) => Promise<Quest[]>;
//# sourceMappingURL=runemetrics.d.ts.map