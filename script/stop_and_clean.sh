#!/bin/sh
############################################################################
#                                                                          #
# Application   : b7_                                                      #
# Nom du script : stop_and_clean.sh					     	               #
# Description   : Script d'arrêt du serveur node.js						   #
#                 Le user lançant ce script doit être sudoer ou user node  #
#                 Arret et suppression de la configuration de pm2		   #
# Usage         : stop_and_clean.sh					                       #
############################################################################

echo "script lancé avec user : $(whoami)"

if [ $(whoami) = "node" ]
then
	pm2 stop /b7_/b7_adm/u1/pm2.json
	pm2 delete /b7_/b7_adm/u1/pm2.json
else
    echo "trying sudo -u node ..."
    {
        sudo -u node echo "sudo OK"
    } || {
        echo "$(whoami) ne peut pas executer 'sudo -u node'"
        echo "Dernière tentative : 'su - node'"
        {
        	su - node -c "pm2 stop /b7_/b7_adm/u1/pm2.json; pm2 delete /b7_/b7_adm/u1/pm2.json;"
        } || {
        	echo "Impossible de faire 'su - node'"
        	echo ""	
        	echo ">> Passer manuellement en user 'node', puis relancer le script"
        	exit 1
        }
        exit 0
    }
    sudo -u node pm2 stop /b7_/b7_adm/u1/pm2.json
    sudo -u node pm2 delete /b7_/b7_adm/u1/pm2.json
fi