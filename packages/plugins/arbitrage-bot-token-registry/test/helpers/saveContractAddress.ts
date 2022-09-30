import { outputFile } from 'fs-extra';
const writeAddressToFile = (name, address) => {
  return outputFile(
    `${process.cwd()}/integration-tests/deployments/${name}.js`,
    `module.exports = "${address}";`
  );
};

export default writeAddressToFile;
