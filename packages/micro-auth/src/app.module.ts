import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from './auth.module';

@Module({
    imports: [
        AuthModule
    ]
})
export class AppModule implements OnModuleInit {
    async onModuleInit() {

    }
}