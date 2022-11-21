import { IsString, IsUrl } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;

  @IsUrl()
  img: string;
}
