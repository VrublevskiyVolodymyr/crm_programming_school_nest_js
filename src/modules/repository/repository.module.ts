import { Global, Module } from '@nestjs/common';

import { ActionTokenRepository } from './services/action-token.repository';
import { AdvertisementRepository } from './services/advertisement.repository';
import { AdvertisementViewRepository } from './services/advertisement-view.repository';
import { CarRepository } from './services/car.repository';
import { CurrencyPrivatBankRepository } from './services/currency-privat-bank.repository';
import { ModelRepository } from './services/model.repository';
import { OldPasswordRepository } from './services/old-password.repository';
import { PremiumPurchaseRepository } from './services/premium.repository';
import { PriceCarRepository } from './services/price-car.repository';
import { ProducerRepository } from './services/producer.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { RegionRepository } from './services/region.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  RefreshTokenRepository,
  UserRepository,
  OldPasswordRepository,
  ActionTokenRepository,
  CarRepository,
  ProducerRepository,
  ModelRepository,
  RegionRepository,
  CurrencyPrivatBankRepository,
  PriceCarRepository,
  AdvertisementRepository,
  PremiumPurchaseRepository,
  AdvertisementViewRepository,
];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
