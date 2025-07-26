import { render } from './src/test-utils';
import { Cube } from './src/Cube';

describe('Cube', () => {
  it('should scramble and reverse', () => {
    const cube = new Cube();
    cube.scramble();
    const scrambledState = cube.getState();
    cube.reverse();
    const reversedState = cube.getState();
    expect(reversedState).toEqual(new Cube().getState());
  });
}); 