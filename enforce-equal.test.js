// enforce-equal.test.js
const { RuleTester } = require("eslint");
const enforceEqualRule = require("./enforce-equal");

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  parserOptions: { ecmaVersion: 2015 }
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  "enforce-equal", // rule name
  enforceEqualRule, // rule code
  { // checks
    // 'valid' checks cases that should pass
    valid: [{
      code: '{ where: { id: Equal(someVariable) } }'
    }],
    // 'invalid' checks cases that should not pass
    invalid: [{
      code: 'findOne({ where: { id: someVariable } })',
      output: 'findOne({ where: { id: Equal(someVariable) } })',
      errors: [{ messageId: 'useTypeORMComparisonHelper' }],
    },
    {
      code: 'const a =  { where: { id: someVariable } }',
      output: 'const a =  { where: { id: Equal(someVariable) } }',
      errors: [{ messageId: 'useTypeORMComparisonHelper' }],
    },
    {
      code: 'const a =  { where: { someVariable } }',
      output: 'const a =  { where: { someVariable: Equal(someVariable) } }',
      errors: [{ messageId: 'useTypeORMComparisonHelper' }],
    }],
  }
);

ruleTester.run(
  "enforce-equal", // rule name
  enforceEqualRule, // rule code
  { // checks
    // 'valid' checks cases that should pass
    valid: [{
      code: 'findOneBy({ id: Equal(someVariable) })',
    },
    {
      code: "findOneBy({ someVariable: '123' })",
    },
    {
      code: 'findOneByOrFail({ id: Equal(someVariable) })',
    },
    {
      code: "findOneByOrFail({ someVariable: '123' })",
    }],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: 'findOneBy({ someVariable: test })',
        output: 'findOneBy({ someVariable: Equal(test) })',
        errors: [{ messageId: 'useTypeORMComparisonHelper' }],
      },
      {
        code: 'findOneBy({ someVariable: test() })',
        output: 'findOneBy({ someVariable: Equal(test) })',
        errors: [{ messageId: 'useTypeORMComparisonHelper' }],
      },
      {
        code: 'findOneByOrFail({ someVariable: test })',
        output: 'findOneByOrFail({ someVariable: Equal(test()) })',
        errors: [{ messageId: 'useTypeORMComparisonHelper' }],
      },
      {
        code: 'findOneByOrFail({ someVariable: test() })',
        output: 'findOneByOrFail({ someVariable: Equal(test()) })',
        errors: [{ messageId: 'useTypeORMComparisonHelper' }],
      }
    ],
  }
);

console.log("All tests passed!");
