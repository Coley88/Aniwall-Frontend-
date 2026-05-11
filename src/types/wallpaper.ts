export interface Wallpaper {
  id: string;
  url: string;
  short_url: string;
  views: number;
  favorites: number;
  source: string;
  purity: string;
  category: string;
  dimension_x: number;
  dimension_y: number;
  resolution: string;
  ratio: string;
  file_size: number;
  file_type: string;
  created_at: string;
  colors: string[];
  path: string;
  thumbs: {
    large: string;
    original: string;
    small: string;
  };
}

export interface WallpaperMeta {
  current_page: number;
  last_page: number;
  per_page: string;
  total: number;
  query: string | null;
  seed: string | null;
}

export interface WallpaperResponse {
  data: Wallpaper[];
  meta: WallpaperMeta;
}

export interface FavoriteWallpaper {
  id: string;
  path: string;
  thumb: string;
  resolution: string;
  ratio: string;
  file_type: string;
  colors: string[];
  views: number;
  favorites: number;
  created_at: string;
}

export type SortOption = 'toplist' | 'date_added' | 'views' | 'favorites' | 'random';
export type WallpaperSource = 'wallhaven' | 'konachan' | 'yandere' | 'danbooru' | 'safebooru';

export interface SearchParams {
  q: string;
  sorting: SortOption;
  page: number;
  ratio: string;
  source: WallpaperSource;
}
