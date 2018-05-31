import * as chalk from 'chalk';

import { readFileSync, writeFileSync } from 'fs';
import { sync as glob } from 'glob';
import { join } from 'path';

import { BuildPackage } from './build-package';
import { ngcCompile } from './ngc-compile';


let nextId = 0;

/**
 * Compiles the TypeScript sources of a primary or secondary entry point.
 */
export async function compileEntryPoint(buildPackage: BuildPackage, tsConfigName: string,
                                        secondaryEntryPoint = '', es5OutputPath?: string) {

    const entryPointPath = join(buildPackage.sourceDir, secondaryEntryPoint);
    const entryPointTSConfigPath = join(entryPointPath, tsConfigName);
    const ngcFlags = ['-p', entryPointTSConfigPath];

    if (es5OutputPath) {
        ngcFlags.push('--outDir', es5OutputPath, '--target', 'ES5');
    }

    return ngcCompile(ngcFlags).catch(() => {
        const error = chalk.default.red(`Failed to compile ${secondaryEntryPoint} using ${entryPointTSConfigPath}`);
        /* tslint:disable-next-line:no-console */
        console.error(error);

        return Promise.reject(error);
    });
}

/**
 * Renames `ɵa`-style re-exports generated by Angular to be unique across compilation units.
 */
export function renamePrivateReExportsToBeUnique(buildPackage: BuildPackage,
                                                 secondaryEntryPoint = '') {

    // When we compiled the typescript sources with ngc, we do entry-point individually.
    // If the root-level module re-exports multiple of these entry-points, the private-export
    // identifiers (e.g., `ɵa`) generated by ngc will collide. We work around this by suffixing
    // each of these identifiers with an ID specific to this entry point. We make this
    // replacement in the js, d.ts, and metadata output.
    if (buildPackage.exportsSecondaryEntryPointsAtRoot && secondaryEntryPoint) {
        const entryPointId = nextId++;
        const outputPath = join(buildPackage.outputDir, secondaryEntryPoint);
        const esm5OutputPath = join(buildPackage.esm5OutputDir, secondaryEntryPoint);

        addIdToGlob(outputPath, entryPointId);
        addIdToGlob(esm5OutputPath, entryPointId);
    }
}

/**
 * Updates exports in designated folder with identifier specified.
 */
function addIdToGlob(outputPath: string, entryPointId: number): void {
    glob(join(outputPath, '**/*.+(js|d.ts|metadata.json)')).forEach((filePath) => {
        let fileContent = readFileSync(filePath, 'utf-8');

        fileContent = fileContent.replace(/(ɵ[a-z]+)/g, `$1${entryPointId}`);

        writeFileSync(filePath, fileContent, 'utf-8');
    });
}
