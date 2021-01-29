import { HttpModule, Module } from '@nestjs/common'
import { ProductModule } from 'src/products/product/product.module'
import { EcontController } from './econt.controller'
import { EcontService } from './econt.service'

@Module({
    imports: [HttpModule, ProductModule],
    controllers: [EcontController],
    providers: [EcontService],
    exports: [EcontService]
})
export class EcontModule {}
