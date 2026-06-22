export enum PlayerColor {
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export enum GameResult {
  WHITE = "WHITE",
  BLACK = "BLACK",
  DRAW = "DRAW",
}

export enum GameStatus {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: number;
  updated_at: number;
}

export interface CreateRoomDto {
  name: string;
  color: PlayerColor;
}

export interface GetRoomsDto {
  page: number;
  limit: number;
  search?: string;
}

export interface RoomResponseDto {
  id: string;
  name: string;
  room_code: string;

  status: GameStatus;
  result: GameResult | null;

  white_player: User | null;
  black_player: User | null;
  created_by: User;
  winner: User | null;

  started_at: number;
  ended_at: number;
  created_at: number;
  updated_at: number;
}

export interface PaginatedRoomsDto {
  page: number;
  limit: number;

  total: number;
  total_pages: number;

  rooms: RoomResponseDto[];
}
