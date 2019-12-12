import * as shell from 'shelljs';

shell.cp('-R', 'src/public/images', 'dist/public/');
shell.cp('-R', 'src/public/css', 'dist/public/');
shell.cp('-R', 'src/public/woff2', 'dist/public/');
