// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import fs = require('fs');
import xml2js = require('xml2js');

const verifyCoverage = () => {
    const contents = fs.readFileSync('./coverage/cobertura-coverage.xml');
    xml2js.parseString(contents, (err, result) => {
        const minimumCoverageRate: number = 0.96;
        const lineRate = result.coverage.$['line-rate'];
        const branchRate = result.coverage.$['branch-rate'];

        if (Number.parseFloat(lineRate) < minimumCoverageRate) {
            throw new Error('Line Rate code coverage minimum not met');
        }

        if (Number.parseFloat(branchRate) < minimumCoverageRate) {
            throw new Error('Branch Rate code coverage minimum not met');
        }

        // tslint:disable-next-line:no-console
        console.log('Minimum code coverage met');
    });
};

verifyCoverage();
