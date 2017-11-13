import * as ts from 'typescript';
import * as utils from './utils';
export declare class Compiler {
  private options?;
  private service;
  private files;
  private customTransformersPath?;
  private customTransformers?;
  constructor(options?: ts.CompilerOptions);
  setOptions(options: ts.CompilerOptions): void;
  setCustomTransformersPath(path?: string): void;
  private createServiceHost();
  emitFile({ path, src }: { path: string; src: string }): utils.OutputFile;
  private formatErrors(fileName);
}
