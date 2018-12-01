# When first deploying use `NODE_ENV=production pm2 start -i max build`

set -e

git fetch
git reset --hard origin/master
yarn

cd shared
yarn build

cd ../api
yarn build

NODE_ENV=production
pm2 reload 0
