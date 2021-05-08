
function initial() {
    $(document).on("click", ".newgame", function() {
      $("#gameb").replaceWith( `<div class = "game">
      <div id = "score">Score: 0</div>
      <div id = "dino"></div>
      <div id = "cactus"></div>
      </div>`);
      work();
    });
  }
  initial();
  
  function work(){
    const dino = document.getElementById("dino");
    const cactus = document.getElementById("cactus");
    let score = 0;
    function jump() {
      if(dino.classList != "jump") {
        dino.classList.add("jump");
        setTimeout(function() {
          dino.classList.remove("jump");
        },450);
        score += 5;
        $("#score").html('Score: ' + score);
      }
    }
    document.addEventListener("keydown", function (event){
      jump();
    });
    let isAlive = setInterval(function(event){
      let dinoTop  = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
      let cactusLeft  = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));
  
      if(cactusLeft < 50 && cactusLeft > 0 && dinoTop >=140) {
        alert("game over! Your score is " + score);
        score  = 0;
        location.reload();
      }
    }, 10);
  }