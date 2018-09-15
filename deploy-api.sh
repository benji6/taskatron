set -e

git fetch
git reset --hard origin/master
cd api
yarn
yarn build
pm2 reload 0
