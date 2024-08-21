import { exec } from 'child_process';
import { existsSync, promises as fsPromises } from 'fs';
import Client from 'ftp';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

// Replace the values with your FTP credentials
const ftpConfig = {
	host: 'st-e.server-panel.net',
	user: 'user4685366',
	password: 'EUod3BgtoUAG',
};

const currentScriptPath = import.meta.url;
const localProjectPath = resolve(dirname(fileURLToPath(currentScriptPath)), '../../');
const packageJsonPath = join(localProjectPath, 'package.json');

async function checkLocalFileAndArchive() {
	const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, 'utf8'));
	const version = packageJson.version.replace(/\s/g, '');

	const localFilePath = `./archives/project.zip`; // Local file path
	const remoteFilePath = `./${version}.zip`; // Path on the FTP server

	const versionTxtContent = version;

	// Check if the local file exists
	if (!existsSync(localFilePath)) {
		console.log(`Local file '${localFilePath}' does not exist. Running 'npm run archive'...`);

		// Run 'npm run archive' command
		exec('npm run archive', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error running 'npm run archive': ${error.message}`);
				return;
			}
			// Continue with FTP connection and file transfer
			connectToFtp(localFilePath, remoteFilePath, versionTxtContent);
		});
	} else {
		// Continue with FTP connection and file transfer
		connectToFtp(localFilePath, remoteFilePath, versionTxtContent);
	}
}

function connectToFtp(localFilePath, remoteFilePath, versionTxtContent) {
	const client = new Client();

	client.on('ready', () => {
		console.log('Connected to FTP');

		// Sending version.txt to FTP
		const remoteVersionTxtPath = `./version.txt`;
		client.put(Buffer.from(versionTxtContent, 'utf8'), remoteVersionTxtPath, (versionErr) => {
			if (versionErr) {
				console.error('Error sending version.txt:', versionErr);
			} else {
				console.log('version.txt file successfully sent to the FTP server');
			}

			// Sending the file to FTP
			client.put(localFilePath, remoteFilePath, (err) => {
				if (err) {
					console.error('Error sending the file:', err);
				} else {
					console.log('File successfully sent to the FTP server');
				}

				// Closing the FTP connection
				client.end();
			});
		});
	});

	client.connect(ftpConfig);
}

checkLocalFileAndArchive();
