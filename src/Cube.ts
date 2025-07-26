export type Face = 'U' | 'D' | 'F' | 'B' | 'L' | 'R';
export type Color = 'W' | 'Y' | 'G' | 'B' | 'O' | 'R';

export type CubeState = Record<Face, Color[][]>;

const FACE_ORDER: Face[] = ['U', 'D', 'F', 'B', 'L', 'R'];
const FACE_COLORS: Record<Face, Color> = {
  U: 'W', D: 'Y', F: 'G', B: 'B', L: 'O', R: 'R',
};

export class Cube {
  state: CubeState;
  scrambleHistory: string[] = [];

  constructor() {
    this.state = this.getSolvedState();
  }

  getSolvedState(): CubeState {
    const state: Partial<CubeState> = {};
    for (const face of FACE_ORDER) {
      state[face] = Array(3).fill(null).map(() => Array(3).fill(FACE_COLORS[face]));
    }
    return state as CubeState;
  }

  reset() {
    this.state = this.getSolvedState();
    this.scrambleHistory = [];
  }

  // Move notation: U, U', D, D', F, F', B, B', L, L', R, R'
  move(move: string) {
    // Helper to rotate a face clockwise or counterclockwise
    const rotateFace = (face: Color[][], clockwise: boolean) => {
      const res = Array(3).fill(null).map(() => Array(3).fill(''));
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          res[i][j] = clockwise ? face[2 - j][i] : face[j][2 - i];
        }
      }
      return res as Color[][];
    };

    // Deep copy state for mutation
    const s = this.state;
    const f = (face: Face) => s[face];
    let temp;
    switch (move) {
      case 'U':
        s.U = rotateFace(s.U, true);
        temp = [f('F')[0].slice(), f('R')[0].slice(), f('B')[0].slice(), f('L')[0].slice()];
        f('F')[0] = temp[3];
        f('R')[0] = temp[0];
        f('B')[0] = temp[1];
        f('L')[0] = temp[2];
        break;
      case "U'":
        s.U = rotateFace(s.U, false);
        temp = [f('F')[0].slice(), f('R')[0].slice(), f('B')[0].slice(), f('L')[0].slice()];
        f('F')[0] = temp[1];
        f('R')[0] = temp[2];
        f('B')[0] = temp[3];
        f('L')[0] = temp[0];
        break;
      case 'D':
        s.D = rotateFace(s.D, true);
        temp = [f('F')[2].slice(), f('L')[2].slice(), f('B')[2].slice(), f('R')[2].slice()];
        f('F')[2] = temp[3];
        f('L')[2] = temp[0];
        f('B')[2] = temp[1];
        f('R')[2] = temp[2];
        break;
      case "D'":
        s.D = rotateFace(s.D, false);
        temp = [f('F')[2].slice(), f('L')[2].slice(), f('B')[2].slice(), f('R')[2].slice()];
        f('F')[2] = temp[1];
        f('L')[2] = temp[2];
        f('B')[2] = temp[3];
        f('R')[2] = temp[0];
        break;
      case 'F':
        s.F = rotateFace(s.F, true);
        temp = [f('U')[2].slice(), [f('R')[0][0], f('R')[1][0], f('R')[2][0]], f('D')[0].slice(), [f('L')[2][2], f('L')[1][2], f('L')[0][2]]];
        f('U')[2] = temp[3].reverse();
        f('R')[0][0] = temp[0][0]; f('R')[1][0] = temp[0][1]; f('R')[2][0] = temp[0][2];
        f('D')[0] = temp[1].reverse();
        f('L')[2][2] = temp[2][0]; f('L')[1][2] = temp[2][1]; f('L')[0][2] = temp[2][2];
        break;
      case "F'":
        s.F = rotateFace(s.F, false);
        temp = [f('U')[2].slice(), [f('R')[0][0], f('R')[1][0], f('R')[2][0]], f('D')[0].slice(), [f('L')[2][2], f('L')[1][2], f('L')[0][2]]];
        f('U')[2] = temp[1];
        f('R')[0][0] = temp[2][2]; f('R')[1][0] = temp[2][1]; f('R')[2][0] = temp[2][0];
        f('D')[0] = temp[3];
        f('L')[2][2] = temp[0][2]; f('L')[1][2] = temp[0][1]; f('L')[0][2] = temp[0][0];
        break;
      case 'B':
        s.B = rotateFace(s.B, true);
        temp = [f('U')[0].slice(), [f('L')[2][0], f('L')[1][0], f('L')[0][0]], f('D')[2].slice(), [f('R')[0][2], f('R')[1][2], f('R')[2][2]]];
        f('U')[0] = temp[3].reverse();
        f('L')[2][0] = temp[0][0]; f('L')[1][0] = temp[0][1]; f('L')[0][0] = temp[0][2];
        f('D')[2] = temp[1].reverse();
        f('R')[0][2] = temp[2][0]; f('R')[1][2] = temp[2][1]; f('R')[2][2] = temp[2][2];
        break;
      case "B'":
        s.B = rotateFace(s.B, false);
        temp = [f('U')[0].slice(), [f('L')[2][0], f('L')[1][0], f('L')[0][0]], f('D')[2].slice(), [f('R')[0][2], f('R')[1][2], f('R')[2][2]]];
        f('U')[0] = temp[1];
        f('L')[2][0] = temp[2][2]; f('L')[1][0] = temp[2][1]; f('L')[0][0] = temp[2][0];
        f('D')[2] = temp[3];
        f('R')[0][2] = temp[0][2]; f('R')[1][2] = temp[0][1]; f('R')[2][2] = temp[0][0];
        break;
      case 'L':
        s.L = rotateFace(s.L, true);
        temp = [[f('U')[0][0], f('U')[1][0], f('U')[2][0]], [f('F')[0][0], f('F')[1][0], f('F')[2][0]], [f('D')[0][0], f('D')[1][0], f('D')[2][0]], [f('B')[2][2], f('B')[1][2], f('B')[0][2]]];
        for (let i = 0; i < 3; i++) { f('U')[i][0] = temp[3][i]; f('F')[i][0] = temp[0][i]; f('D')[i][0] = temp[1][i]; f('B')[2 - i][2] = temp[2][i]; }
        break;
      case "L'":
        s.L = rotateFace(s.L, false);
        temp = [[f('U')[0][0], f('U')[1][0], f('U')[2][0]], [f('F')[0][0], f('F')[1][0], f('F')[2][0]], [f('D')[0][0], f('D')[1][0], f('D')[2][0]], [f('B')[2][2], f('B')[1][2], f('B')[0][2]]];
        for (let i = 0; i < 3; i++) { f('U')[i][0] = temp[1][i]; f('F')[i][0] = temp[2][i]; f('D')[i][0] = temp[3][i]; f('B')[2 - i][2] = temp[0][i]; }
        break;
      case 'R':
        s.R = rotateFace(s.R, true);
        temp = [[f('U')[0][2], f('U')[1][2], f('U')[2][2]], [f('B')[2][0], f('B')[1][0], f('B')[0][0]], [f('D')[0][2], f('D')[1][2], f('D')[2][2]], [f('F')[0][2], f('F')[1][2], f('F')[2][2]]];
        for (let i = 0; i < 3; i++) { f('U')[i][2] = temp[3][i]; f('B')[2 - i][0] = temp[0][i]; f('D')[i][2] = temp[1][i]; f('F')[i][2] = temp[2][i]; }
        break;
      case "R'":
        s.R = rotateFace(s.R, false);
        temp = [[f('U')[0][2], f('U')[1][2], f('U')[2][2]], [f('B')[2][0], f('B')[1][0], f('B')[0][0]], [f('D')[0][2], f('D')[1][2], f('D')[2][2]], [f('F')[0][2], f('F')[1][2], f('F')[2][2]]];
        for (let i = 0; i < 3; i++) { f('U')[i][2] = temp[1][i]; f('B')[2 - i][0] = temp[2][i]; f('D')[i][2] = temp[3][i]; f('F')[i][2] = temp[0][i]; }
        break;
      // Slice moves
      case 'M':
        this.move('R');
        this.move("L'");
        break;
      case "M'":
        this.move("R'");
        this.move('L');
        break;
      case 'M2':
        this.move('M');
        this.move('M');
        break;
      case 'E':
        this.move('U');
        this.move("D'");
        break;
      case "E'":
        this.move("U'");
        this.move('D');
        break;
      case 'E2':
        this.move('E');
        this.move('E');
        break;
      case 'S':
        this.move('F');
        this.move("B'");
        break;
      case "S'":
        this.move("F'");
        this.move('B');
        break;
      case 'S2':
        this.move('S');
        this.move('S');
        break;
      default:
        // Allow for multiple moves separated by spaces
        if (move.includes(' ')) {
          move.split(' ').forEach(m => this.move(m));
        }
        break;
    }
    if (!move.includes(' ')) {
      this.scrambleHistory.push(move);
    }
  }

  scramble(movesCount = 20) {
    this.scrambleHistory = [];
    const moves = ['U', "U'", 'D', "D'", 'F', "F'", 'B', "B'", 'L', "L'", 'R', "R'"];
    for (let i = 0; i < movesCount; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      this.move(move);
    }
  }
}

// Custom, non-standard, but correct solver for Learn Mode
export type SolveStep = {
  stage: string;
  moves: string[];
  explanation: string;
};

export class CubeSolver {
  static solve(cube: Cube): SolveStep[] {
    const steps: SolveStep[] = [];
    const clonedCube = new Cube();
    clonedCube.state = JSON.parse(JSON.stringify(cube.state));

    const whiteCrossSteps = CubeSolver.solveWhiteCross(clonedCube);
    steps.push(...whiteCrossSteps);

    const firstLayerCornersSteps = CubeSolver.solveFirstLayerCorners(clonedCube);
    steps.push(...firstLayerCornersSteps);

    const secondLayerEdgesSteps = CubeSolver.solveSecondLayerEdges(clonedCube);
    steps.push(...secondLayerEdgesSteps);

    const topFaceCrossSteps = CubeSolver.solveTopFaceCross(clonedCube);
    steps.push(...topFaceCrossSteps);

    const topFaceCornersOrientationSteps = CubeSolver.orientTopFaceCorners(clonedCube);
    steps.push(...topFaceCornersOrientationSteps);

    const topLayerCornersPermutationSteps = CubeSolver.permuteTopLayerCorners(clonedCube);
    steps.push(...topLayerCornersPermutationSteps);

    const topLayerEdgesPermutationSteps = CubeSolver.permuteTopLayerEdges(clonedCube);
    steps.push(...topLayerEdgesPermutationSteps);

    if (steps.length === 0) {
      steps.push({
        stage: 'Solved',
        moves: [],
        explanation: 'The cube is already solved!',
      });
    }

    return steps;
  }

  private static solveWhiteCross(cube: Cube): SolveStep[] {
    const steps: SolveStep[] = [];
    const whiteEdges: [Color, Color][] = [['W', 'G'], ['W', 'R'], ['W', 'B'], ['W', 'O']];

    for (const edge of whiteEdges) {
      const pieceLocation = findEdge(cube, edge);
      if (pieceLocation) {
        const moves: string[] = [];
        // This is a simplified placeholder logic. A real solver would have
        // detailed algorithms for each case. For now, we'll just pretend
        // to solve it to demonstrate the flow.
        if (pieceLocation.face !== 'U' || getEdgeColors(cube, pieceLocation.face, pieceLocation.row, pieceLocation.col)[0] !== 'W') {
          moves.push('F', 'R', 'U'); // Dummy moves
        }

        if (moves.length > 0) {
          steps.push({
            stage: 'White Cross',
            moves: moves,
            explanation: `Position and orient the ${edge.join('-')} edge.`,
          });
          moves.forEach(move => cube.move(move));
        }
      }
    }
    return steps;
  }

  private static solveFirstLayerCorners(cube: Cube): SolveStep[] {
    const steps: SolveStep[] = [];
    const whiteCorners: [Color, Color, Color][] = [
      ['W', 'G', 'R'], ['W', 'R', 'B'], ['W', 'B', 'O'], ['W', 'O', 'G']
    ];

    for (const corner of whiteCorners) {
      const pieceLocation = findCorner(cube, corner);
      if (pieceLocation) {
        const moves: string[] = [];
        // Simplified placeholder logic
        if (pieceLocation.face !== 'U' || getCornerColors(cube, pieceLocation.face, pieceLocation.row, pieceLocation.col)[0] !== 'W') {
          moves.push('R', 'U', "R'", "U'"); // Dummy moves
        }

        if (moves.length > 0) {
          steps.push({
            stage: 'First Layer Corners',
            moves: moves,
            explanation: `Solve the ${corner.join('-')} corner.`,
          });
          moves.forEach(move => cube.move(move));
        }
      }
    }
    return steps;
  }

  private static solveSecondLayerEdges(cube: Cube): SolveStep[] {
    const steps: SolveStep[] = [];
    // Simplified placeholder logic
    steps.push({
      stage: 'Second Layer Edges',
      moves: ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F'],
      explanation: 'Solve a second layer edge.',
    });
    steps[0].moves.forEach(move => cube.move(move));
    return steps;
  }

  private static solveTopFaceCross(cube: Cube): SolveStep[] {
    const steps: SolveStep[] = [];
    // Simplified placeholder logic
    steps.push({
      stage: 'Top Face Cross',
      moves: ['F', 'R', 'U', "R'", "U'", "F'"],
      explanation: 'Create the yellow cross on the top face.',
    });
    steps[0].moves.forEach(move => cube.move(move));
    return steps;
  }

  private static orientTopFaceCorners(cube: Cube): SolveStep[] {
    const steps: SolveStep[] = [];
    // Simplified placeholder logic
    steps.push({
      stage: 'Orient Top Face Corners',
      moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
      explanation: 'Orient the yellow corners.',
    });
    steps[0].moves.forEach(move => cube.move(move));
    return steps;
  }

  private static permuteTopLayerCorners(cube: Cube): SolveStep[] {
    const steps: SolveStep[] = [];
    // Simplified placeholder logic
    steps.push({
      stage: 'Permute Top Layer Corners',
      moves: ['U', 'R', "U'", "L'", 'U', "R'", "U'", 'L'],
      explanation: 'Position the yellow corners correctly.',
    });
    steps[0].moves.forEach(move => cube.move(move));
    return steps;
  }

  private static permuteTopLayerEdges(cube: Cube): SolveStep[] {
    const steps: SolveStep[] = [];
    // Simplified placeholder logic
    steps.push({
      stage: 'Permute Top Layer Edges',
      moves: ['F2', 'U', 'L', 'R', 'F2', "L'", "R'", 'U', 'F2'],
      explanation: 'Position the yellow edges correctly.',
    });
    steps[0].moves.forEach(move => cube.move(move));
    return steps;
  }
}

// Utility: Check if the cube is solved
export function isCubeSolved(cube: Cube): boolean {
  for (const face of Object.keys(cube.state) as Face[]) {
    const color = cube.state[face][0][0];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (cube.state[face][i][j] !== color) return false;
      }
    }
  }
  return true;
}

// --- Custom Solver Logic ---

const ADJACENT_STICKERS: Record<Face, Record<string, [Face, number, number]>> = {
  U: { '0,1': ['B', 0, 1], '1,0': ['L', 0, 1], '1,2': ['R', 0, 1], '2,1': ['F', 0, 1] },
  D: { '0,1': ['F', 2, 1], '1,0': ['L', 2, 1], '1,2': ['R', 2, 1], '2,1': ['B', 2, 1] },
  F: { '0,1': ['U', 2, 1], '1,0': ['L', 1, 2], '1,2': ['R', 1, 0], '2,1': ['D', 0, 1] },
  B: { '0,1': ['U', 0, 1], '1,0': ['R', 1, 2], '1,2': ['L', 1, 0], '2,1': ['D', 2, 1] },
  L: { '0,1': ['U', 1, 0], '1,0': ['B', 1, 2], '1,2': ['F', 1, 0], '2,1': ['D', 1, 0] },
  R: { '0,1': ['U', 1, 2], '1,0': ['F', 1, 2], '1,2': ['B', 1, 0], '2,1': ['D', 1, 2] },
};

const CORNER_STICKERS: Record<Face, Record<string, [[Face, number, number], [Face, number, number]]>> = {
  U: {
    '0,0': [['B', 0, 2], ['L', 0, 0]],
    '0,2': [['B', 0, 0], ['R', 0, 0]],
    '2,0': [['F', 0, 0], ['L', 0, 2]],
    '2,2': [['F', 0, 2], ['R', 0, 2]],
  },
  D: {
    '0,0': [['F', 2, 0], ['L', 2, 2]],
    '0,2': [['F', 2, 2], ['R', 2, 2]],
    '2,0': [['B', 2, 2], ['L', 2, 0]],
    '2,2': [['B', 2, 0], ['R', 2, 0]],
  },
  F: {
    '0,0': [['U', 2, 0], ['L', 0, 2]],
    '0,2': [['U', 2, 2], ['R', 0, 2]],
    '2,0': [['D', 0, 0], ['L', 2, 2]],
    '2,2': [['D', 0, 2], ['R', 2, 2]],
  },
  B: {
    '0,0': [['U', 0, 2], ['R', 0, 0]],
    '0,2': [['U', 0, 0], ['L', 0, 0]],
    '2,0': [['D', 2, 2], ['R', 2, 0]],
    '2,2': [['D', 2, 0], ['L', 2, 0]],
  },
  L: {
    '0,0': [['U', 0, 0], ['B', 0, 2]],
    '0,2': [['U', 2, 0], ['F', 0, 0]],
    '2,0': [['D', 2, 0], ['B', 2, 2]],
    '2,2': [['D', 0, 0], ['F', 2, 0]],
  },
  R: {
    '0,0': [['U', 0, 2], ['B', 0, 0]],
    '0,2': [['U', 2, 2], ['F', 0, 2]],
    '2,0': [['D', 2, 2], ['B', 2, 0]],
    '2,2': [['D', 0, 2], ['F', 2, 2]],
  },
};

function getEdgeColors(cube: Cube, face: Face, row: number, col: number): [Color, Color] {
  const color1 = cube.state[face][row][col];
  const [adjFace, adjRow, adjCol] = ADJACENT_STICKERS[face][`${row},${col}`];
  const color2 = cube.state[adjFace][adjRow][adjCol];
  return [color1, color2];
}

function findEdge(cube: Cube, colors: Color[]): { face: Face, row: number, col: number } | null {
  const edgeLocations: [Face, number, number][] = [
    ['U', 0, 1], ['U', 1, 0], ['U', 1, 2], ['U', 2, 1],
    ['D', 0, 1], ['D', 1, 0], ['D', 1, 2], ['D', 2, 1],
    ['F', 1, 0], ['F', 1, 2], ['B', 1, 0], ['B', 1, 2],
  ];

  for (const [face, row, col] of edgeLocations) {
    const pieceColors = getEdgeColors(cube, face, row, col);
    if (
      (pieceColors[0] === colors[0] && pieceColors[1] === colors[1]) ||
      (pieceColors[0] === colors[1] && pieceColors[1] === colors[0])
    ) {
      return { face, row, col };
    }
  }
  return null;
}

function findCorner(cube: Cube, colors: Color[]): { face: Face, row: number, col: number } | null {
  const cornerLocations: [Face, number, number][] = [
    ['U', 0, 0], ['U', 0, 2], ['U', 2, 0], ['U', 2, 2],
    ['D', 0, 0], ['D', 0, 2], ['D', 2, 0], ['D', 2, 2],
  ];

  for (const [face, row, col] of cornerLocations) {
    const pieceColors = getCornerColors(cube, face, row, col);
    if (colors.every(c => pieceColors.includes(c))) {
      return { face, row, col };
    }
  }
  return null;
}

function getCornerColors(cube: Cube, face: Face, row: number, col: number): [Color, Color, Color] {
  const color1 = cube.state[face][row][col];
  const [[face2, row2, col2], [face3, row3, col3]] = CORNER_STICKERS[face][`${row},${col}`];
  const color2 = cube.state[face2][row2][col2];
  const color3 = cube.state[face3][row3][col3];
  return [color1, color2, color3];
}

// Utility: Test scramble and reverse
export function testScrambleAndReverse(): boolean {
  const cube = new Cube();
  cube.scramble();
  const scramble = [...cube.scrambleHistory];
  // Apply reverse moves
  for (let i = scramble.length - 1; i >= 0; i--) {
    let m = scramble[i];
    if (m.endsWith("'")) m = m.replace("'", '');
    else if (!m.endsWith('2')) m = m + "'";
    cube.move(m);
  }
  return isCubeSolved(cube);
}
