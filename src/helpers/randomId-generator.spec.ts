import { RandomIdGenerator } from './randomId-generator';

describe('RandomIdGeneratorService', () => {
  let helper: RandomIdGenerator;

  beforeEach(() => {
    helper = new RandomIdGenerator();
  });

  it('should be created', () => {
    expect(helper).toBeTruthy();
  });

  it('should return a 14 digit random id', () => {
    const result = helper.getRandRithmId(4);
    expect(result.length).toEqual(14);
  });

  it('should return a 18 digit random id', () => {
    const result = helper.getRandRithmId(4, 'ans');
    expect(result.length).toEqual(18);
  });
});
