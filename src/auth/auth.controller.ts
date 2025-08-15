import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    @Get('saml/login')
    @UseGuards(AuthGuard('saml'))
    async login() { }

    @Post('saml/callback')
    @UseGuards(AuthGuard('saml'))
    async callback(@Req() req: any) {
        console.log(req.user);
    }
}