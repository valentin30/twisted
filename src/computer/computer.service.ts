import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CaseService } from 'src/products/components/case/case.service'
import { Case } from 'src/products/components/case/entity/case.entity'
import { CPU } from 'src/products/components/cpu/entity/cpu.entity'
import { GPU } from 'src/products/components/gpu/entity/gpu.entity'
import { GPUService } from 'src/products/components/gpu/gpu.service'
import { Motherboard } from 'src/products/components/motherboard/entity/motherboard.entity'
import { PSU } from 'src/products/components/psu/entity/psu.entity'
import { PSUService } from 'src/products/components/psu/psu.service'
import { RAM } from 'src/products/components/ram/entity/ram.entity'
import { RAMService } from 'src/products/components/ram/ram.service'
import { Storage } from 'src/products/components/storage/entity/storage.entity'
import { StorageService } from 'src/products/components/storage/storage.service'
import { User } from 'src/user/entity/user.entity'
import { Repository } from 'typeorm'
import { CPUService } from '../products/components/cpu/cpu.service'
import { MotherboardService } from '../products/components/motherboard/motherboard.service'
import { CompatibilityService } from './compatibility.service'
import { Component, CreateComputerDto } from './dto/computer.dto'
import { Computer } from './entity/computer.entity'
import { ComputerStorage } from './entity/storage-quantity.entity'
import { ComputerRepository } from './repository/computer.repository'

@Injectable()
export class ComputerService {
    constructor(
        @InjectRepository(ComputerRepository)
        private readonly computerRepository: ComputerRepository,
        @InjectRepository(ComputerStorage)
        private readonly computerStorageRepository: Repository<ComputerStorage>,
        private readonly compatibilityService: CompatibilityService,
        private readonly cpuService: CPUService,
        private readonly motherboardService: MotherboardService,
        private readonly ramService: RAMService,
        private readonly caseService: CaseService,
        private readonly psuService: PSUService,
        private readonly gpuService: GPUService,
        private readonly storageService: StorageService
    ) {}

    async create(createComputerDto: CreateComputerDto, user: User) {
        const computer: Computer = await this.createComputer(createComputerDto)

        computer.userId = user.id

        this.compatibilityService.verifyCompatibility(computer)

        await this.computerRepository.save(computer)

        computer.storages.forEach((computerStorage: ComputerStorage) => {
            computerStorage.computerId = computer.id
            this.computerStorageRepository.save(computerStorage)
        })

        return computer
    }

    private async createComputer(createComputerDto: CreateComputerDto): Promise<Computer> {
        const cpu: CPU = await this.cpuService.findByProductId(createComputerDto.cpuId)
        const ram: RAM = await this.ramService.findByProductId(createComputerDto.ram.productId)
        const chassis: Case = await this.caseService.findByProductId(createComputerDto.caseId)
        const psu: PSU = await this.psuService.findByProductId(createComputerDto.psuId)
        const motherboard: Motherboard = await this.motherboardService.findByProductId(
            createComputerDto.motherboardId
        )

        const computerStorages: ComputerStorage[] = await Promise.all(
            createComputerDto.storages.map(
                async (computerStorage: Component): Promise<ComputerStorage> => {
                    const storage: Storage = await this.storageService.findByProductId(
                        computerStorage.productId
                    )

                    return this.computerStorageRepository.create({
                        storageId: storage.id,
                        storage: storage,
                        quantity: computerStorage.quantity
                    })
                }
            )
        )

        const computer: Computer = this.computerRepository.create({
            cpu,
            ram,
            chassis,
            ramQuantity: createComputerDto.ram.quantity,
            psu,
            storages: computerStorages,
            motherboard
        })

        if (createComputerDto.gpu) {
            const gpu: GPU = await this.gpuService.findByProductId(createComputerDto.gpu.productId)
            computer.gpu = gpu
            computer.gpuQuantity = createComputerDto.gpu.quantity
        }

        return computer
    }
}
