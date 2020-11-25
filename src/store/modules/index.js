const camelize = str => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

const requireModule = require.context(".", false, /\.js$/);
const modules = {};

requireModule.keys().forEach(filename => {
  if (filename === "./index.js") return;
  const moduleName = camelize(filename.replace(/(\.\/|\.js)/g, ""));
  modules[moduleName] = requireModule(filename).default;
});

export default modules;
