import { EntityRepository } from 'typeorm'
import { FindComponentRepository } from '../../find-component.repository'
import { GPU } from '../entity/gpu.entity'

@EntityRepository(GPU)
export class GPURepository extends FindComponentRepository<GPU> {
    protected createConditionForComponentKey(key: string): string {
        if (key === 'format') {
            return `component.${key} IN (:...${key})`
        }
        return super.createConditionForComponentKey(key)
    }
}
