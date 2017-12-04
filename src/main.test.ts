import 'reflect-metadata';

declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function() {};

// Prepare root for attaching DOM components
const placeholder = document.createElement('div');
placeholder.setAttribute('id', 'placeholder');
document.body.appendChild(placeholder);

// Then we find all the tests.
const context = require.context('./', true, /.*\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
