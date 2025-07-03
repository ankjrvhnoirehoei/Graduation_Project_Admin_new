export interface DateRange {
  label: string;
  start: Date;
  end: Date;
}

export interface Filters {
  platform: string;
  category: string;
  uploader: string;
}

export type TableType = "users" | "videos" | "performance";

export type RangeType = "7days" | "30days" | "year";