openssl req -newkey rsa:2048 -new -x509 -days 3652 -nodes -out tls-demo-pub.crt -keyout tls-demo-private.pem
Country Name (2 letter code) [AU]:FR
State or Province Name (full name) [Some-State]:IDF
Locality Name (eg, city) []:PARIS
Organization Name (eg, company) [Internet Widgits Pty Ltd]:La Poste
Organizational Unit Name (eg, section) []:BSCC
Common Name (e.g. server FQDN or YOUR name) []:laposte-portail-entreprise.octo.com
Email Address []:laposte-portailentreprise@octo.com

Fusion crt+key :
openssl pkcs12 -export -out example.com.pfx -inkey www.bandeauportail.net2-courrier.extra.laposte.fr.key -in www.bandeauportail.net2-courrier.extra.laposte.fr._domain.crt  -certfile www.bandeauportail.net2-courrier.extra.laposte.fr._chain.crt