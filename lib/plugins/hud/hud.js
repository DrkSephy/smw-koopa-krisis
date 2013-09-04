/*
hud.js
------
    This file contains the code for controlling the player
    health HUD. The technique used is "injection", which is
    an extension of the original code. The way it works is 
    by creating a new instance of original code and supply it
    with a new name. Simply put, injection is a copy of the 
    original but different in the sense of the extra code we 
    add. While injecting, we modify the original code. In 
    the case of this plugin, we overwrite the draw() function
    of our game. The this.parent() function will point to our
    old draw() function, so everything there is kept. All we
    check for in the new isntance is the presence of a player
    entity, and if true then a HUD is drawn. 

    The health HUD consists of two parts: A number and Health bar.

    Number: A function which handles drawing a black, slightly transparent
    rectangle where the health will be visible. Uses the following
    canvas properties to draw the HUD to screen:
        | fillstyle: This property sets the color
        | font: This property sets the font
        | setAlpha(): This property sets the transparency. 
            | setalpha = 1: Fully Solid
            | setAlpha = 0: Fully transparent
        | fillRect(): This property draws a rectangle to the screen
          given a given position with a given width + height
        | fillText(): This property draws text on screen at a given positon.

    Bar: A function which draws two rectangles on top of each other. Uses
    the same canvas properties above to draw. 

*/

ig.module(
    'plugins.hud.hud'
)
.defines(function(){
    ig.hud = ig.Class.extend({ 
        // Get the canvas
        canvas  : document.getElementById('canvas'), 
        // Check if the canvas is being viewed
        context : canvas.getContext('2d'),           

        maxHealth  : null,     
        init: function(){
            ig.Game.inject({
                draw: function(){
                    this.parent();
                    // If there is a player. draw the HUD
                    if(ig.game.getEntitiesByType('EntityPlayer').length  != 0){
                        if (this.hud){
                            this.hud.number();
                            this.hud.bar();
                        } 
                    }
                }
            })
        },
            number: function(){     
                if(!this.context) return null;
                // Get the player instance
                var player  = ig.game.getEntitiesByType('EntityPlayer')[0];
                // Draw a transparent Black Rectangle
                var context  = this.canvas.getContext('2d');
                // Set visual properties of the HUD
                context.fillStyle = "rgb(0,0,0)";
                context.setAlpha = 0.7; //set transparency       
                context.fillRect (10,10,100,30);
                //draw text on top of the rectangle    
                context.fillStyle = "rgb(255,255,255)";
                context.font = "15px Arial";   
                context.fillText ('Health: ' + player.health,20,30); //font used is the default canvas font
                context.setAlpha = 1;
                return null;
            },

            bar: function(){    
                if(!this.context) return null;
                // Get the player instance
                var player  = ig.game.getEntitiesByType('EntityPlayer')[0];
                // Draw a transparent Black Rectangle
                var h = 100*Math.min(player.health / this.maxHealth,100);
                var context  = this.canvas.getContext('2d');
                // Set visual properties of the HUD
                context.fillStyle = "rgb(0,0,0)";
                context.setAlpha = 0.7;    
                context.fillRect (10,50,100,10);
                // Determine what color of health to draw, Blue for healthy, Red for near death
                var color = h < 30 ? "rgb(150,0,0)" : "rgb(0,0,150)";
                context.fillStyle = color;
                context.setAlpha = 0.9;     
                context.fillRect (10,50,h,10);
                context.setAlpha = 1;
                return null;
        },
            setMaxHealth: function(health){
                // Set the max health from the player
                this.maxHealth = health;
        }
    }); 
})
