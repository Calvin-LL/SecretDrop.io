# SecretDrop.io

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![CI](https://github.com/CoolCyberBrain/SecretDrop.io/workflows/CI/badge.svg?branch=master)](https://github.com/CoolCyberBrain/SecretDrop.io/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/26fe0534-9afd-4232-8901-a91696e5489d/deploy-status)](https://app.netlify.com/sites/secretdrop/deploys)

Public key encryption for everyone at https://SecretDrop.io

## Testing

- For macOS, run `defaults write org.chromium.Chromium NSAppSleepDisabled -bool YES` before running `npm test`, otherwise e2e tests will take an hour. (https://bugs.chromium.org/p/chromium/issues/detail?id=741689)

## License

[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)
