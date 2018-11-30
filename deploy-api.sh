# When first deploying use `NODE_ENV=production pm2 start -i max build`

set -e

git fetch
git reset --hard origin/master
cd api
yarn

NODE_ENV=production

yarn build
pm2 reload 0
