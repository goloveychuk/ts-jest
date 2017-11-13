import * as ts from 'typescript';
export interface OutputFile {
  text: string;
  sourceMap?: string;
  declaration?: ts.OutputFile;
}
export declare function isCaseInsensitive(): boolean;
export declare function findResultFor(
  fileName: string,
  output: ts.EmitOutput,
): OutputFile;
