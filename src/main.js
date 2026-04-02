import {Vector2} from 'hisabati'

const canvas =document.getElementById("canvas");
canvas.height =window.innerHeight;
canvas.width=window.innerWidth;
const ctxt=canvas.getContext('2d');
const keysPressed=[];
const KEY_UP=38;
const KEY_DOWN=40;
window.addEventListener('keydown',function(e){
    keysPressed[e.keyCode]=true;
});
window.addEventListener('keyup',function(e){
    keysPressed[e.keyCode]=false;
});

function paddleCollisionWithEdges(paddle){
    if(paddle.pos.y<=0){
        paddle.pos.set(paddle.pos.x,0);
    }
    if(paddle.pos.y +paddle.height>=canvas.height){
        paddle.pos.set(paddle.pos.x,canvas.height -paddle.height);
    }

}
function paddleCollisionWithBall(ball,paddle){
    const delta = Vector2.subtract(ball.pos,paddle.getCenter());
    let dx=Math.abs(delta.x);
    let dy=Math.abs(delta.y);
    if(dx<=(ball.radius+paddle.getHalfWidth())&&dy<=(paddle.getHalfHeight()+ball.radius)) {
        ball.velocity.set(-ball.velocity.x,ball.velocity.y);
    }   
}

function Ball(pos,velocity,radius){
    this.pos=pos;
    this.velocity=velocity;
    this.radius=radius;
    this.update= function(){
        this.pos.add(this.velocity);

    };
    this.draw=function(){
        ctxt.fillStyle="#33ff00";
        ctxt.strokeStyle ="#33ff00"
        ctxt.beginPath();
        ctxt.arc(this.pos.x,this.pos.y,this.radius,0,Math.PI*2);
        ctxt.fill();
        ctxt.stroke();

    };

}
function player2Ai(ball,paddle){
    if(ball.velocity.x>0){
        if(ball.pos.y>paddle.pos.y){
            paddle.pos.add(paddle.velocity);
            if(paddle.pos.y+paddle.height>=canvas.height){
                paddle.pos.set(paddle.pos.x,canvas.height-paddle.height);
            }
        }
    if(ball.pos.y<paddle.pos.y){
        paddle.pos.subtract(paddle.velocity);
        if(paddle.pos.y<=0){
            paddle.pos.set(paddle.pos.x,0);
        }
    }
    }
}
function respawnBa(ball){
    if(ball.velocity.x>0){
        ball.pos.set(canvas.width-150,(Math.random()*(canvas.height-200))+100);
    }
    if(ball.velocity.x<0){
       ball.pos.set(150,(Math.random()*(canvas.height-200))+100);
    }
    ball.velocity.reverse();

}
function increaseScore(ball, paddle){
    if(ball.pos.x<=-ball.radius){
        paddle2.score+=1;
        document.getElementById("player2").innerHTML=paddle2.score;
        respawnBa(ball);
    }
    if(ball.pos.x>=canvas.width+ball.radius){
        paddle1.score+=1;
        document.getElementById("player1").innerHTML=paddle1.score;
        respawnBa(ball);
    }
}
function drawGameScene(){
    ctxt.strokeStyle="#ffff00";
    ctxt.beginPath();
    ctxt.lineWidth=10;
    ctxt.moveTo(0,0);
    ctxt.lineTo(canvas.width,0);
    ctxt.stroke();
    
    ctxt.beginPath();
    ctxt.lineWidth=10;
    ctxt.moveTo(0,0);
    ctxt.lineTo(0,canvas.height);
    ctxt.stroke();

    ctxt.beginPath();
    ctxt.lineWidth=10;
    ctxt.moveTo(0,canvas.height);
    ctxt.lineTo(canvas.width,canvas.height);
    ctxt.stroke();

    ctxt.beginPath();
    ctxt.lineWidth=10;
    ctxt.moveTo(canvas.width,0);
    ctxt.lineTo(canvas.width,canvas.height);
    ctxt.stroke();
    ctxt.beginPath();
    ctxt.lineWidth=10;
    ctxt.moveTo(canvas.width/2,0);
    ctxt.lineTo(canvas.width/2,canvas.height);
    ctxt.stroke();

    ctxt.beginPath();
    ctxt.arc(canvas.width/2,canvas.height/2,30,0,Math.PI*2);
    ctxt.strokeStyle="#ffff00"
    ctxt.stroke();


}
function ballCollisionOnTheEdges(ball){
    if(ball.pos.y + ball.radius >= canvas.height){
        ball.velocity.set(ball.velocity.x,-ball.velocity.y);
    }
    /*if(ball.pos.x + ball.radius>= canvas.width){
        ball.velocity.x *= -1;
    }
    
    if(ball.pos.x -ball.radius<=0){
        ball.velocity.x *=-1;
    }*/
   if(ball.pos.y - ball.radius<=0){
        ball.velocity.set(ball.velocity.x,-ball.velocity.y);
    }
}
function Paddle(pos,velocity,width,height){
    this.pos=pos;
    this.velocity=velocity;
    this.width=width;
    this.height=height;
    this.score=0;
    this.update= function(){
        if(keysPressed[KEY_UP]){
            this.pos.subtract(this.velocity);
        }
        if(keysPressed[KEY_DOWN]){
            this.pos.add(this.velocity);
        }
    };
    this.draw= function(){
        ctxt.fillStyle="#33ff00";
        ctxt.fillRect(this.pos.x,this.pos.y,this.width,this.height);
    }
    this.getHalfWidth=function(){
        return this.width/2;
    };
    this.getHalfHeight=function(){
        return this.height/2;
    };
    this.getCenter=function(){
        return new Vector2(
            this.pos.x+this.getHalfWidth(),this.pos.y+this.getHalfHeight()
        );

    };


}
const ball= new Ball(new Vector2(200,200),new Vector2(12,12),10);
const paddle1=new Paddle(new Vector2(5,30),new Vector2(0,15),20,150);
const paddle2=new Paddle(new Vector2(canvas.width-20,50),new Vector2(0,14),20,150);
function gameUpdate(){
   ball.update();
   paddle1.update();
   paddleCollisionWithEdges(paddle1);

   ballCollisionOnTheEdges(ball);
   paddleCollisionWithBall(ball,paddle1);
   paddleCollisionWithBall(ball,paddle2);
   player2Ai(ball,paddle2);
   increaseScore(ball,paddle1,paddle2);

}
function gameDraw(){
    ball.draw();
    paddle1.draw();
    paddle2.draw();
    drawGameScene();

}
function gameLoop(){
   // ctxt.clearRect(0,0,canvas.width,canvas.height);
   ctxt.fillStyle="rgba(0,0,0,0.2)";
   ctxt.fillRect(0,0,canvas.width,canvas.height);
    window.requestAnimationFrame(gameLoop);
    
   

    gameUpdate();
    gameDraw();

}
gameLoop();
