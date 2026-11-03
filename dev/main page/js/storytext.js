  //message, x/y position, how long message stays until it disappears, reverse fade out?, custom fade in function
  function createStoryCharacters(message, x, y, divID, fadeInFunction)
  {
      var newMessage = "";

      for(var i=0;i<message.length;i++)
      {
          if(message[i] == " ")
          {
              newMessage += "  ";
          } else {
              newMessage += message[i];
          }
      }

      message = newMessage;

      var storyTextArray = new Array();
      var storyTextDiv = document.getElementById(divID);

      storyTextDiv.style.left = x + "px";
      storyTextDiv.style.top = y + "px";

      for(var i=0;i<message.length;i++)
      {
          var messageDiv = document.createElement("span");
              messageDiv.innerHTML = message[i];
              messageDiv.style.marginRight = "3px";
              messageDiv.style.display = "inline-block";

          storyTextArray.push(messageDiv);
          storyTextDiv.appendChild(messageDiv);

          fadeInFunction(messageDiv, i);
      }
  }

  function createStoryCharactersRandom(message, x, y, divID, fadeInFunction)
  {
      var newMessage = "";

      for(var i=0;i<message.length;i++)
      {
          if(message[i] == " ")
          {
              newMessage += "  ";
          } else {
              newMessage += message[i];
          }
      }

      message = newMessage;

      var storyTextArray = new Array();
      var storyTextDiv = document.getElementById(divID);

      storyTextDiv.style.left = x + "px";
      storyTextDiv.style.top = y + "px";

      for(var i=0;i<message.length;i++)
      {
          var messageDiv = document.createElement("span");
              messageDiv.innerHTML = message[i];
              messageDiv.style.marginRight = "3px";
              messageDiv.style.display = "inline-block";

          storyTextArray.push(messageDiv);
          storyTextDiv.appendChild(messageDiv);
      }

      storyTextArray = randomizeArray(storyTextArray);

      for(var i=0;i<storyTextArray.length;i++)
      {
          fadeInFunction(storyTextArray[i], i);
      }
  }

  //message, x/y position, how long message stays until it disappears, reverse fade out?, custom fade in function
  function createStoryWords(message, x, y, divID, fadeInFunction)
  {
      var wordArray = message.split(" ");
      var storyTextArray = new Array(); //divide the sentence by words
      var storyTextDiv = document.getElementById(divID);

      storyTextDiv.style.left = x + "px";
      storyTextDiv.style.top = y + "px";

      for(var i=0;i<wordArray.length;i++)
      {
          var messageDiv = document.createElement("span");
              messageDiv.innerHTML = wordArray[i];
              messageDiv.style.marginRight = "6px";
              messageDiv.style.display = "inline-block";

          storyTextArray.push(messageDiv);
          storyTextDiv.appendChild(messageDiv);

          fadeInFunction(messageDiv, i);
      }
  }

  //message, x/y position, how long message stays until it disappears, reverse fade out?, custom fade in function
  function createStoryWordsRandom(message, x, y, divID, fadeInFunction)
  {
      var wordArray = message.split(" ");
      var storyTextArray = new Array(); //divide the sentence by words
      var storyTextDiv = document.getElementById(divID);

      storyTextDiv.style.left = x + "px";
      storyTextDiv.style.top = y + "px";

      for(var i=0;i<wordArray.length;i++)
      {
          var messageDiv = document.createElement("span");
              messageDiv.innerHTML = wordArray[i];
              messageDiv.style.marginRight = "6px";
              messageDiv.style.display = "inline-block";

          storyTextArray.push(messageDiv);
          storyTextDiv.appendChild(messageDiv);
      }

      storyTextArray = randomizeArray(storyTextArray);

      for(var i=0;i<storyTextArray.length;i++)
      {
          fadeInFunction(storyTextArray[i], i);
      }

  }

  //instantly clear out story text without fade out animation
  function instantFadeOutStoryText(divID)
  {
      var storyTextDiv = document.getElementById(divID);

      while(storyTextDiv.children.length > 0)
      {
          storyTextDiv.children[0].remove();
      }
  }

  //this will fade out all story span tags in case there are multiple different text animations sharing the same line
  function fadeOutAllStoryText(divID, reverse=false)
  {
      var storyTextDiv = document.getElementById(divID);
      var storyTextArray = new Array();

      for(var i=0;i<storyTextDiv.children.length;i++)
      {
          storyTextArray.push(storyTextDiv.children[i]);
      }

      if(reverse == true)
      {
          storyTextArray.reverse();
      }

      for(let i=0;i<storyTextArray.length;i++)
      {
          gsap.to(storyTextArray[i], {
            duration: .35,
            alpha: 0,
            delay: i / 50,
            onComplete: function(){

                //remove span elements from html body
                if(i == storyTextArray.length - 1)
                {
                    instantFadeOutStoryText(divID);
                }
            }
          })
      }
  }

  //shuffle an array
  function randomizeArray(inputArray)
  {
      for(var i=0;i<inputArray.length;i++)
      {
          var randomPosition = Math.floor(Math.random() * inputArray.length);
          var temp = inputArray[i];
          inputArray[i] = inputArray[randomPosition];
          inputArray[randomPosition] = temp;
      }

      return inputArray;
  }

/*
  createStoryWords("hello world hello world hello world", 100, 100, "storyText", function(messageDiv, i){
      gsap.fromTo(messageDiv,
        {
          y: 5,
          scale: 2,
          alpha: 0,
          filter: "blur(2px)",

        },
        {
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        duration: .35,
        alpha: 1,
        delay: i / 25,
        ease: "Power2.in",
      });
  });

  createStoryCharacters("hello world hello world hello world", 100, 100, "storyText", function(messageDiv, i){
      gsap.fromTo(messageDiv,
        {
          y: 5,
          scale: 2,
          alpha: 0,
          filter: "blur(2px)",

        },
        {
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        duration: .35,
        alpha: 1,
        delay: i / 25,
        ease: "Power2.in",
      });
  });

  createStoryWords("hello world hello world hello world", 250, 250, "storyText2", function(messageDiv, i){
      gsap.fromTo(messageDiv,
        {
          y: i % 2 == 0 ? -Math.round(Math.random() * 25) + 15 : Math.round(Math.random() * 15) + 25,
          alpha: 0,
        },
        {
          y: 0,
        duration: 1,
        alpha: 1,
        delay: i / 7,
        ease: "Power2.in",
      });
  });
*/
  //fadeOutAllStoryText("storyText", false)
  //fadeOutAllStoryText("storyText2", true)
