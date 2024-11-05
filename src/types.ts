export type AssetType = 'image' | 'video';
export type Orientation = 'landscape' | 'portrait';

export interface Asset {
  id: number;
  type: AssetType;
  url: string;
  thumbnail: string;
  width: number;
  height: number;
}