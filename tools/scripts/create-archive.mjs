import archiver from 'archiver';
import { createWriteStream, existsSync, mkdirSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const currentScriptPath = import.meta.url;
const localProjectPath = resolve(dirname(fileURLToPath(currentScriptPath)), '../../');
const packageJsonPath = join(localProjectPath, 'package.json');

const clientDir = 'dist/apps/client';
const clientPanelDir = 'dist/apps/client-panel';
const serverDir = 'dist/apps/server';

if (!existsSync(clientDir) || !statSync(clientDir).isDirectory()) {
	console.error(`${clientDir} not found.`);
	process.exit(1);
}

if (!existsSync(clientPanelDir) || !statSync(clientPanelDir).isDirectory()) {
	console.error(`${clientPanelDir} not found.`);
	process.exit(1);
}

if (!existsSync(serverDir) || !statSync(serverDir).isDirectory()) {
	console.error(`${serverDir} not found.`);
	process.exit(1);
}

const archive_name = `project.zip`;
const folderName = 'archives';
if (!existsSync(folderName) || !statSync(folderName).isDirectory()) {
	mkdirSync(folderName);
}
const archive_path = join(localProjectPath, `${folderName}/${archive_name}`);

const createArchive = archiver('zip', { zlib: { level: 9 } });

createArchive.on('error', (err) => {
	console.error('Create archive error:', err);
	process.exit(1);
});

createArchive.pipe(createWriteStream(archive_path));

createArchive.glob('dist/**');
createArchive.glob('prisma/**', { ignore: ['prisma/seed.ts', 'prisma/jsonTypes.ts'] });
createArchive.glob('docker/**', { ignore: ['docker/logs/**'] });
createArchive.glob('env/.env.prod.example');
createArchive.file(packageJsonPath, { name: 'package.json' });
createArchive.file('tools/scripts/updater.mjs');
createArchive.file('README.md');
createArchive.glob('views/**');

createArchive.finalize();
