/*eslint-disable quotes*/

'use strict';

module.exports = {
    'service': [{
        'code': 'B7_',
        'modele': '001',
        'module': 'U1',
        'nom': 'Portail Entreprise BSCC', // libellé du service
        'cumulRoles': 'non',
        'accesLogique': [
            {
                'code': 'REC',
                'libelle': 'Recette MOE', // libellé de l'accès logique
                'affichageLibelle': 'oui',
                'acces': [
                    {
                        'affichageLibelle': 'oui',
                        'disponible': 'oui',
                        'visible': 'oui',
                        'libelle': 'Connexion SAML canal intranet', // libellé de l'accès physique
                        'url': 'https://cilpw317.net3-courrier.extra.laposte.fr:8443/' // url de l'accés physique
                    }
                ],
                'groupe': [
                    {
                        'nom': 'Utilisateur',
                        'role': 'UTIL',
                        'accesLogique': 'REC', // habilité avec le rôle Utilisateur sur l'accès logique Recette MOE
                        'code': 'UTIL REC'
                    },
                    {
                        'nom': 'Administrateur',
                        'role': 'ADM',
                        'accesLogique': 'REC', // habilité avec le rôle Administrateur sur l'accès logique Recette MOE
                        'code': 'ADM REC'
                    }
                ]
            },
            {
                'code': 'ACC',
                'libelle': 'Accostage',
                'affichageLibelle': 'oui',
                'acces': [
                    {
                        'affichageLibelle': 'oui',
                        'disponible': 'oui',
                        'visible': 'oui',
                        'libelle': 'Connexion SAML canal intranet',
                        'url': 'https://www.acc-bandeauportail.net2-courrier.extra.laposte.fr'
                    }
                ],
                'groupe': [
                    {
                        'nom': 'Contributeur',
                        'role': 'CONTR',
                        'accesLogique': 'ACC',
                        'code': 'CONTR ACC'
                    },
                    {
                        'nom': 'Administrateur',
                        'role': 'ADM',
                        'accesLogique': 'ACC',
                        'code': 'ADM ACC'
                    }
                ]
            }
        ]
    }]
};