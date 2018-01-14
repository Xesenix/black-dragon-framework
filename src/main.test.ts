// testing react
// import Enzyme from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// Enzyme.configure({ adapter: new Adapter() });

declare const __karma__: any;

// Prevent Karma from running prematurely.
__karma__.loaded = () => ({});

// Prepare root for attaching DOM components
//const placeholder = document.createElement('div');
//placeholder.setAttribute('id', 'placeholder');
//document.body.appendChild(placeholder);

// Then we find all the tests.
const context = (require as any).context('.', true, /.*\.spec\.ts$/);

// And load the modules.
context.keys().map(context);

// Finally, start Karma to run the tests.
window.onload = () => {
	__karma__.start();
};
