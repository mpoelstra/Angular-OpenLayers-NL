import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let markers = [
      {
        aliassen: "grunn",
        bron: "custom",
        centroide_rd: "POINT(234138.240,581683.200)",
        coordinate: [234138.24, 581683.2000000001],
        id: "wgb-ddaff1b0-c48b-4b3d-9104-1ca0408288b8",
        motivation: "daarom",
        naam: "weegbrug 1",
        nummer: "1",
        omschrijving: "mooi",
        status: "in_gebruik",
        type: "weegbrug"
      },
      {
        aliassen: "grunn",
        bron: "custom",
        centroide_rd: "POINT(150285.450,449658.720)",
        coordinate: [150285.44999999998, 449658.72],
        id: "wgb-200585a2-0abe-4695-b0e8-091c4a5ba96c",
        motivation: "daarom",
        naam: "weegbrug 2",
        nummer: "1",
        omschrijving: "mooi",
        status: "in_gebruik",
        type: "weegbrug"
      },
      {
        aliassen: "grunn",
        bron: "custom",
        centroide_rd: "POINT(150261.641,449581.860)",
        coordinate: [150261.64125000002, 449581.86],
        id: "wgb-a50e4d9a-fe0c-46b1-a045-4ef3b92551c0",
        motivation: "daarom",
        naam: "weegbrug 3",
        nummer: "1",
        omschrijving: "mooi",
        status: "in_gebruik",
        type: "weegbrug"
      }
    ];

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
