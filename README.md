## Project: steam-gift

### Dependencies:

-   Ubuntu 20+ (no control panels)
-   Docker Engine
-   Docker Composer
-   Node 18.18.0

## Installation Instructions:

### Installing Docker Engine:

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Installing Docker Compose:

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Installing Node via NVM:

```bash
sudo apt install curl
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
nvm install 18.18.0
```

### Project setup:

1. Upload the project ZIP file to your server and unzip it:

```bash
unzip filename.zip
```

2. Inside the project folder, run the following commands:

```bash
npm install
```

3. Configure the environment:

```bash
cp env/.env.prod.example env/.env.prod
nano env/.env.prod
```

4. Check for updates before the first run (ignore migration errors):

```bash
npm run update
```

5. First run:

```bash
npm run docker:clean-up:prod
```

## Commands:

### Check for updates:

```bash
npm run update
```

### Stop the project:

```bash
npm run docker:down:prod
```

### Start the project:

```bash
npm run docker:up:prod
```

### Restart the project:

```bash
npm run docker:restart:prod
```

### Reset all data and restart:

```bash
npm run docker:clean-restart:prod
```

### Apply database migrations:

```bash
npm run database:migrate:prod
```

## Panel:

```
https://domain.com/panel/
```

Default panel password:

```
admin
```

## Digiseller:

To link Digiseller to the software, go to the control panel:

```
https://domain.com/panel/settings
```

### Callback:

When installing the bulb, you are required to press the "Check" button, and only then save.

```
https://domain.com/api/digiseller/callback
```
