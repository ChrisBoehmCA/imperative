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

import * as T from "../../TestUtil";
import {IImperativeConfig, Imperative, ImperativeConfig} from "../../../../packages/imperative";

describe("Imperative should validate config provided by the consumer", function () {
    const packageJsonPath = __dirname + "/package.json";
    const currentFileName = process.mainModule.filename;

    beforeAll(() => {
        // Temporarly change the main module filename so that the test can work.
        process.mainModule.filename = __filename;
    });

    afterAll(() => {
        // We have to put shit back to normal right?
        process.mainModule.filename = currentFileName;
        T.rimraf(packageJsonPath);
    });

    it("We should be able to load our configuration from our package.json ", function () {
        const config: IImperativeConfig = {
            definitions: [
                {
                    name: "hello",
                    type: "command",
                    options: [],
                    description: "my command"
                }
            ],
            productDisplayName: "My product (packagejson)",
            defaultHome: "~/.myproduct",
            rootCommandDescription: "My Product CLI"
        };
        T.writeFileSync(packageJsonPath, JSON.stringify({imperative: config, name: "sample"}));
        return Imperative.init().then(() => {
            // "Display name should have matched our config"
            expect(ImperativeConfig.instance.loadedConfig.productDisplayName)
                .toEqual(config.productDisplayName);
        });
    });
});
