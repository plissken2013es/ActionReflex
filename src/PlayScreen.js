define(
  [
    "src/me",
    "src/config",
    "src/global",
    "src/PlayScreenBorder",
    "src/PlayerEntity"
  ],
  function (
    me,
    config,
    global,
    PlayScreenBorder,
    PlayerEntity
  ) {
      
  var PlayScreen = me.ScreenObject.extend({
    onResetEvent: function () {
      me.game.viewport = new me.Viewport(0, 0, 512, 288);
      me.levelDirector.loadLevel("scr001");

      me.game.addHUD(0, 0, config.display.width, config.display.height);
      me.game.HUD.addItem("border", new PlayScreenBorder(0, 0));
      
      this.createBall();
    },
    onDestroyEvent: function () {
      me.game.disableHUD();
    },
    createBall: function (oldBall) {
      if (oldBall) {
        var x = 448;
        if (oldBall.right >= 480) {
          x = 32;
        }
        var ball = new PlayerEntity(x, oldBall.pos.y + 15);
        ball.vel = oldBall.vel;
        ball.maxVel = oldBall.maxVel;
        ball.jumping = oldBall.jumping;
        ball.falling = oldBall.falling;
        me.game.add(ball, 1);
        me.game.sort();
      }
      else {
        var tube = me.game.getEntityByName("tube")[0];
        var ball = new PlayerEntity(tube.pos.x, tube.pos.y + 10);
        var BALL_DESTINATION_Y = 192;
        me.game.add(ball, tube.z);
        me.game.sort();

        if (config.ballAppearThroughTubeAnimation && global.ballState == "normal") {
          global.ballState = "appearThroughTube";

          var tubeInitialY = tube.pos.y;
          var tubeMoveDown = new me.Tween(tube.pos).to({y: 79 }, 1200).delay(1000);
          var ballMoveDown = new me.Tween(ball.pos).to({y: BALL_DESTINATION_Y }, 1200);
          var tubeMoveUp = new me.Tween(tube.pos)
            .to({y: tubeInitialY }, 1200)
            .onComplete(function () {
              global.ballState = "normal";
            });

          tubeMoveDown.chain(ballMoveDown);
          ballMoveDown.chain(tubeMoveUp);
          tubeMoveDown.start();
        }
        else {
          ball.pos.y = BALL_DESTINATION_Y;
        }
      }
    },
  });

  return PlayScreen;
});