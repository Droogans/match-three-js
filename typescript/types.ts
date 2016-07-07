export interface Board {
    width: number,
    height: number,
    types: any[],
    orbs: any[],
    attic?: any,
    generateOrbs(): void,
    evaluate(): MatchData,
    needsShuffle(): boolean,
    hasPotentialMatch(): boolean,
    hasMatch(): boolean,
    unmatch(): void,
    shuffle(): void
}

export type MatchData = [any, number][]

export interface BlanksBelow {
	[coord: string]: number
}

export type Coord = [number, number]

export interface PositionInfo {
	position: {
		first: Coord,
		last: Coord
	}
}

export type IterchunksWithPosition = [
	[
		any[],
		any[],
		PositionInfo
	][]
]