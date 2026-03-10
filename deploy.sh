# #!/bin/bash

# # PRODUCTION
# git reset --hard
# git checkout master
# git pull origin master

# npm i yarn -g
# yarn global add serve
# yarn
# yarn run build
# pm2 start "yarn run start:prod" --name=EVOS-REACT


#!/bin/bash
set -e

cd /home/evos-project/Evos

git reset --hard
git checkout master
git pull origin master

npm i -g yarn
yarn global add serve

yarn install
yarn build

pm2 restart ecosystem.config.js --only EVOS-REACT || pm2 start ecosystem.config.js --only EVOS-REACT
pm2 save