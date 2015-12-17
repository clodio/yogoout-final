#!/bin/sh
############################################################################
#                                                                          #
# Application   : b7_                                                      #
# Nom du script : kill.sh							     	               #
# Description   : Script d'arrêt du serveur node.js ET de pm2			   #
#                 Le user lançant ce script doit être sudoer ou user node  #
# Usage         : kill.sh					    		                   #
############################################################################

echo "script lancé avec user : $(whoami)"

if [ $(whoami) = "node" ]
then
	pm2 kill
else
    echo "trying sudo -u node ..."
    {
        sudo -u node echo "sudo OK"
    } || {
        echo "$(whoami) ne peut pas executer 'sudo -u node'"
        echo "Dernière tentative : 'su - node'"
        {
        	su - node -c "pm2 kill"
        } || {
        	echo "Impossible de faire 'su - node'"
        	echo ""	
        	echo ">> Passer manuellement en user 'node', puis relancer le script"
        	exit 1
        }
        exit 0
    }
    sudo -u node pm2 kill
fi