import { Expose } from 'class-transformer';

export class PokemonDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  points: number;

  @Expose()
  img: string;
}
