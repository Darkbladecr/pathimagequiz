#!/bin/sh
DEST=/var/www/path.quesmed.com
yarn build
sudo rm -r $DEST
sudo mkdir -p $DEST
sudo mv build/* $DEST
sudo chown -R www-data:www-data $DEST
