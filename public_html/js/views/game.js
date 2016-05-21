define(function(require) {

	var BaseView = require('views/baseView'),
		tmpl = require('tmpl/game'),
		phaser = require('phaser');

	var View = BaseView.extend({
		template: tmpl,
		className: 'game__main game__main_visible js-game',
		initialize: function() {
		},
		render: function() {
			console.log("Script is in action");
			// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'playscreen', {
			var game = new Phaser.Game("100", "100", Phaser.AUTO, 'playscreen', {
				preload: function() {
					// game.load.image('sky', 'images/assets/landscape.jpg');
					// game.load.image('sky2', 'images/assets/landscape2.jpg');
					// game.load.image('sky3', 'images/assets/landscape3.jpg');
					// game.load.image('sky4', 'images/assets/landscape4.jpeg');
					// game.load.image('sky5', 'images/assets/landscape5.jpg');
					game.load.image('ground', 'images/assets/platform.png');

					game.load.image('arena1', 'images/assets/1408104008_shao_kahn_throne.jpg');
					game.load.image('arena2', 'images/assets/1408104091_soul_chamber.jpg');
					game.load.image('arena3', 'images/assets/1408104102_thepit_day.jpg');
					game.load.image('arena4', 'images/assets/1408104212_thepit_night.jpg');
					game.load.image('arena5', 'images/assets/1408104262_wastelands.jpg');
					game.load.image('arena6', 'images/assets/1408104297_the_cathedral.jpg');
					game.load.image('arena7', 'images/assets/1408104361_desert.jpg');
					game.load.image('arena8', 'images/assets/1408104421_the_subway.jpg');
					game.load.image('arena9', 'images/assets/1408104505_tower.jpg');
					game.load.image('arena10', 'images/assets/1408104606_the_armory.jpg');
                    game.load.image('hpbar', 'images/assets/hpbar.png');
                    game.load.image('hpbar-empty', 'images/assets/hpbar_empty.png')
					game.load.spritesheet('dude', 'images/assets/zero.png', 141, 0);
                    game.load.spritesheet('opponent', 'images/assets/scorpion.png', 141, 0);
				},
				create: create,
				update: update
			});

			var ground,
				player,
                opponent,
                firstFrame,
                movesList;

            function checkOverlap(spriteA, spriteB) {
                var boundsA = spriteA.getBounds();
                var boundsB = spriteB.getBounds();
                return Phaser.Rectangle.intersects(boundsA, boundsB);
            }
    
    		function create() {
				game.physics.startSystem(Phaser.Physics.ARCADE);
				// skies = ['sky', 'sky2', 'sky3', 'sky4', 'sky5', 'arena1', 'arena2', 'arena3', 'arena4', 'arena5', 'arena6', 'arena7', 'arena8', 'arena9', 'arena10'];
				skies = ['arena1', 'arena2', 'arena3', 'arena4', 'arena5', 'arena6', 'arena7', 'arena8', 'arena9', 'arena10'];
				var rand = Math.random() * 10^0,
                // var rand = 0;
				sky = game.add.sprite(0, 0, skies[rand]);
                sky.scale.setTo(window.innerWidth/sky.width, window.innerHeight/sky.height);
                firstFrame = true;
				ground = game.add.sprite(0, game.world.height - 16, 'ground');
				ground.scale.setTo(5, 2);
				ground.game.physics.arcade.enableBody(ground);
				ground.visible = false;
				ground.body.immovable = true;
                hpbarplayer_e = game.add.sprite(50,50,'hpbar-empty');
                hpbaropponent_e = game.add.sprite(game.world.width/100*70, 50, 'hpbar-empty');
                hpbarplayer = game.add.sprite(50 , 50, 'hpbar');
				hpbaropponent = game.add.sprite(game.world.width/100*70, 50, 'hpbar');
                cursors = game.input.keyboard.createCursorKeys();
				attack = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
				legAttack = game.input.keyboard.addKey(Phaser.Keyboard.X);
				player = game.add.sprite(game.world.width/100*25, game.world.height - 750, 'dude');
                opponent = game.add.sprite(game.world.width/100*75 , game.world.height - 750, 'opponent');
                player.scale.setTo(2.5,2.5);
                opponent.scale.setTo(-2.5,2.5);
                opponent.anchor.setTo(0.5);
				game.physics.arcade.enable(player);
                game.physics.arcade.enable(opponent);
                opponent.body.bounce.y = 0;
                opponent.body.gravity.y = 1600;
                opponent.body.collideWorldBounds = true;
				player.body.bounce.y = 0;
				player.body.gravity.y = 1600;
				player.body.collideWorldBounds = true;
				player.animations.add('stay', [0, 1, 2, 3, 4, 5, 6], 10, true);
                player.animations.add('left', [14, 13, 12, 11, 10, 9, 8, 7], 12, true);
                player.animations.add('right', [7, 8, 9, 10, 11, 12, 13, 14], 12, true);
                player.animations.add('jump', [15, 16, 17, 18, 19, 20, 21, 22], 10, false);
                player.animations.add('jumpleft', [22, 21, 20, 19, 18, 17, 16, 15], 10, false);
                player.animations.add('kick', [23, 24], 10, false);
                player.animations.add('leg', [26, 27, 28, 29, 30], 10, false);
                opponent.animations.add('stay', [0, 1, 2, 3, 4, 5, 6], 10, true);
                opponent.animations.add('left', [14, 13, 12, 11, 10, 9, 8, 7], 12, true);
                opponent.animations.add('right', [7, 8, 9, 10, 11, 12, 13, 14], 12, true);
                opponent.animations.add('jump', [15, 16, 17, 18, 19, 20, 21, 22], 10, false);
                opponent.animations.add('jumpleft', [22, 21, 20, 19, 18, 17, 16, 15], 10, false);
                opponent.animations.add('kick', [23, 24], 10, false);
                opponent.animations.add('leg', [26, 27, 28, 29, 30, 31, 32], 10, false);
                opponent.body.customSeparateX = true;
                player.body.customSeparateX = true;          
                playerHP = 100;
                opponentHP = 100;
                cropRectOpponentHP = new Phaser.Rectangle(0, 0, 519, 50);
                cropRectPlayerHP = new Phaser.Rectangle(0,0,519,50);
                hpbarplayer.crop(cropRectPlayerHP)
                hpbaropponent.crop(cropRectOpponentHP);
                stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
                stateText.anchor.setTo(0.5, 0.5);
                stateText.visible = false;
                movesList = ['stay', 'left', 'right', 'jump', 'jumpleft', 'kick', 'leg'];
                timer = game.time.create(false);
                timer.loop(11000, function() {opponent.animations.play('stay'); opponent.body.velocity.x = 0}, game);
                timer.loop(3000, function() {opponent.animations.play('left');
                                             opponent.body.velocity.x = 100});
                timer.loop(2000, function() {opponent.animations.play('kick');
                                                opponent.animations.currentAnim.onComplete.add(function() {opponent.animations.play('stay')}, game);});
                timer.loop(7000, function() {opponent.animations.play('jump'); opponent.body.velocity.x = -100;
                                                opponent.body.velocity.y = -850;
                                                opponent.animations.currentAnim.onComplete.add(function() {opponent.animations.play('stay')}, game);});
                timer.loop(5000, function() {opponent.animations.play('right');
                                            opponent.body.velocity.x = -100});
                timer.start();
                }

			function update() {

				game.physics.arcade.collide(player, ground);
                game.physics.arcade.collide(opponent, ground);
                game.physics.arcade.collide(player, opponent);
				player.body.velocity.x = 0;
               if (player.body.touching.down) {
                    firstFrame = false;
                }
				 if (cursors.left.isDown) {
					console.log("Move to the left");
					player.body.velocity.x = -300;
					if (player.body.touching.down) {
						player.animations.play('left');
					}
				} else if (cursors.right.isDown) {
					console.log("Move to the right");
					player.body.velocity.x = 300;
					if (player.body.touching.down)
						player.animations.play('right');
				} else if (attack.isDown) {
					player.animations.play('kick');
                    if(checkOverlap(player, opponent)) {
                        opponentHP -= 1;
                        cropRectOpponentHP.width = 500/100*opponentHP;  
                    }
				} else if (legAttack.isDown) {
					player.animations.play('leg');
                    if(checkOverlap(player, opponent)) {
                        console.log("hit");
                        opponentHP -= 2;
                        cropRectOpponentHP.width = 500/100*opponentHP;
                    }
				} else {
					if (player.body.touching.down)
                        if (player.animations.currentAnim.loop || player.frame == 15) {
                            player.animations.play('stay');
                        } else {
                            player.animations.currentAnim.onComplete.add(function() {player.animations.play('stay')}, game);
                        }
                    else { if (firstFrame == true) {
                        console.log ('we are flying for the first time');

                    opponent.animations.play('stay');
                    player.frame = 15}}
				}
				if (cursors.up.isDown && player.body.touching.down) {
					console.log("Jump");
					if (cursors.left.isDown) {
						player.animations.play('jumpleft');
					} else {
						player.animations.play('jump');
					}
					player.animations.currentAnim.onComplete.add(function() {player.frame = 15}, game);
					player.body.velocity.y = -1550;
				}
                if (opponent.animations.currentAnim.name == 'kick') {
                    if(checkOverlap(player, opponent)) {
                        playerHP -= 2;
                        cropRectPlayerHP.width = 500/100*playerHP;
                    }
                }
                if (opponentHP == 0) {
                    opponent.kill();
                    stateText.text = "GAME OVER";
                    stateText.visible = true;
                    hpbaropponent.visible = false;
                }
                if (playerHP == 0) {
                    player.kill();
                    stateText.text = "GAME OVER";
                    stateText.visible = true;
                    hpbarplayer.visible = false;
                }
                hpbaropponent.updateCrop();
                hpbarplayer.updateCrop();
			}
			return BaseView.prototype.render.call(this);
		},
	});


	return View;
});