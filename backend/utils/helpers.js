function Lobby() {
  this.players = [];
  this.submittedCards = [];
}
// var arr = cardsjs.map(function (card) {
//   // console.log("card sets is ", card.card_sets)
//   return {
//     name: card.name,
//     type: card.type,
//     desc: card.desc,
//     atk: card.atk,
//     def: card.def,
//     level: card.level,
//     race: card.race,
//     attribute: card.attribute,
//     archetype: card.archetype,
//     img: card.card_images[0].image_url,
//     sets: card.card_sets ? card.card_sets.map((set) => {
//       return {
//         "set_name": set.set_name,
//         "set_code": set.set_code,
//         "set_rarity": set.set_rarity,
//         "set_rarity_code": set.set_rarity_code
//       }

//     })
//     : [{
//       "set_name": "None", "set_code": "None", "set_rarity": "None", "set_rarity_code": "None"
//     }]
//     };
//   });

// for(card in cardsjs){
//     new Card(arr[card])
//     .save()
//     .catch((err)=> {
//         console.log(err.message);
//     })
// }
module.exports = { Lobby };