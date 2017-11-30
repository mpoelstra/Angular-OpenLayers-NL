import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let markers = [];

    let lookups = [
        {
          id: 'adr-778f549625333e262b0bc23f1e4dde0e', //zilvermeer 2, adr-778f549625333e262b0bc23f1e4dde0e
          bron: 'BAG',
          type: 'adres',
          woonplaatsnaam: 'Groningen',
          weergavenaam: 'Zilvermeer 2, 9735BA Groningen',
          gemeentenaam: 'Groningen',
          huisnummer: 2,
          postcode: '9735BA',
          centroide_rd: 'POINT(236306.031 584009.003)',
          straatnaam: 'Zilvermeer',
          aliassen: 'Mooi huis'
        }
      ];

      return {markers, lookups};
  }
}
