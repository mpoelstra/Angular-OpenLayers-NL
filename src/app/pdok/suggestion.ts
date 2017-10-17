/**
 * NOTE: properties are optional with below syntax when explicitly creating a new instance
 * and can only be assigned after creating a new instance:
 *
 * let suggestion = new Suggestion();
 * suggestion.id = 1;
 * suggestion.weergavenaam = ...;
 * 
 * @export
 * @class Suggestion
 */
// export class Suggestion {
//   type: number;
//   weergavenaam: string;
//   id: string;
//   score: number;
// }

/**
 * NOTE: properties can be made required when explicitly creating a new instance with a constructor:
 * 
 * let suggestion = new Suggestion(1, 'hello', 'horror', 6)
 * 
 * @export
 * @class Suggestion
 * @param type
 * @param weergavenaam
 * @param id
 * @param score
 */
export class Suggestion {
    public type: string;
    public weergavenaam: string;
    public id: string;
    public score: number;
  
      constructor(type: string = '', weergavenaam: string = '', id: string = '', score: number = 0) {
          this.type = type;
          this.id = id;
          this.weergavenaam = weergavenaam;
          this.score = score;
      }
  }
  
  