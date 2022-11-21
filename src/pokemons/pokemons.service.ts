import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonsService {
  constructor(@InjectRepository(Pokemon) private repo: Repository<Pokemon>) {}

  createPokemon(name: string, img: string) {
    const pokemon = this.repo.create({ name, img });

    return this.repo.save(pokemon);
  }
  async findOne(id: number) {
    const pokemon = await this.repo.findOne({ where: { id } });
    if (!pokemon) {
      throw new NotFoundException(`there is no pokemon with id=${id}`);
    }

    return pokemon;
  }
  getAllSorted() {
    return this.repo.find({
      take: 10,
      order: { points: 'DESC' },
    });
  }

  async voteUp(id: number) {
    const pokemon = await this.repo.findOne({ where: { id } });
    if (!pokemon) {
      throw new NotFoundException(`there is no pokemon with id=${id}`);
    }

    pokemon.points += 1;
    this.repo.save(pokemon);

    return pokemon;
  }
}
