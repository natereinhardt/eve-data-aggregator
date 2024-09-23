# eve-data-aggregator

My Node CLI is a tool for doing awesome things directly from your terminal.

## Prerequisites

You need to have Node.js installed on your computer to run this project. Follow the instructions below to install Node.js:

### Installing Node.js

1. **Download Node.js**:
   Go to the [Node.js download page](https://nodejs.org/) and download the installer for your operating system.

2. **Run the Installer**:
   Run the downloaded installer and follow the prompts in the setup wizard. The installer will install both Node.js and npm (Node Package Manager).

3. **Verify Installation**:
   Open a terminal or command prompt and run the following commands to verify that Node.js and npm are installed correctly:

   ```bash
   node -v
   npm -v
   ```

   You should see the version numbers of Node.js and npm.

## Installation

After installing Node.js, you can install the CLI globally:

```bash
npm install -g eve-import-cli
```

## Configuration

Create a [`.env`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fg%3A%2Fdev%2Feve-data-aggregator%2F.env%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%223ae6d9ce-4472-4b17-b2c2-65e065dcc6d2%22%5D 'g:\\dev\\eve-data-aggregator.env')) file in the root of your project with the following content:

```env
CLIENT_ID=your-client-id
CALLBACK_URL=https://localhost/callback/
SCOPE=esi-wallet.read_corporation_wallets.v1
STATE=unique-state
CORPORATION_ID=your-corporation-id
```

### Global Installation

If you have installed the CLI globally, place the [`.env`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fg%3A%2Fdev%2Feve-data-aggregator%2F.env%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%228288c46c-d8df-4ec9-9a0a-e608e3c74057%22%5D 'g:\\dev\\eve-data-aggregator.env') file in the directory where you run the [`eve-import-cli`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fg%3A%2Fdev%2Feve-data-aggregator%2Fpackage.json%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A24%2C%22character%22%3A5%7D%7D%5D%2C%228288c46c-d8df-4ec9-9a0a-e608e3c74057%22%5D 'Go to definition') command. This ensures that the environment variables are correctly loaded.

## Usage

To start using My Node CLI, run:

```bash
eve-import-cli --help
```

### Commands

- `eve-import-cli repeat --interval <minutes>`: Repeats the OAuth flow at specified intervals.

For more detailed information on commands, run `eve-import-cli --help`.

## Contributing

Contributions are welcome ...

## License

This project is licensed ...
