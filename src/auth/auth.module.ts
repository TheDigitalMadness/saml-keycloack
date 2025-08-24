import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { SamlStrategy } from "src/strategy/saml.strategy";
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers: [AuthController],
    providers: [
        SamlStrategy,
        JwtService
    ]
})
export class AuthModule { }