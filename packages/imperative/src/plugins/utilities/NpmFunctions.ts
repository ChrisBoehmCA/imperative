/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { PMFConstants } from "./PMFConstants";
import * as path from "path";
import { execSync } from "child_process";
const npmCmd = cmdToRun();

/**
 * Common function that requires npm and node.exe if not found just returns npm command as a string.
 *
 * @return {string} command with node.exe and npm paths or 'npm'
 *
 */
export function cmdToRun() {
    let command;
    try {
        const npmExecPath = path.join(require.resolve("npm"), "../..");
        const nodeExecPath = process.execPath;
        command = `"${nodeExecPath}" "${npmExecPath}"` ;
    } catch (err) {
        command = "npm";
    }
    return command;
}

/**
 * Common function that installs a npm package using the local npm cli.
 * @param {string} prefix Path where to install npm the npm package.
 *
 * @param {string} registry The npm registry to install from.
 *
 * @param {string} npmPackage The name of package to install.
 *
 * @return {string} command response
 *
 */
export function installPackages(prefix: string, registry: string, npmPackage: string): string {
    const pipe = ["pipe", "pipe", process.stderr];
    try {
        const execOutput = execSync(`${npmCmd} install "${npmPackage}" --prefix "${prefix}" ` +
            `-g --registry "${registry}"`, {
            cwd: PMFConstants.instance.PMF_ROOT,
            stdio: pipe
        });
        return execOutput.toString();
    } catch (err) {
        throw (err.message);
    }
}

/**
 * Get the registry to install to.
 *
 * @return {string}
 */
export function getRegistry(): string {
    try {
        const execOutput = execSync(`${npmCmd} config get registry`);
        return execOutput.toString();
    } catch (err) {
        throw(err.message);
    }
}

/**
 * NPM login to be able to install from secure registry
 * @param {string} registry The npm registry to install from.
 */
export function npmLogin(registry: string) {
    try {
        execSync(`${npmCmd} adduser --registry ${registry} ` +
            `--always-auth --auth-type=legacy`, {stdio: [0,1,2]});
    } catch (err) {
        throw(err.message);
    }
}
