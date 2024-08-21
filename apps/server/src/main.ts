import { Logger } from '@nestjs/common';

import { bootstrap } from './bootstrap';

const logger = new Logger('Application:main');

try {
	bootstrap().catch((err) => {
		logger.error(err, err?.stack);
	});
} catch (err) {
	logger.error(err, err?.stack);
}
