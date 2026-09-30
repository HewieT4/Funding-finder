/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { runMatchingEngineTests } from './matchingEngine.test';

console.log('====================================================');
console.log('  BURSARY FINDER SA - AUTOMATED VERIFICATION SUITE  ');
console.log('====================================================\n');

const results = runMatchingEngineTests();
let allPassed = true;

results.forEach((test, idx) => {
  const icon = test.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] ${test.name}`);
  console.log(`       Details: ${test.details}`);
  if (!test.passed) allPassed = false;
});

console.log('\n----------------------------------------------------');
const passedCount = results.filter((r) => r.passed).length;
console.log(`Summary: ${passedCount}/${results.length} tests passed.`);
console.log('====================================================\n');

if (!allPassed) {
  process.exit(1);
} else {
  process.exit(0);
}
