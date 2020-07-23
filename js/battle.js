//DOM VARIABLES
let weaponDisplay = document.getElementById('weapon');
let healthDisplay = document.getElementById('health');
let enemyWeaponDisplay = document.getElementById('enemy-weapon');
let enemyHealthDisplay = document.getElementById('enemy-health');
let enemyNameDisplay = document.getElementById('enemy-name');
let playerInput = document.getElementById('player-input');
let gameText = document.getElementById('game-text');
let userInput = '';

//PLAYER/ENEMY WEAPONS OBJECT
const playerWeapons = {
  basicSword: {
    name: 'Basic Sword',
    damage: 15,
    type: 'Weapon',
  },
  steelSword: {
    name: 'Steel Sword',
    damage: 25,
    type: 'Weapon',
  },
  knightSword: {
    name: `Knight's Sword`,
    damage: 35,
    type: 'Weapon',
  },
  masterSword: {
    name: `Master Sword`,
    damage: 45,
    type: 'Weapon',
  },
};

const enemyWeapons = {
  basicClub: {
    name: 'Basic Club',
    damage: 10,
    type: 'Weapon',
  },
};

//PLAYER/ENEMY CLASSES AND INSTANCES
//Attack Atr: Int between 1 and 10
//Defense Atr: Int between 1 and 20
//Luck Atr: Int between 1 and 20
//Attack Modifier: Int between 1 and 5
class Player {
  constructor(
    name,
    weapon,
    inventory,
    attackAtr,
    defenseAtr,
    magicAtr,
    luckAtr,
    magicLevel,
    attMod
  ) {
    this.name = name;
    this.weapon = weapon;
    this.inventory = inventory;
    this.attackAtr = attackAtr;
    this.defenseAtr = defenseAtr;
    this.magicAtr = magicAtr;
    this.luckAtr = luckAtr;
    this.health = 100;
    this.magicLevel = magicLevel;
    this.attMod = attMod;
  }

  attack(enemy, weapon) {
    const roll20 = dieRolls.roll20();
    console.log(`You rolled a ${roll20}`);
    if (roll20 + this.attMod > enemy.luckAtr) {
      const roll10 = dieRolls.roll10();
      const enemyHealthLost = roll10 + weapon.damage - enemy.defenseAtr;
      console.log(`Roll10: ${roll10}, Weapon Damage: ${weapon.damage}`);
      enemy.health -= enemyHealthLost;
      if (weapon.type !== 'Weapon') {
        gameText.innerText = `You used a ${weapon.name}, it dealt ${enemyHealthLost} damage!`;
        weapon.count--;
      } else {
        gameText.innerText = `You struck the ${enemy.name}, he lost ${enemyHealthLost} health!`;
        console.log(`Hero Health: ${this.health}`);
        console.log(`${enemy.name} Health: ${enemy.health}`);
      }
    } else {
      gameText.innerText = `You missed!`;
    }
    updateStats(hero, game.currentEnemy);
    changeTurn();
  }

  useItem(item) {
    let itemToUse = '';
    item = toTitleCase(item);
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === item) {
        itemToUse = this.inventory[i];
        console.log(itemToUse.count);
        if (itemToUse.count === 0) {
          alert('You have none of that item left!');
          return;
        } else {
          console.log(`Count gone down`, this.inventory);
          if (itemToUse.type === 'Light') {
            this.heal(itemToUse);
          } else if (itemToUse.type === 'Dark') {
            this.attack(game.currentEnemy, itemToUse);
          }
        }
      }
    }
  }

  heal(item) {
    const healingPoints = item.value;
    if (this.health === 100) {
      alert(`You're already at full health!`);
    } else if (this.health + healingPoints > 100) {
      this.health = 100;
      alert(
        `You've healed yourself by ${healingPoints} points. Your health is now at ${this.health}.`
      );
      item.count--;
      console.log(this.inventory);
    } else {
      this.health += healingPoints;
      alert(
        `You've healed yourself by ${healingPoints} points. Your health is now at ${this.health}.`
      );
      item.count--;
    }
  }
}

const hero = new Player(
  'Knight',
  playerWeapons.basicSword,
  [
    {
      name: 'Potion',
      count: 2,
      value: 25,
      type: 'Light',
      display: true,
    },
    {
      name: 'Small Bomb',
      count: 2,
      type: 'Dark',
      damage: 80,
      display: true,
    },
  ],
  9,
  2,
  2,
  5,
  50,
  4,
  2
);

class Enemy {
  constructor(
    name,
    weapon,
    inventory,
    attackAtr,
    defenseAtr,
    magicAtr,
    luckAtr,
    attMod
  ) {
    this.name = name;
    this.weapon = weapon;
    this.inventory = inventory;
    this.attackAtr = attackAtr;
    this.defenseAtr = defenseAtr;
    this.magicAtr = magicAtr;
    this.luckAtr = luckAtr;
    this.health = 100;
    this.attMod = attMod;
  }

  attack(weapon) {
    const roll20 = dieRolls.roll20();
    console.log(`Enemy rolled a ${roll20}`);
    if (roll20 + this.attMod > hero.luckAtr) {
      const roll10 = dieRolls.roll10();
      const playerHealthLost = roll10 + weapon.damage - hero.defenseAtr;
      hero.health -= playerHealthLost;
      if (weapon.type !== 'Weapon') {
        alert(
          `The ${this.name} used a ${weapon.name}, it dealt ${playerHealthLost} damage!`
        );
      } else {
        alert(
          `The ${this.name} struck you, you lost ${playerHealthLost} health!`
        );
        console.log(`Hero Health: ${hero.health}`);
        console.log(`${this.name} Health: ${this.health}`);
      }
    } else {
      alert(`${this.name} missed!`);
    }
  }

  useItem(item) {
    let itemToUse = '';
    item = toTitleCase(item);
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === item) {
        itemToUse = this.inventory[i];
        console.log(itemToUse.count);
        if (itemToUse.count === 0) {
          alert('You dont have enough to use that');
          return;
        } else {
          this.inventory[i].count--;
          console.log(`Count gone down`, this.inventory);
          if (itemToUse.type === 'Light') {
            this.heal(itemToUse);
          } else if (itemToUse.type === 'Dark') {
            this.attack(itemToUse);
          }
        }
      }
    }
  }

  heal(item) {
    const healingPoints = item.value;
    if (this.health + healingPoints > 100) {
      this.health = 100;
      gameText.innerText = `The ${this.name} casts a healing spell, his health is now at ${this.health}.`;
    } else {
      this.health += healingPoints;
      gameText.innerText = `The ${this.name} casts a healing spell, his health is now at ${this.health}.`;
    }
  }
}

const goblin = new Enemy(
  'Goblin',
  enemyWeapons.basicClub,
  [
    {
      name: 'Potion',
      count: 2,
      value: 25,
      type: 'Light',
      display: true,
    },
    {
      name: 'Deadly Spell',
      count: 1,
      damage: 25,
      type: 'Dark',
      display: true,
    },
  ],
  4,
  3,
  0,
  8,
  2
);

const troll = new Enemy(
  'Troll',
  enemyWeapons.basicClub,
  [
    {
      name: 'Potion',
      count: 2,
      value: 25,
      type: 'Light',
      display: true,
    },
    {
      name: 'Deadly Spell',
      count: 1,
      damage: 25,
      type: 'Dark',
      display: true,
    },
  ],
  4,
  3,
  0,
  8,
  2
);

//VARIABLES THAT DECIDE CURRENT ENEMY
const enemyArr = [goblin, troll];
let enemyIndex = 0;

//GAME OBJECT
const game = {
  play: true,
  battle: false,
  currentTurn: 'player',
  currentEnemy: enemyArr[enemyIndex],
  changeEnemy() {
    this.currentEnemy = enemyArr[enemyIndex];
  },
};

//DIALOG
const dialog = {
  spotEnemy: `You see a ${game.currentEnemy.name} running towards your with a firey rage in his eyes! It looks like you will be thrown into a battle, what will you do? OPTIONS: (a)ttack, (u)se item?`,
};

//HELPER FUNCTIONS
const toTitleCase = function (str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const dieRolls = {
  roll20() {
    return Math.floor(Math.random() * 20 + 1);
  },

  roll10() {
    return Math.floor(Math.random() * 10 + 1);
  },

  roll5() {
    return Math.floor(Math.random() * 5 + 1);
  },
};

const updateStats = (player, enemy) => {
  weaponDisplay.innerText = player.weapon.name;
  healthDisplay.innerText = player.health;
  enemyWeaponDisplay.innerText = enemy.weapon.name;
  enemyHealthDisplay.innerText = enemy.health;
  enemyNameDisplay.innerText = enemy.name;
};

const changeTurn = () => {
  game.currentTurn === 'player'
    ? (game.currentTurn = 'enemy')
    : (game.currentTurn = 'player');
};

// BATTLE FUNCTION
// const battle = () => {
//   updateStats();
//   promptUser();
// };

// battle();

//TURNS
const enemyTurn = () => {
  gameText.innerText = `The ${game.currentEnemy.name} is planning his next move!`;
  document.addEventListener('keypress', e => {
    if (game.currentEnemy.health > 35) {
      const roll5 = dieRolls.roll5();
      if (roll5 === 1) {
        game.currentEnemy.useItem(game.currentEnemy.inventory[1].name);
        changeTurn();
        mainGame();
      } else {
        game.currentEnemy.attack(game.currentEnemy.weapon);
        changeTurn();
        mainGame();
      }
    } else {
      const roll10 = dieRolls.roll10();
      if (roll10 % 2 === 1 && game.currentEnemy.inventory[0].count > 0) {
        game.currentEnemy.useItem(game.currentEnemy.inventory[0].name);
        changeTurn();
      } else {
        if (roll10 <= 5 && game.currentEnemy.inventory[1].count > 0) {
          game.currentEnemy.useItem(game.currentEnemy.inventory[1].name);
          changeTurn();
          mainGame();
        } else {
          game.currentEnemy.attack(game.currentEnemy.weapon);
          changeTurn();
          mainGame();
        }
      }
    }
  });
};

const mainGame = enemy => {
  updateStats(hero, game.currentEnemy);
  if (game.play) {
    if (game.currentTurn !== 'player') {
      enemyTurn();
    } else {
      playerInput.focus();
      gameText.innerText = dialog.spotEnemy;
      document.addEventListener('keypress', e => {
        if (e.keyCode === 13 && playerInput.value !== '') {
          e.preventDefault();
          let value = playerInput.value.toLowerCase();
          console.log(value);
          playerInput.value = '';
          playerInput.focus();
          if (value === 'attack') {
            hero.attack(game.currentEnemy, hero.weapon);
            mainGame();
          }
        } else if (e.keyCode === 13 && playerInput.value !== '') {
          e.preventDefault();
          null;
        }
      });
    }
  }
};

mainGame();