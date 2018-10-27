#!/bin/sh
DEST=/var/www/path.quesmed.com
yarn build
sudo mv build/* $DEST
sudo chown -R www-data:www-data $DEST
