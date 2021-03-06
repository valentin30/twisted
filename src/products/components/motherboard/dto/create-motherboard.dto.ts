import { IsBoolean, IsIn, IsNotEmpty, IsPositive, IsString } from 'class-validator'
import { FORMAT_TYPES } from 'src/utils/constants'

export class CreateMotherboardDto {
    @IsPositive()
    productId: number

    @IsString()
    series: string

    @IsString()
    socket: string

    @IsString()
    chipset: string

    @IsPositive()
    ramCapacity: number

    @IsPositive()
    maxRamSpeed: number

    @IsPositive()
    ramSlots: number

    @IsString()
    ramType: string

    @IsNotEmpty()
    m2Ports: number

    @IsPositive()
    sataPorts: number

    @IsPositive()
    pciSlots: number

    @IsBoolean()
    nvidiaSli: boolean

    @IsBoolean()
    amdCrossfire: boolean

    @IsIn(Array.from(FORMAT_TYPES.keys()))
    format: string

    @IsPositive()
    consumption: number
}
