// tslint:disable-next-line: no-var-requires
const jsonfile = require('jsonfile');

export const readJson = async (path: string) => {

    return await jsonfile.readFile(path);

};
