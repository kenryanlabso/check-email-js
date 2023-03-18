#  check-email-js
A simple and customizable module that validates email addresses with an optional domain restriction.

## Installation
**Using npm**: `$ npm install email-validator-js`

**Using yarn**: `$ yarn add email-validator-js`

## Usage
### Importing
```js
import { checkEmail } from 'check-email-js';
```

### Function Signature
```ts
function checkEmail(email: string, options?: CheckEmailOptions): ValidationResult;
```

### Options
The function accepts an optional object with the following options:
| Property | Type               | Default | Description                                                                                                                         |
| -------- | ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| domains  | string or string[] | null    | Domain restrictions for email validation.                                                                                           |
| max      | number             | 3       | An optional number representing the maximum length of the top-level domain (TLD). If not provided, the default maximum length is 3. |

### Return
The function returns an object with the following properties:
| Property | Type           | Description                                                                                                      |
| -------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| valid    | boolean        | Indicates if email is valid or not.                                                                              |
| error    | string or null | Error message for invalid email or domain. Returns null if email is valid or if error message is not applicable. |

### Example Usage
```js
// Standard validation
const result = checkEmail('test@example.com');
console.log(result.valid); // Output: true

// With domain restriction
const result = checkEmail('test@example.com', { domains: 'example.com' });
console.log(result.valid); // Output: true

// With multiple domain restrictions
const result = checkEmail('test@example.com', { domains: ['sample.com', 'example.com', 'test.com'] });
console.log(result.valid); // Output: true

// With custom domain extension max length
const result = checkEmail('test@example.info', { max: 4 });
console.log(result.valid); // Output: true
```

## License
This package is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
