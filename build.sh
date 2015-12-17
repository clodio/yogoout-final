#!/bin/sh
# repertoire courant
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# Injection revision SVN
sed -i -e s/"REVISION"/"$SVN_REVISION"/g config.js

# Téléchargement des dépendances
npm install

