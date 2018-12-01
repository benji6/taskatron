set -e

cd api && yarn test && echo api tests pass &
cd client && yarn test && echo client tests pass &
cd shared && yarn test && echo shared tests pass
wait
