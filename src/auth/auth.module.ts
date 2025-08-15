import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { SamlStrategy } from "src/strategy/saml.strategy";

@Module({
    controllers: [AuthController],
    providers: [SamlStrategy]
})
export class AuthModule { }