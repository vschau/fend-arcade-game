/* global document, ctx, Resources */

// Entity namespace
let Entity = (function() {
    // private variables
    const xDelta = 101,
          yDelta = 75,
          spriteWidth = 101,
          baseSpeed = 50,
          canvas = document.getElementsByTagName('canvas'),
          gemSprites = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];

    // Enemy class
    function Enemy() {
        this.x = -spriteWidth;
        this.y = (~~(Math.random() * 3) + 1) * yDelta;
        this.speed = (~~(Math.random() * 10) + 2) * baseSpeed;
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    Enemy.prototype.update = function(dt) {
        this.x += this.speed * dt;
        if (this.x > canvas[0].width) {
            Enemy.call(this);
        }
    };

    Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    // Player class
    function Player() {
        this.x = 2 * xDelta;
        this.y = 5 * yDelta;
        this.blink = false;
        this.sprite = this.sprite || 'images/char-boy.png';
    }

    Player.prototype.reset = function() {
        Player.call(this);
    };

    Player.prototype.update = function(sprite) {
        this.sprite = sprite;
    };

    Player.prototype.render = function() {
        // Blink animation from: https://gamedev.stackexchange.com/questions/70116/how-do-i-make-a-sprite-blink-on-an-html5-canvas
        if (!this.blink || Math.floor(Date.now() / 100) % 2) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    };

    Player.prototype.die = function() {
        this.blink = true;

        return new Promise(function(resolve) {
            setTimeout(() => {
                player.reset();
                resolve();
            }, 500);
        });
    };

    Player.prototype.handleInput = function(keyCode) {
        if (!this.blink) {
            switch (keyCode) {
                case 'left':
                    this.x = (this.x >= xDelta) ? this.x - xDelta : this.x;
                    break;
                case 'up':
                    this.y = (this.y >= yDelta) ? this.y - yDelta : this.y;
                    break;
                case 'right':
                    this.x = (this.x <= 3 * xDelta) ? this.x + xDelta : this.x;
                    break;
                case 'down':
                    this.y = (this.y <= 4 * yDelta) ? this.y + yDelta : this.y;
                    break;
                default:
                    break;
            }
        }
    };

    function Gem() {
        this.x = ~~(Math.random() * 5) * xDelta;
        this.y = (~~(Math.random() * 3) + 1) * yDelta;
        this.sprite = gemSprites[~~(Math.random() * 3)];
    }

    Gem.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x + 5, this.y, 90, 160);
    };

    Gem.prototype.reset = function() {
        Gem.call(this);
    };

    return {
        Player,
        Enemy,
        Gem
    };
}());


// Instantiate the objects
let allEnemies = [new Entity.Enemy()];
let player = new Entity.Player();
let gem = new Entity.Gem();

//allEnemies[0].addNewEnemy();
//Entity.Enemy.prototype.addNewEnemy.call(this);
Entity.Enemy.prototype.addNewEnemy();

document.addEventListener('keydown', e => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (Object.prototype.hasOwnProperty.call(allowedKeys, e.keyCode)) {
        e.preventDefault();
    }
    
    player.handleInput(allowedKeys[e.keyCode]);
});

document.querySelector('.char-selection').addEventListener('click', e => {
    if (e.target.nodeName === 'IMG') {
        player.update(e.target.getAttribute('src'));
    }
});
