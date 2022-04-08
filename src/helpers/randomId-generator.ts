/**
 * Represents all information and behavior with an random id generator.
 */
export class RandomIdGenerator {
  /**
   * Gets the random rithm id generated from parameters passed to it.
   *
   * @param size Abc.
   * @param prefix The prefix to the generated Id.
   * @param suffix The suffix to the generated Id.
   * @returns A random id based on the parameters passed.
   */
  getRandRithmId(size: number, prefix = '', suffix = ''): string {
    const genRanHex = (genSize: number) =>
      [...Array(genSize)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
    const rithmId = `${prefix.length > 0 ? prefix + '-' : prefix}${genRanHex(
      size
    )}-${genRanHex(size)}-${genRanHex(size)}${
      suffix.length > 0 ? '-' + suffix : suffix
    }`;
    return rithmId;
  }
}
