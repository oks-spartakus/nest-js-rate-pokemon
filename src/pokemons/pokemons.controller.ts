import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SignedInGuard } from 'src/guards/signedin.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreatePokemonDto } from './dtos/create-pokemon.dto';
import { PokemonDto } from './dtos/pokemon.dto';
import { PokemonsService } from './pokemons.service';

@Controller('pokemons')
export class PokemonsController {
  constructor(private pokemonsService: PokemonsService) {}

  @Post()
  @Serialize(PokemonDto)
  @UseGuards(SignedInGuard)
  async addPokemon(@Body() body: CreatePokemonDto, @Session() session: any) {
    const existingPokemon = await this.pokemonsService.findBy(body.name);

    if (existingPokemon) {
      throw new ConflictException(
        `there is already pokemon named ${body.name}`,
      );
    }

    return this.pokemonsService.createPokemon(body.name, body.img);
  }

  @Post('/vote/:id')
  @Serialize(PokemonDto)
  @UseGuards(SignedInGuard)
  voteUp(@Param('id') id: string) {
    return this.pokemonsService.voteUp(+id);
  }

  @Get('/:id')
  @Serialize(PokemonDto)
  async getPokemon(@Param('id') id: string) {
    const pokemon = await this.pokemonsService.findOne(+id);
    if (!pokemon) {
      throw new NotFoundException(`there is no pokemon with id=${id}`);
    }

    return pokemon;
  }

  @Get()
  getCurrentRanking() {
    return this.pokemonsService.getAllSorted();
  }
}
