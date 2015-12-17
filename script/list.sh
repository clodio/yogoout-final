#!/bin/sh
############################################################################
#                                                                          #
# Application   : b7_                                                      #
# Nom du script : list.sh							     	               #
# Description   : Script listant les process node.js    				   #
#                 Le user lançant ce script doit être sudoer ou user node  #
# Usage         : list.sh							                       #
############################################################################

echo "script lancé avec user : $(whoami)"

if [ $(whoami) = "node" ]
then
	pm2 list
else
    echo "trying sudo -u node ..."
    {
        sudo -u node echo "sudo OK"
    } || {
        echo "$(whoami) ne peut pas executer 'sudo -u node'"
        echo "Dernière tentative : 'su - node'"
        {
        	su - node -c "pm2 list"
        } || {
        	echo "Impossible de faire 'su - node'"
        	echo ""	
        	echo ">> Passer manuellement en user 'node', puis relancer le script"
        	exit 1
        }
        exit 0
    }
    sudo -u node pm2 list
fi
