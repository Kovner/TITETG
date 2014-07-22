/*****
**Game Variables
******/

var GAME_WIDTH = 600,
	GAME_HEIGHT = 600,
	BACKGROUND_COLOR = "rgb(127,127,127)",
	BACKGROUND_IMG = "url('images/stone600x600.png')",
	FLOOR_IMG = 'images/ground0008.jpg',
	TABLE_IMG = 'images/Sprites/table_red.png',
	HERO_IMG = 'images/Sprites/HeroSpriteBigger.png',
	HERO_IMG_RED = 'images/Sprites/HeroSpriteBiggerRed.png',
	BOMB_IMG = 'images/Bomb.png',
	BOMB_WIDTH = 37,
	BOMB_HEIGHT = 36,
	JUMP_SPEED = 5,
	JUMP_SPEED_SLOW = 2.5,
	HORIZONTAL_SPEED = 2,
	HORIZONTAL_SPEED_SLOW = .5,
	MAX_JUMPS = 2,
	WALK_SPEED = 25,
	RUN_SPEED = 25,
	PLAYER_WIDTH = 68,
	PLAYER_HEIGHT = 104,
	BUTTON_COLOR = "#f30",
	PLAYER_GRAVITY = 0.15,
	PLAYER_GRAVITY_SLOW = .0375,
	TABLE_GRAVITY = 0.01,
	TABLE_GRAVITY_SLOW = .005,
	TABLE_WIDTH = 74,
	TABLE_HEIGHT = 40,
	TABLE_COLOR = "rgb(127,127,127)",
	TABLE_SCARCITY = 50,
	BOMB_SCARCITY = 500,
	BOMB_SPEED = 1,
	BOMB_SIZE = 30,
	BOMB_DURATION = 10000
	DAY_SPEED = 65; //65
	;

var tableGrav = TABLE_GRAVITY;
var eventAlerts = false;
var showViz = true;
var bombed = false;
var filterCounter;
var filterArray = [];

var viz;



window.onload = function () {
	
	gameInit();
};

gameInit = function(){
	Crafty.init(GAME_WIDTH,GAME_HEIGHT);
	// Crafty.timer.steptype('fixed', 100);
	Crafty.background(BACKGROUND_IMG + "no-repeat");
	Crafty.sprite(FLOOR_IMG, {Floor:[0,0]});
	Crafty.sprite(TABLE_WIDTH,TABLE_HEIGHT,TABLE_IMG, {
		Tablepic:[0,0],
		TablepicRed:[0,1]
	});
	Crafty.sprite(68,104, HERO_IMG_RED, {
		hero: [0,0]
	});
	Crafty.sprite(BOMB_IMG, {Bombpic: [0,0]});
	//Crafty.background(BACKGROUND_COLOR);
	Crafty.sprite('images/StartButton.png', {StartButton: [0,0]});
	Crafty.sprite('images/SmallMultsButton.png', {SmallMultsButton: [0,0]});
	Crafty.sprite('images/RegionButton.png', {RegionButton: [0,0]});
	Crafty.sprite('images/LineChartButton.png', {LineChartButton: [0,0]});
	Crafty.sprite('images/RestartButton.png', {RestartButton: [0,0]});
	
	Crafty.scene("generateWorld", function () {
		generateWorld();
	});
	Crafty.scene("main", function () {
		main();
	});
	Crafty.scene("gameOver", function () {
		gameOver();
	});
	Crafty.scene("starter", function () {
		starter();
	});
	createComponents();
	Crafty.scene("generateWorld");
}



generateWorld = function() {
	//var floor = Crafty.e("2D, DOM, Floor, Color,Keyboard");
	//floor.color("#330").attr({x: 0,y: GAME_HEIGHT-20,w: GAME_WIDTH,h: 20});
	var floor = Crafty.e("2D, DOM, Floor,Persist");
	floor.attr({x: 0,y: GAME_HEIGHT-20,w: GAME_WIDTH,h: 20});
	
	
	var player = Crafty.e("2D, DOM, Gravity, Keyboard, Collision, DoubleJump, SpriteAnimation, hero, TheHero, Persist");
	player.attr({x:5,y:GAME_HEIGHT-100,w:PLAYER_WIDTH,h:PLAYER_HEIGHT})
		.gravity('Floor').gravityConst(PLAYER_GRAVITY)
		;	
	var placeholderViz = document.getElementById('viz');
	var url = "http://public.tableausoftware.com/views/TITETG_Vizes_v8/SSProfitBySubCat?:embed=y&:display_count=no";
	//var url = "http://public.tableausoftware.com/views/TITETG_Vizes_v8/SSProfitBySubCat?:embed=y&:display_count=no";
	if(showViz) {
		var options = {
			height: '600px',
			width:'600px',
			hideTabs: true,
			hideToolbar: true,
			onFirstInteractive: function () {
				Crafty.scene("starter");
				//alert('vizIsInteractive happened');
			}
		}
	}
	
	Crafty.e("DOM, 2D, Text")
		.attr({x: 60, y:20, w: GAME_WIDTH-130, h: 300})
		.text("Tables in the East:\n The Game: The Beta")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white", "font-size": "35px"})
		.css({"text-shadow": "5px 5px 5px black"});
	
	Crafty.e("DOM, 2D, Text")
		.attr({x: 30, y:120, w: GAME_WIDTH-60, h: 300})
		.text("Loading the viz...")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white"})
		.css({"text-shadow": "5px 5px 5px black"});
		
	Crafty.e("DOM, 2D, Text")
		.attr({x: 30, y:160, w: GAME_WIDTH-60, h: 300})
		.text("If you are stuck on this screen it is possible that public.tableausoftware.com is down or otherwise unresponsive. Sorry.")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white"})
		.css({"text-shadow": "5px 5px 5px black"});
	
	if(showViz) {
		 viz = new tableauSoftware.Viz(placeholderViz, url, options);
		 
		 viz.addEventListener(tableauSoftware.TableauEventName.interactive, function () {
			if (eventAlerts) alert('vizIsInteractive happened');
			return;
		 });
	} else Crafty.scene("starter");
}

var calDate;

main = function() {
	
	if(showViz) {
		viz.getWorkbook().activateSheetAsync(1);
		//viz.getWorkbook().getPublishedSheets()[1].activateAsync();
	}
	var calBackground = Crafty.e("DOM, 2D, Color")
		.attr({x: GAME_WIDTH - 100, y:20, w: 75, h: 20,z:1})
		.color(TABLE_COLOR);
	var calDate  = new Date("Septermber 27, 2012");
	var calendar = Crafty.e("Calendar, DOM, 2D, Text")
		.attr({x: GAME_WIDTH - 100, y:20, w: 75, h: 20,z:2})
		.text((calDate.getMonth()+1) + "/" + calDate.getDate() + "/" + calDate.getFullYear())
		.css({'textAlign': 'center', 'fontSize': 12, 'font-family': 'helvetica'});
	var scoreBackground = Crafty.e("DOM, 2D, Color")
		.attr({x: 20, y:20, w: 60, h: 20,z:1})
		.color(TABLE_COLOR);
	Crafty.e("Scoreboard, DOM, 2D, Text")
			.attr({ x: 20, y: 20, w: 60, h: 20, z:2, points: -16882 })
			.text("$(" + -16882 + ")").textColor('#FF0000')
			.css({'textAlign': 'center', 'fontSize': 12, 'font-family': 'helvetica'})
			;
	var nextTableIndex = 0;
	var nextTableDate = new Date(tablesArray[0][1]);

	filterCounter = 4;
	filterArray = [];
	var rand2;
	calendar.bind("EnterFrame", function() {
		if(Crafty.frame() % DAY_SPEED === 0) {
			calDate.setDate(calDate.getDate() + 1);
			//Crafty("Calendar").each(function () {
				this.text((calDate.getMonth()+1) + "/" + calDate.getDate() + "/" + calDate.getFullYear());
			//});
		}
		if(calDate.getFullYear() > 2012) {
			viz.getWorkbook().getActiveSheet().applyFilterAsync("Row ID", filterArray, "ADD");
			Crafty.scene("gameOver");
		}
		if(nextTableIndex < tablesArray.length) {
			nextTableDate = new Date(tablesArray[nextTableIndex][1]);
			var datePlus4 = new Date(calDate.toGMTString());
			datePlus4.setDate(datePlus4.getDate() + 4);
			if(Crafty.frame() % 30 === 0 && nextTableDate.getDate() <= datePlus4.getDate()) {
				var table = Crafty.e("2D, DOM, Gravity, Collision, Sprite, Table");
				table.attr({x:Crafty.math.randomInt(0,GAME_WIDTH-TABLE_WIDTH),y:0,w:TABLE_WIDTH,h:TABLE_HEIGHT})
					.gravity('Floor').gravityConst(TABLE_GRAVITY)
					.table(tablesArray[nextTableIndex][2],tablesArray[nextTableIndex][0]);
				if(table.getVal() > 0) {
					table.addComponent("Tablepic");
				} else {
					table.addComponent("TablepicRed");
				}
				nextTableIndex++;
			}
		}
		rand2 = Crafty.math.randomInt(1,BOMB_SCARCITY);
		if(rand2 === 135 && !bombed) {
			Crafty.e("DOM, 2D, Sprite, Collision, Bomb, Bombpic")
			.attr({x:GAME_WIDTH, y:GAME_HEIGHT-70, w:BOMB_WIDTH, h:BOMB_HEIGHT});
		}
	});		
	
}


starter = function() {
	hero = Crafty(Crafty("DoubleJump")[0]);
	hero.setMoveSpeed(HORIZONTAL_SPEED);
	hero.gravityConst(PLAYER_GRAVITY);
	hero.setJumpSpeed(JUMP_SPEED);
	_buttonCreated = false;
	if(showViz) {
		viz.getWorkbook().revertAllAsync();
		viz.getWorkbook().activateSheetAsync(0);
		//viz.getWorkbook().getPublishedSheets()[0].activateAsync();
	}
	
	Crafty.e("DOM, 2D, Text")
		.attr({x: 60, y:20, w: GAME_WIDTH-130, h: 300})
		.text("Tables in the East:\n The Game: The Beta")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white", "font-size": "35px"})
		.css({"text-shadow": "5px 5px 5px black"});
	
	Crafty.e("DOM, 2D, Text")
		.attr({x: 30, y:120, w: GAME_WIDTH-60, h: 300})
		.text("We've lost so much money on Tables in the East! It's the beginning of Q4 and you have until EOY to make Tables in the East profitable by collecting as many profitable Table POs as possible Did you know? Data Rockstars can double-jump and wall-jump. Give it a try!")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white"})
		.css({"text-shadow": "5px 5px 5px black"});
		
	Crafty.e("DOM, 2D, Text")
		.attr({x: 30, y:240, w: GAME_WIDTH-60, h: 300})
		.text("Created by Michael Kovner, Product Consultant.")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white"})
		.css({"text-shadow": "5px 5px 5px black"});
	
	Crafty.e("2D").bind("EnterFrame", function() {
		if(!hero._falling && !_buttonCreated) {
			_buttonCreated = true;
			var buttonBackground = Crafty.e("DOM, 2D, Color, Collision, Solid, StartButton")
				.attr({x: (GAME_WIDTH - 125)/2, y:GAME_HEIGHT - 225, w: 125, h: 75,z:1})
				.color("orange")
				.css({'border': 'rounded'})
				.onHit("DoubleJump", function() {
					Crafty.scene("main");
				})
				;
			/*
			Crafty.e("Button, DOM, 2D, Text")
					.attr({ x: 200, y: GAME_HEIGHT - 195, w: 150, h: 25, z:2, points: 0 })
					.text("Jump here to start")
					.css({'textAlign': 'center', 'fontSize': 20, 'font-family': 'helvetica'})
					.css({'font-weight': 'bold', "text-shadow": "1px 1px 5px white", "color": "blue"});
			*/
		}
	});
	
	Crafty.e("DOM, 2D, Text")
		.attr({x: 30, y:300, w: GAME_WIDTH-60, h: 300})
		.text("Left and Right Arrows to Move. Space or Up Arrow to Jump.")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white"})
		.css({"text-shadow": "5px 5px 5px black"});
	Crafty.e("DOM, 2D, Text")
		.attr({x: 30, y:321, w: GAME_WIDTH-60, h: 300})
		.text("If the controls do not work, click anywhere outside the viz.")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white"})
		.css({"text-shadow": "5px 5px 5px black"});
	
}
gameOver = function() {
	if(showViz) {
		viz.getWorkbook().activateSheetAsync(1);
		//viz.getWorkbook().getPublishedSheets()[1].activateAsync();
	}
	hero = Crafty(Crafty("DoubleJump")[0]);
	hero.setMoveSpeed(HORIZONTAL_SPEED);
	hero.gravityConst(PLAYER_GRAVITY);
	hero.setJumpSpeed(JUMP_SPEED);
	_buttonCreated = false;
	
	Crafty.e("DOM, 2D, Text")
		.attr({x: 60, y:160, w: GAME_WIDTH-130, h: 300})
		.text("Game Over")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white", "font-size": "35px"})
		.css({"text-shadow": "5px 5px 5px black"});
	
	Crafty.e("DOM, 2D, Text")
		.attr({x: 30, y:240, w: GAME_WIDTH-60, h: 300})
		.text("Jump into the boxes below to view your stats.")
		.css({"text-align": "center", "font-family": "helvetica", "font-weight": "bold", "color": "white"})
		.css({"text-shadow": "5px 5px 5px black"});
	Crafty.e("2D").bind("EnterFrame", function() {
		if(!hero._falling && !_buttonCreated) {
			var buttonBackground = Crafty.e("DOM, 2D, Color, Collision, Solid, SmallMultsButton")
				.attr({x: 65, y:GAME_HEIGHT - 235, w: 100, h: 60,z:1})
				.color("orange")
				.css({'border': 'rounded'})
				.onHit("DoubleJump", function() {
					if(showViz) {
						viz.getWorkbook().activateSheetAsync(0);
						//viz.getWorkbook().getPublishedSheets()[0].activateAsync();
					}
				})
				;
		}
	});
	Crafty.e("2D").bind("EnterFrame", function() {
		if(!hero._falling && !_buttonCreated) {
			var buttonBackground = Crafty.e("DOM, 2D, Color, Collision, Solid, RegionButton")
				.attr({x: 190, y:GAME_HEIGHT - 235, w: 100, h: 60,z:1})
				.color("orange")
				.css({'border': 'rounded'})
				.onHit("DoubleJump", function() {
					if(showViz) {
						viz.getWorkbook().activateSheetAsync(2);
						//viz.getWorkbook().getPublishedSheets()[2].activateAsync();
					}
				})
				;
		}
	});
	Crafty.e("2D").bind("EnterFrame", function() {
		if(!hero._falling && !_buttonCreated) {
			var buttonBackground = Crafty.e("DOM, 2D, Color, Collision, Solid, LineChartButton")
				.attr({x: 315, y:GAME_HEIGHT - 235, w: 100, h: 60,z:1})
				.color("orange")
				.css({'border': 'rounded'})
				.onHit("DoubleJump", function() {
					if(showViz) {
						viz.getWorkbook().activateSheetAsync(1);
						//viz.getWorkbook().getPublishedSheets()[1].activateAsync();
					}
				})
				;
		}
	});
	Crafty.e("2D").bind("EnterFrame", function() {
		if(!hero._falling && !_buttonCreated) {
			_buttonCreated = true;
			var buttonBackground = Crafty.e("DOM, 2D, Color, Collision, Solid, RestartButton")
				.attr({x: 440, y:GAME_HEIGHT - 235, w: 100, h: 60,z:1})
				.color("orange")
				.css({'border': 'rounded'})
				.onHit("DoubleJump", function() {
					if(showViz) {
						viz.getWorkbook().revertAllAsync();
					}
					Crafty.scene("starter");
				})
				;
		}
	});
}

createComponents = function() {
	Crafty.c('DoubleJump', {
		//jumpSpeed: JUMP_SPEED,
		_up: false,
		_numJump: 0,
		_xspeed: 0,
		_jumpSpeed: JUMP_SPEED,
		_canCollect: true,
		_moveSpeed: HORIZONTAL_SPEED,
		
		getCanCollect: function() {
			return this._canCollect;
		},
		
		setCanCollect: function(val) {
			this._canCollect = val;
		},
		
		setMoveSpeed: function(newSpeed) {
			this._moveSpeed = newSpeed;
			if(this._falling && this._xspeed != 0) {
				this._xspeed = newSpeed;
			}
		},
		
		setGravity: function(newGrav) {
			this._gravity = newGrav;
		},
		setJumpSpeed: function(newSpeed) {
			this._jumpSpeed = newSpeed;
		},
		
		init: function() {
			
			_gravity = PLAYER_GRAVITY;
			this.bind("KeyDown", function() {
				if((this._numJump < MAX_JUMPS || this._isWallJump()) 
					&& (this.isDown('SPACE') || this.isDown('UP_ARROW'))) {
					this._up=true; //inherited from gravity set up to true. It is reset to false by gravity
					if(this._isWallJump()) {
						this._numJump = 1;
					} else {
						this._numJump++;
					}
					if(this.isDown('LEFT_ARROW')) {
						this._xspeed = -(this._moveSpeed);
					}
					if(this.isDown('RIGHT_ARROW')) {
						this._xspeed = this._moveSpeed;
					}
					this._gy = 0; //part of Gravity component, reset it
				}
			});
			
			this.bind("EnterFrame", function() {
				if (this._up) {
					this.y -= this._jumpSpeed;
					this.x += this._xspeed;
					this._falling = true; //resets to false by gravity
				}
				if(!this._falling) {
					this._xspeed = 0;
					this._numJump = 0;
				}
				if(this.isDown('LEFT_ARROW') && !this._falling) {
					this.x -= this._moveSpeed;
				} else if(this.isDown('RIGHT_ARROW') && !this._falling) {
					this.x += this._moveSpeed;
				}
				if(this._x <= 0) {
					this.x = 1;
				} else if(this._x >= GAME_WIDTH - PLAYER_WIDTH + 5) {
					this.x = GAME_WIDTH - PLAYER_WIDTH + 4;
				}
			});
			
			this.onHit("Solid", function () {
				this._up=false;
			});
			
			return this;
		},
		
		
		_isWallJump: function () {
			if(!this._falling) {
				return false;
			}
			if(this._x < 3) {
				return this.isDown('RIGHT_ARROW');
			} else if(this._x > GAME_WIDTH - PLAYER_WIDTH + 2) {
				return this.isDown('LEFT_ARROW');
			} else {
				return false;
			}
		}
		
				
			
			//return
				//(this._x < 3 || this._x > GAME_WIDTH - PLAYER_WIDTH + 2);
	});
	
	Crafty.c('TheHero', {
		//.animate("hero_front",0,0,3).animate('hero_front',80,-1)
		
		init: function() {
			this.animate("hero_front",0,0,0);
			this.animate("hero_left",0,1,3);
			this.animate("hero_right",0,2,3);
			this.animate("jump_left",1,1,0);
			this.animate("jump_right",1,2,0);
			
			var animationSpeed;
		
			this.bind("EnterFrame", function() {
				if(this._falling) {
					if(this._xspeed < 0) {
						this.stop();
						this.animate("jump_left", WALK_SPEED,-1);
					} else if(this._xspeed > 0) {
						this.stop();
						this.animate("jump_right", WALK_SPEED,-1);
					} else {
						this.stop();
						this.animate("hero_front");
					}
				} else if(this.isDown('LEFT_ARROW') || this._xspeed < 0) {
					this.animate("hero_left",WALK_SPEED,-1);
				} else if(this.isDown('RIGHT_ARROW') || this._xspeed > 0) {
					this.animate("hero_right",WALK_SPEED,-1);
				} else {
					this.animate("hero_front",WALK_SPEED,-1);
				}
			});
		}
	});
	
	Crafty.c('Table', {
		_gravity: TABLE_GRAVITY,
		
		setGravity: function(newGrav) {
			this._gravity = newGrav;
		},
		
		getVal: function() {
			return this._value;
		},
		
		getRowID: function() {
			return this._rowID;
		},
	
		table: function(value, rowID) {
			this._hasBeenColected = false;
			this._value = value;
			this._rowID = rowID;
			//var tableVal = Crafty.e("DOM, 2D, Color")
			//	.color(TABLE_COLOR);
			
				//.text("1 Points").color(TABLE_COLOR);
			//this.attach(tableVal);
			//tableVal.x += TABLE_WIDTH*(1/3);
			//tableVal.y += TABLE_HEIGHT*(1/3);
			//tableVal._h -= 55;
			//tableVal._w -= 80;
			var tableValTxt = Crafty.e("DOM, 2D, Text")
				.text("$" + this._value);
				
			if(this._value < 0) {
				tableValTxt.textColor('#FF0000')
				.text("$(" + this._value + ")");
			}
				
			tableValTxt.x=this._x + 15;
			tableValTxt.y=this._y - 20;
			this.attach(tableValTxt);
			
			this.bind("EnterFrame", function() {
				if(!this._falling) {
					this.timeout(function() {
                    this.destroy();
                }, 100);
				}
			});
			this.onHit("DoubleJump", function() {
				if(!this.hit("DoubleJump")[0]["obj"].getCanCollect()) {
					return;
				}
				this.antigravity();
				if(!this._hasBeenCollected) {
					scoreToAdd = this._value;
					Crafty("Scoreboard").each(function () {
						this.points += scoreToAdd;
						if(this.points < 0) {
							this.text("$(" + this.points + ")");
							this.textColor('#FF0000');
						} else {
							this.text("$" + this.points); 
							this.textColor("#000000");
						}
					});
					if(showViz) {
						if(!bombed && viz.getWorkbook().getActiveSheet().getIndex() != 1) {
							viz.getWorkbook().activateSheetAsync(1);
							//viz.getWorkbook().getPublishedSheets()[1].activateAsync();
						}
						//viz.getWorkbook().getActiveSheet().applyFilterAsync("Row ID", this._rowID, "ADD");
						filterArray.push(this._rowID);
						filterCounter++;
						if(filterCounter == 5) {
							viz.getWorkbook().getActiveSheet().applyFilterAsync("Row ID", filterArray, "ADD");
							filterArray = [];
							filterCounter = 1;
						}
					}
					this._hasBeenCollected = true;
				}
				this.timeout(function() {
					this.destroy();
				}, 200);
				
			});
		}
	});

	
	Crafty.c("Bomb", {
		init: function() {
			//this.x = GAME_WIDTH;
			//this.y = 10;
			this.xspeed = BOMB_SPEED;
			//this.text = "Q";
			this.bind("EnterFrame", function() {
				this.x -= BOMB_SPEED;
			});
			this.onHit("DoubleJump", function() {
				var hero = this.hit("DoubleJump")[0]["obj"];
				hero.setMoveSpeed(HORIZONTAL_SPEED_SLOW);
				hero.gravityConst(PLAYER_GRAVITY_SLOW);
				hero.setJumpSpeed(JUMP_SPEED_SLOW);
				bombed = true;
				Crafty("Bomb").each( function () {
					this.destroy();
				});
				//viz.getWorkbook().getPublishedSheets()[3].activateAsync(); Switching to the "Other guys" viz is buggy
				//tableGrav = TABLE_GRAVITY_SLOW;
				/*Crafty("Table").each(function () {
					this._gy = 0;
					this.gravityConst(TABLE_GRAVITY_SLOW);
				});*/
				hero.timeout(function() {
					hero.setMoveSpeed(HORIZONTAL_SPEED);
					hero.gravityConst(PLAYER_GRAVITY);
					hero.setJumpSpeed(JUMP_SPEED);
					bombed = false;
					//viz.getWorkbook().getPublishedSheets()[1].activateAsync();
					//tableGrav = TABLE_GRAVITY;
					/*Crafty("Table").each(function () {
						this.gravityConst(TABLE_GRAVITY);
					});*/
				}, BOMB_DURATION);
				this.timeout(function() {
					this.destroy();
				}, 50);
			});
			return this;
		}
	});
}
				
			