import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { SamlConfig, Strategy } from "passport-saml";
import * as fs from 'fs';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, 'saml') {
    constructor() {
        super({
            entryPoint: 'http://localhost:8080/realms/master/protocol/saml', // URL авторизации Keycloak
            issuer: 'nest-saml-client', // clientId из JSON
            callbackUrl: 'http://localhost:3000/auth/saml/callback', // redirectUris[0]
            cert: fs.readFileSync('idp-public-cert.pem', 'utf-8'), // publicKey
            privateKey: fs.readFileSync('sp-private-key.pem', 'utf-8'), // privateKey
        } as SamlConfig)
    }

    async validate(profile: any) {
        return profile;
    }
}

/*
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:21.1.1 start-dev
*/