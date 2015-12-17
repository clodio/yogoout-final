'use strict';

var convict = require('convict');
var os = require('os');
var formats = require('./app/utils/formats.js');

var environments = ['prod', 'test', 'moe', 'accostage', 'sles11-sp3', 'laposte-portail-dev', 'laposte-portail-udd', 'CILPW317',
    'CQYV0906', 'CQYV0907', 'CQYV0908', 'CQYV0909', 'CQYV0910', 'CQYV0911', 'CQYV0912', 'CPYV0687', 'CPYV0688', 'CPYV0689', 'CPYV0690','781630ZM0006'];

// TODO set default values to null
// TODO delete nested levels (hapi)
// TODO changer toutes les docs en francais

var config = convict({
    revision: {
        doc: 'Revision SVN du build',
        format: String,
        default: 'REVISION'
    },
    environnement: {
        doc: 'Environnement execution application',
        format: environments,
        default: os.hostname(),
        env: 'NODE_ENV',
        arg: 'env'
    },
    log_console: {
        doc: 'Duplique les logs dans la console',
        format: Boolean,
        default: false
    },
    desactiver_https: {
        doc: 'Indique si le protocole HTTPS doit etre desactive',
        format: Boolean,
        default: false
    },
    is_test_env: {
        doc: 'Indique si c est un environnement de test',
        format: Boolean,
        default: false
    },
    ip_vip: {
        doc: 'ip principale d\'ecoute, accedee par le loadbalancer en acc-pprod-prod',
        format: 'ipaddress',
        default: null
    },
    ip_exp: {
        doc: 'ip secondaire d\'ecoute, optionnelle, pour l\'exploit en acc-pprod-prod, \'none\' indique pas d\'ecoute secondaire',
        format: String,
        default: 'none'
    },
    port_ecoute: {
        doc: 'Port to bind',
        format: 'port',
        default: null
    },
    port_ecoute_bis: {
        doc: 'port utilisé pour servir l\'application sur un autre port pendant les tests, l\'ip reste celle de vip',
        format: 'port',
        default: 0
    },
    protocole: {
        doc: 'Protocol to use (HTTP/HTTPS)',
        format: ['http', 'https'],
        default: null
    },
    nom_de_domaine: {
        doc: 'nom de domaine de l\'application (eg. laposte-portail-entreprise.octo.com)',
        format: String,
        default: null
    },
    port_dans_url: {
        doc: 'Indique si le port d ecoute est à inclure dans l url publique',
        format: Boolean,
        default: null
    },
    static_cache_max_age: {
        doc: 'Cache-Control HTTP header in milliseconds',
        format: Number,
        default: 24 * 60 * 60 * 1000 // milliseconds
    },
    auto_connect_timeout: {
        doc: 'Temps d\'inactivité au bout duquel une tentative de connexion auto I2A est déclenchée, en milisecondes',
        format: Number,
        default: null
    },
    database: {
        name: {
            doc: 'Nom du schéma de base de données',
            format: String,
            default: null
        },
        hostname: {
            doc: 'hostname ou ip de la base de donnée',
            format: String,
            default: null
        },
        login: {
            doc: 'login de l\'utilisateur de la base de données',
            format: String,
            default: null
        },
        password: {
            doc: 'mot de passe de l\'utilisateur de la base de données',
            format: String,
            default: null
        }
    },
    features: {
        activer_popup_connexion: {
            doc: 'Activer l\'ouverture de la popup de connexion',
            format: Boolean,
            default: null
        },
        activer_connexion_i2a: {
            doc: 'Activer la connexion à i2a',
            format: Boolean,
            default: null
        },
        connexion_sans_i2a_reussie: {
            doc: 'Dans le mode connexion sans i2a, l\'utilisateur reussit toujours a se connecter',
            format: Boolean,
            default: null
        },
        auto_connect: {
            doc: 'Indique si on ping I2A pour une connexion active',
            format: Boolean,
            default: null
        },
        mock_webservice: {
            doc: 'Mocker les web services innacessibles hors environnement La Poste',
            format: Boolean,
            default: null
        }
    },
    activer_feature_flipping: {
        // TODO trouver une phrase plus explicite
        doc: 'Activer le mode feature flipping',
        format: Boolean,
        default: null
    },
    https: {
        cle_privee: {
            doc: 'HTTPS Private key relative path from app root folder',
            format: String,
            default: null
        },
        certificat: {
            doc: 'HTTPS Certificate relative path from app root folder',
            format: String,
            default: null
        },
        truststore: {
            doc: 'liste des certificats server externes à intégrer pour autoriser les appels HTTPS sortants',
            format: Array,
           default: null
        },
        autorite_certification_i2a: {
            doc: 'autorite_certification_i2a',
            format: String,
            default: null
        }
    },

    logs: {
        main_path: {
            doc: 'Absolute log file path',
            format: String,
            default: null
        },
        accesslog_path: {
            doc: 'Absolute log file path',
            format: String,
            default: null
        },
        main_level: {
            doc: 'log level',
            format: ['debug', 'info', 'warn', 'error'],
            default: null
        },
        accesslog_level: {
            doc: 'log level',
            format: ['debug', 'info', 'warn', 'error'],
            default: null
        }
    },
    hapi_auth_cookie: {
        // TODO nom
        name: {
            doc: 'Cookie name',
            format: String,
            default: 'session'
        },
        // TODO à enlever
        password: {
            doc: 'Cookie secret password',
            format: String,
            default: 'worldofwalmart'
        },
        // TODO à voir
        isSecure: {
            doc: 'Required for non-https applications',
            format: Boolean,
            default: true
        },
        clearInvalid: {
            doc: 'si cookie non valide, il est considéré comme expired',
            format: Boolean,
            default: true
        },
        // TODO time_out_session
        ttl: {
            doc: 'Time to live - in milliseconds',
            format: Number,
            default: 24 * 60 * 60 * 1000
        }
    },

    // TODO saml
    passport: {
        // TODO service_provider
        sp: {
            // TODO certificat
            cert: {
                doc: 'Service provider certificate location',
                format: String,
                default: null
            },
            // TODO cle_privee
            pkey: {
                doc: 'Service provider private key location',
                format: String,
                default: null
            }
        },
        // TODO identity_provider
        idp: {
            // TODO certificat
            cert: {
                doc: 'Identity provider certificate location',
                format: String,
                default: null
            }
        },
        // TODO callback_url
        callback_url: {
            doc: 'Url de call pour validation de l assertion',
            format: String,
            default: null
        },
        // TODO url_redirection_i2a
        entryPoint: {
            doc: 'Entry point of the Identity provider where the Service Provider will send the SAML Request',
            format: String,
            default: null
        },
        // TODO supprimer
        issuer: {
            doc: 'SAML Request Issuer identification',
            format: String,
            default: null
        }
    },
    webservices: {
        i2a_userApplications_url: {
            doc: 'Url du WebService i2a : liste des applications habilitées pour un utilisateur',
            format: String,
            default: null
        },
        i2a_allApplications_url: {
            doc: 'URL du web service i2a',
            format: String,
            default: null
        },
        i2a_authorisation: {
            doc: 'URL dtodo',
            format: String,
            default: null
        },
        i2a_ws_login: {
            format: String,
            default: null
        },
        i2a_ws_password: {
            format: String,
            default: null
        }
    },
    espaces: {
        espace1: {
            id: {
                doc: 'Id de la catégorie à assigner dans l\'élément du DOM la représentant',
                format: String,
                default: null
            },
            libelle: {
                doc: 'Libellé de la catégorie',
                format: String,
                default: null
            },
            liens: {
                doc: 'liste de couples url/libelles représentant les liens de la catégorie',
                format: formats.validateFormatEspaces,
                default: null
            }
        },
        espace2: {
            id: {
                doc: 'Id de la catégorie à assigner dans l\'élément du DOM la représentant',
                format: String,
                default: null
            },
            libelle: {
                doc: 'Libellé de la catégorie',
                format: String,
                default: null
            },
            liens: {
                doc: 'liste de couples url/libelles représentant les liens de la catégorie',
                format: formats.validateFormatEspaces,
                default: null
            }
        },
        espace3: {
            id: {
                doc: 'Id de la catégorie à assigner dans l\'élément du DOM la représentant',
                format: String,
                default: null
            },
            libelle: {
                doc: 'Libellé de la catégorie',
                format: String,
                default: null
            },
            liens: {
                doc: 'liste de couples url/libelles représentant les liens de la catégorie',
                format: formats.validateFormatEspaces,
                default: null
            }
        },
        espace4: {
            id: {
                doc: 'Id de la catégorie à assigner dans l\'élément du DOM la représentant',
                format: String,
                default: null
            },
            libelle: {
                doc: 'Libellé de la catégorie',
                format: String,
                default: null
            },
            liens: {
                doc: 'liste de couples url/libelles représentant les liens de la catégorie',
                format: formats.validateFormatEspaces,
                default: null
            }
        },
        espace5: {
            id: {
                doc: 'Id de la catégorie à assigner dans l\'élément du DOM la représentant',
                format: String,
                default: null
            },
            libelle: {
                doc: 'Libellé de la catégorie',
                format: String,
                default: null
            },
            liens: {
                doc: 'liste de couples url/libelles représentant les liens de la catégorie',
                format: formats.validateFormatEspaces,
                default: null
            }
        },
        espace6: {
            id: {
                doc: 'Id de la catégorie à assigner dans l\'élément du DOM la représentant',
                format: String,
                default: null
            },
            libelle: {
                doc: 'Libellé de la catégorie',
                format: String,
                default: null
            },
            liens: {
                doc: 'liste de couples url/libelles représentant les liens de la catégorie',
                format: formats.validateFormatEspaces,
                default: null
            }
        },
        espace7: {
            id: {
                doc: 'Id de la catégorie à assigner dans l\'élément du DOM la représentant',
                format: String,
                default: null
            },
            libelle: {
                doc: 'Libellé de la catégorie',
                format: String,
                default: null
            },
            liens: {
                doc: 'liste de couples url/libelles représentant les liens de la catégorie',
                format: formats.validateFormatEspaces,
                default: null
            }
        },
        espace8: {
            id: {
                doc: 'Id de la catégorie à assigner dans l\'élément du DOM la représentant',
                format: String,
                default: null
            },
            libelle: {
                doc: 'Libellé de la catégorie',
                format: String,
                default: null
            },
            liens: {
                doc: 'liste de couples url/libelles représentant les liens de la catégorie',
                format: formats.validateFormatEspaces,
                default: null
            }
        }
    },
    liens_statiques: {
        search: '',
        my_subscriptions: '',
        home: '',
        wac: ''
    }
});

config.refresh = function () {
    config.loadFile([
        __dirname + '/config/espaces/espaces.json',
        __dirname + '/config/' + config.get('environnement') + '.json'
    ]);
};

config.hidePasswords = function (data) {
    data.hapi_auth_cookie.password = '*******';
    data.database.password = '*******';
    data.webservices.i2a_ws_password = '*******';
};

config.toStringWithoutPasswords = function () {
    var data = JSON.parse(this.toString());
    this.hidePasswords(data);
    return JSON.stringify(data, null, 2);
};

config.refresh();

config.validate({ strict: true });

module.exports = config;
