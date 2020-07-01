const moduleName = process.argv[2] || 'dev';
process.argv.splice(2, 1);

void import(`./${moduleName}`);
