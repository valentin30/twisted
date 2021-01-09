import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { BrandModule } from './brand/brand.module'
import { ComputerModule } from './computer/computer.module'
import { TypeOrmConfigService } from './config/typeorm-config.service'
import { ImageModule } from './image/image.module'
import { ProductsModule } from './products/products.module'

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService
        }),
        MulterModule.register({
            dest: './uploads'
        }),
        AuthModule,
        ProductsModule,
        ImageModule,
        BrandModule,
        ComputerModule
    ]
})
export class AppModule {}