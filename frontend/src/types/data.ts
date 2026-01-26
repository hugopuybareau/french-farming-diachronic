export type SauClass = "[0,20)" | "[20,50)" | "[50,100)" | "[100,200)" | "[200+)" | "[0,50)";

export interface ClassData {
  nb_exploitations: number;
  sau: number;
}

export interface TotalData {
  nb_exploitations: number;
  sau: number;
}

export interface RegionData {
  code: string;
  name: string;
  by_class: Partial<Record<SauClass, ClassData>>;
  total: TotalData;
}

export interface DepartmentData {
  code: string;
  region_name: string;
  by_class: Partial<Record<SauClass, ClassData>>;
  total: TotalData;
}

export interface NationalData {
  by_class: Record<SauClass, ClassData>;
  total: TotalData;
}

export interface Metadata {
  source: string;
  description: string;
  url: string;
  sau_classes: string[];
  indicators: {
    nb_exploitations: string;
    sau: string;
  };
}

export interface RA2020Data {
  metadata: Metadata;
  national: NationalData;
  regions: RegionData[];
  departments: DepartmentData[];
}

export type MapLevel = "regions" | "departments";
export type Indicator = "nb_exploitations" | "sau";
export type SizeFilter = "all" | SauClass;

export interface TooltipData {
  name: string;
  code: string;
  nb_exploitations: number;
  sau: number;
  x: number;
  y: number;
}
