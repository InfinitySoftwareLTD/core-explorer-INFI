NETWORK="$1"
if [ -z "$NETWORK" ]; then
    NETWORK="testnet"
fi
HOST="159.65.199.136" PORT="4200" yarn build:"$NETWORK"
EXPLORER_HOST="159.65.199.136" EXPLORER_PORT="4200" pm2 start /home/lionel/core-explorer/express-server.js --name explorer
