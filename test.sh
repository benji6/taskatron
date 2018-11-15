set -e

cd client && yarn test && echo client tests pass &
cd api && yarn test && echo api tests pass
wait
