NETWORK="$1"
if [ -z "$NETWORK" ]; then
    NETWORK="mainnet"
fi
HOST="142.93.106.212" PORT="4200" yarn build:"$NETWORK"
EXPLORER_HOST="142.93.106.212" EXPLORER_PORT="4200" pm2 start express-server.js --name explorer
