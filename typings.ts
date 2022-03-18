export type ValueType =
  | 0
  | 2
  | 4
  | 8
  | 16
  | 32
  | 64
  | 128
  | 256
  | 512
  | 1024
  | 2048;

export interface TileProps {
  position: [number, number];
  value: ValueType;
}

export interface BoardProps {
  tiles: TileProps[];
}
