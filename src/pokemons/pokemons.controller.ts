import {
  Body,
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
  addPokemon(@Body() body: CreatePokemonDto, @Session() session: any) {
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
