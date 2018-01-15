const moduleName = process.argv[2];

if(moduleName){
	const {join, resolve, dirname} = require('path');
	const {readFile, createWriteStream} = require('fs');

	const modulePath = join(__dirname, 'node_modules', moduleName);
	readFile(join(modulePath, 'package.json'), (err, data) => {
		if(err){
			console.error('Cannot find package!');
			return;
		}
		const metadata = JSON.parse(data);
		const mainPath = resolve(modulePath, metadata.main);
		
		const browserify = require('browserify');
		const mkdir = require('make-dir');
		const b = browserify(mainPath);
		b.transform({
			global: true,
			mangle: true,
			compress: {
				sequences: true,
				dead_code: true,
				booleans: true
			}
		}, 'uglifyify')
		const stream = b.bundle();

		const outputPath = resolve(__dirname, 'modules', moduleName + '-' + metadata.version);
		mkdir.sync(dirname(outputPath));
		stream.pipe(createWriteStream(outputPath));
	});
}