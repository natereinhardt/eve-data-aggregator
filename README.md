# eve-data-aggregator

My Node CLI is a tool for doing awesome things directly from your terminal.

## Installation

```bash
npm install -g eve-import-cli
```

## Configuration

Create a [`.env`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fg%3A%2Fdev%2Feve-data-aggregator%2F.env%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%223ae6d9ce-4472-4b17-b2c2-65e065dcc6d2%22%5D "g:\dev\eve-data-aggregator\.env") file in the root of your project with the following content:

```env
CLIENT_ID=your-client-id
CALLBACK_URL=https://localhost/callback/
SCOPE=esi-wallet.read_corporation_wallets.v1
STATE=unique-state
CORPORATION_ID=your-corporation-id
```

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