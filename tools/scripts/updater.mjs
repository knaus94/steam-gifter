import AdmZip from 'adm-zip';
import { exec } from 'child_process';
import fs from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { createClient } from 'webdav';
import https from 'https';

const extractAllToAsync = promisify((zip, targetPath, overwrite, keepOriginalPermission, callback) => {
	try {
		zip.extractAllTo(targetPath, overwrite, keepOriginalPermission);
		callback(null);
	} catch (error) {
		callback(error);
	}
});

// Configuration
const currentScriptPath = import.meta.url;
const localProjectPath = resolve(dirname(fileURLToPath(currentScriptPath)), '../../');
const envDirPath = join(localProjectPath, 'env');
const envFilePath = join(envDirPath, '.env.prod');

const webdavInstance = createClient('https://st-e.server-panel.net/webdav/user4685366/updater', {
	username: 'user4685366',
	password: 'EUod3BgtoUAG',
	authType: 'digest',
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
});

async function getRemoteVersion() {
	try {
		return await webdavInstance.getFileContents('version.txt').then((data) => data.toString());
	} catch (error) {
		console.error('Error fetching version and update URL from the remote server:', error.message);
		throw error;
	}
}

async function getCurrentLocalVersion() {
	try {
		const packageJsonPath = join(localProjectPath, 'package.json');
		const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
		const packageJson = JSON.parse(packageJsonContent);
		return packageJson.version;
	} catch (error) {
		console.error('Error getting the current project version:', error.message);
		throw error;
	}
}

async function deleteOldFiles(localProjectPath, excludedFiles = []) {
	const files = await fs.readdir(localProjectPath);

	for (const file of files) {
		if (!excludedFiles.includes(file)) {
			await fs.rm(join(localProjectPath, file), { recursive: true });
		}
	}
}

async function downloadAndApplyUpdate(remoteVersion) {
	try {
		// Create a backup of the current .env.prod file if it exists
		if (await fs.access(envFilePath, fs.constants.F_OK)) {
			const backupEnvFilePath = join(envDirPath, '.env.prod.backup');
			await fs.copyFile(envFilePath, backupEnvFilePath);
		}

		// Download and apply the update
		const data = await webdavInstance.getFileContents(`${remoteVersion}.zip`);
		const zip = new AdmZip(data);

		// Delete old files
		await deleteOldFiles(localProjectPath, ['node_modules', 'env']);

		// Extract the archive to the project directory using the promisified extractAllToAsync
		await extractAllToAsync(zip, localProjectPath, true, false);

		// Restore the old .env.prod file if it exists
		if (await fs.access(envFilePath, fs.constants.F_OK)) {
			await fs.copyFile(join(envDirPath, '.env.prod.backup'), envFilePath);
			console.log('.env.prod file restored.');
			await fs.unlink(join(envDirPath, '.env.prod.backup')); // Delete the backup
		}

		// Run `npm i` to install dependencies
		await runNpmInstall(localProjectPath);

		// Run `npm run prisma:generate`
		await runPrismaGenerate(localProjectPath);

		// Run `npm run prisma:generate`
		await runNpmDatabaseMigrate(localProjectPath);
	} catch (error) {
		console.error('Error downloading and applying the update:', error.message);
		throw error;
	}
}

async function runNpmInstall(projectPath) {
	return new Promise((resolve, reject) => {
		exec('npm i', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				console.error('Error running npm install:', error.message);
				resolve();
			} else {
				console.log('Dependencies installed successfully.');
				resolve();
			}
		});
	});
}

async function runNpmDatabaseMigrate(projectPath) {
	return new Promise((resolve, reject) => {
		exec('npm run database:migrate:prod', { cwd: projectPath, '-y': true }, (error, stdout, stderr) => {
			if (error) {
				console.error('Error running npm run database:migrate:prod:', error.message);
				resolve();
			} else {
				console.log('Migrated successfully.');
				resolve();
			}
		});
	});
}

async function runPrismaGenerate(projectPath) {
	return new Promise((resolve, reject) => {
		exec('npm run prisma:generate', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				console.error('Error running npm run prisma:generate:', error.message);
				resolve();
			} else {
				console.log('Prisma schema generated successfully.');
				resolve();
			}
		});
	});
}

async function replaceValuesInMainFiles() {
	try {
		const clientMainPath = join(localProjectPath, 'dist', 'apps', 'client');
		const clientPanelMainPath = join(localProjectPath, 'dist', 'apps', 'client-panel');

		const envFileContent = await fs.readFile(envFilePath, 'utf-8');
		const envLines = envFileContent.split('\n');
		let projectProtocol, projectDomain, googleRecaptchaPublicKey, jwtCookieName, defaultEmail;

		for (const line of envLines) {
			if (line.startsWith('NX_PROJECT_PROTOCOL=')) {
				projectProtocol = line.replace('NX_PROJECT_PROTOCOL=', '').trim();
			} else if (line.startsWith('NX_PROJECT_DOMAIN=')) {
				projectDomain = line.replace('NX_PROJECT_DOMAIN=', '').trim();
			} else if (line.startsWith('NX_GOOGLE_RECAPTCHA_PUBLIC_KEY=')) {
				googleRecaptchaPublicKey = line.replace('NX_GOOGLE_RECAPTCHA_PUBLIC_KEY=', '').trim();
			} else if (line.startsWith('NX_JWT_COOKIE_NAME=')) {
				jwtCookieName = line.replace('NX_JWT_COOKIE_NAME=', '').trim();
			} else if (line.startsWith('DEFAULT_EMAIL=')) {
				defaultEmail = line.replace('DEFAULT_EMAIL=', '').trim();
			}
		}

		const seedJsPath = join(localProjectPath, 'prisma', 'seed.js');
		let seedJsContent = await fs.readFile(seedJsPath, 'utf-8');
		seedJsContent = seedJsContent.replace(/admin@admin\.com/g, defaultEmail);

		await fs.writeFile(seedJsPath, seedJsContent, 'utf-8');

		// Найти все файлы main.js в папке client
		const clientMainFiles = await fs.readdir(clientMainPath);

		for (const filename of clientMainFiles) {
			if (filename.startsWith('main.') && filename.endsWith('.js')) {
				const clientMainFilePath = join(clientMainPath, filename);
				let clientMainFileContent = await fs.readFile(clientMainFilePath, 'utf-8');
				clientMainFileContent = clientMainFileContent
					.replace(/\[PROJECT_PROTOCOL\]/g, projectProtocol)
					.replace(/\[PROJECT_DOMAIN\]/g, projectDomain)
					.replace(/\[GOOGLE_RECAPTCHA_PUBLIC_KEY\]/g, googleRecaptchaPublicKey)
					.replace(/\[JWT_COOKIE_NAME\]/g, jwtCookieName);

				if (projectProtocol === 'https') {
					clientMainFileContent = clientMainFileContent.replace(/ws:\/\//g, 'wss://');
				}

				if (projectProtocol === 'http') {
					clientMainFileContent = clientMainFileContent.replace(/wss:\/\//g, 'ws://');
				}

				await fs.writeFile(clientMainFilePath, clientMainFileContent, 'utf-8');
			}
		}

		// Найти все файлы main.js в папке client-panel
		const clientPanelMainFiles = await fs.readdir(clientPanelMainPath);

		for (const filename of clientPanelMainFiles) {
			if (filename.startsWith('main.') && filename.endsWith('.js')) {
				const clientPanelMainFilePath = join(clientPanelMainPath, filename);
				let clientPanelMainFileContent = await fs.readFile(clientPanelMainFilePath, 'utf-8');
				clientPanelMainFileContent = clientPanelMainFileContent
					.replace(/\[PROJECT_PROTOCOL\]/g, projectProtocol)
					.replace(/\[PROJECT_DOMAIN\]/g, projectDomain)
					.replace(/\[GOOGLE_RECAPTCHA_PUBLIC_KEY\]/g, googleRecaptchaPublicKey)
					.replace(/\[JWT_COOKIE_NAME\]/g, jwtCookieName);

				if (projectProtocol === 'https') {
					clientPanelMainFileContent = clientPanelMainFileContent.replace(/ws:\/\//g, 'wss://');
				}

				if (projectProtocol === 'http') {
					clientPanelMainFileContent = clientPanelMainFileContent.replace(/wss:\/\//g, 'ws://');
				}

				await fs.writeFile(clientPanelMainFilePath, clientPanelMainFileContent, 'utf-8');
			}
		}

		const nginxConfPath = join(localProjectPath, 'docker', 'nginx', 'nginx.conf');
		let nginxConfContent = await fs.readFile(nginxConfPath, 'utf-8');
		nginxConfContent = nginxConfContent.replace(/domain\.com/g, projectDomain.trim());
		await fs.writeFile(nginxConfPath, nginxConfContent, 'utf-8');

		console.log('Env Values replaced in main.js files.');
	} catch (error) {
		throw error;
	}
}

(async () => {
	try {
		const remoteVersion = await getRemoteVersion();
		const localVersion = await getCurrentLocalVersion();

		if (remoteVersion !== localVersion) {
			console.log('New version detected:', remoteVersion);
			await downloadAndApplyUpdate(remoteVersion);
		} else {
			console.log('You already have the latest version installed.');
			await runPrismaGenerate(localProjectPath);
		}

		await replaceValuesInMainFiles();
	} catch (error) {
		console.error('An error occurred:', error.message);
	}
})();
