import { BadRequestException, Controller, Get, InternalServerErrorException, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { Cookie } from "src/decorators/cookie.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly jwtService: JwtService) { }

    @Get('saml/login')
    @UseGuards(AuthGuard('saml'))
    async login() { }

    @Post('saml/callback')
    @UseGuards(AuthGuard('saml'))
    async callback(@Req() req: any, @Res() res: Response, @Cookie() cookie: any) {
        const keycloack_profile = req.user;
        const keycloack_uuid = keycloack_profile.attributes.id;

        console.log(cookie);

        if (!cookie.connection_request_source) {
            throw new BadRequestException('Request should be sent by system and include connection_request_source cookie-parameter');
        }

        const direction: string | undefined = cookie.connection_request_source === 'leader' ? process.env.LEADER_REDIRECT_URL : process.env.SKILLS_REDIRECT_URL;

        if (!direction) {
            throw new InternalServerErrorException('Direction not initialized');
        }

        let url: string;
        if (cookie.is_connection_mode) {
            url = direction + `?keycloack_uuid=${keycloack_uuid}`;
        } else {
            const jwt = await this.generateJwt(keycloack_uuid);
            url = direction + `?token=${jwt}`
        }

        return res.redirect(url);
    }

    async generateJwt(keycloack_uuid: string): Promise<string> {
        return this.jwtService.sign(
            { keycloack_uuid: keycloack_uuid },
            {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
                secret: process.env.JWT_SECRET,
            }
        );
    }


}