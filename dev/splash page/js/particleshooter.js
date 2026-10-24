  var shootingParticleEmitter = document.getElementById("particleEmitter");
  var particleAngleCounter = 0;
  var emitDelayer;

  //move the particle emitter across the screen
  function startParticleEmitter(startX, startY, endX, endY)
  {
      shootingParticleEmitter.style.left = startX + "px";
      shootingParticleEmitter.style.top = startY + "px";
      shootingParticleEmitter.style.opacity = 0.25;

      gsap.to(shootingParticleEmitter,{
        duration: 4,
        left: endX + "px",
        top: endY + "px",
        ease: "power2.inOut",
      });

      startContinousEmit();
  }

  //emit the actual particles
  function emitParticles()
  {
      //create new particle and tween it
      var newParticleDiv = document.createElement("div");
          newParticleDiv.style.left = shootingParticleEmitter.style.left;
          newParticleDiv.style.top = shootingParticleEmitter.style.top;
          newParticleDiv.style.position = "absolute";
          newParticleDiv.style.width = "5px";
          newParticleDiv.style.height = "5px";
          newParticleDiv.style.borderRadius = "50px";
          newParticleDiv.style.backgroundColor = "white";
          newParticleDiv.style.opacity = 0.75;

      document.getElementById("particleShooters").appendChild(newParticleDiv);

      gsap.to(newParticleDiv, {
          filter: "blur(2px)",
          x: Math.round(Math.cos((particleAngleCounter * Math.PI/180) - 90) * Math.round(Math.random() * 650)),
          y: Math.round(Math.sin((particleAngleCounter * Math.PI/180) - 90) * Math.round(Math.random() * 650)),
          duration: Math.round(Math.random() * 2) + .25,
          opacity: 0,
          ease: "power1.out",
          onComplete: function(){
              document.getElementById("particleShooters").removeChild(newParticleDiv);
          }
      });

      particleAngleCounter += 6.25;
  }

  //begin emitting particles trigger
  function startContinousEmit()
  {
      emitDelayer = setInterval(function(){

          emitParticles();

      }, 25);
  }

  //stop emitting particles trigger
  function stopContinuousEmit()
  {
      clearInterval(emitDelayer);

      gsap.to(shootingParticleEmitter,{
        duration: .5,
        opacity: 0,
      });
  }
