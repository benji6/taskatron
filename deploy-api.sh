set -e

git pull
cd api
yarn
yarn build
pm2 reload 0
