import axios from 'axios';
import type { WallpaperResponse, FavoriteWallpaper, Wallpaper, SortOption, WallpaperSource } from './types/wallpaper';

const BASE = import.meta.env.VITE_API_URL ?? '';
const api = axios.create({ baseURL: `${BASE}/api` });

export async function fetchWallpapers(params: {
  q?: string;
  sorting?: SortOption;
  page?: number;
  ratios?: string;
  source?: WallpaperSource;
}): Promise<WallpaperResponse> {
  const { data } = await api.get<WallpaperResponse>('/wallpapers', { params });
  return data;
}

export async function fetchFavorites(): Promise<FavoriteWallpaper[]> {
  const { data } = await api.get<FavoriteWallpaper[]>('/favorites');
  return data;
}

export async function fetchFavoriteIds(): Promise<string[]> {
  const { data } = await api.get<string[]>('/favorites/ids');
  return data;
}

export async function addFavorite(w: Wallpaper): Promise<void> {
  await api.post('/favorites', {
    id: w.id,
    path: w.path,
    thumb: w.thumbs.large,
    resolution: w.resolution,
    ratio: w.ratio,
    file_type: w.file_type,
    colors: w.colors,
    views: w.views,
    favorites: w.favorites,
  });
}

export async function removeFavorite(id: string): Promise<void> {
  await api.delete(`/favorites/${id}`);
}
