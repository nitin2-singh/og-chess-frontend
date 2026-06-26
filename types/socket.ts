export interface JoinRoomPayload {
  roomId: string;
}

export interface MovePayload {
  roomId: string;
  from: string;
  to: string;
  promotion?: string;
}

export interface MoveMadeEvent {
  move: {
    from: string;
    to: string;
    san: string;
    captured?: string;
    color: "w" | "b";
  };

  fen: string;

  turn: "w" | "b";

  check: boolean;

  checkmate: boolean;

  draw: boolean;

  gameOver: boolean;
}

export interface JoinRoomResponse {
  success: boolean;

  roomId: string;

  fen: string;
}
