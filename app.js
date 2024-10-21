angular
  .module("kaiosChatApp", [])
  .controller("ChatController", function ($window, $timeout, $http) {
    var vm = this;

    vm.focusIndex = 0; // The message to focus when the chat is loaded

    class Item {
      constructor(data){
        console.log(data)
        if(data.items){
          //carousel item
          this.items = data.items;
        }else{
          // pushing the items into array
          this.items = [data];
        }
        this.fromMe = data.by === 'sender'; //true if the user owns the message, else false
        this.messageObj = this.items.map((x,index)=> new Message(x,index));
        this.carouselIndex = 0; //focus the first slide first
      }
      resetIndex(){
        this.carouselIndex = 0;
      }
      isCarouselItem(){
        return this.messageObj.length > 1;
      }
      showLeftArrow(){
        return this.isCarouselItem() && (this.carouselIndex > 0);
      }
      showRightArrow(){
        return this.isCarouselItem() && (this.carouselIndex < this.messageObj.length - 1) ;
      }
      handleArrowLeft(){
        if(this.isCarouselItem()) {
          this.messageObj[this.carouselIndex].resetActionIndex();
          if(this.showLeftArrow()){
            this.carouselIndex--;
          }
        }
      }
      handleArrowRight(){
        if(this.isCarouselItem()) {
          this.messageObj[this.carouselIndex].resetActionIndex();
          if(this.showRightArrow()){
            this.carouselIndex++;
          }
        }
      }
      handleArrowDown(){
      this.messageObj[this.carouselIndex].handleArrowDown();
      }
      handleArrowUp(){
        this.messageObj[this.carouselIndex].handleArrowUp();
      }
      handleEnter(event){
        this.messageObj[this.carouselIndex].handleEnter(event);
      }
    }
     // Message class for handling individual message interactions
     class Message {
      constructor(data, index) {
        this.text = data.text;
        this.description = data.description;
        this.image = data.image;
        this.actions = data.actions || [];
        this.actionFocusIndex = -1;
        this.index = index; // Track the message index
      }

      handleArrowDown() {
        // If the message has no actions, focus the next message
        if (this.actions.length === 0) {
          vm.handleNextMessage();
        } else {
          // If there are actions, move the action focus
          this.actionFocusIndex++;
          if (this.actionFocusIndex >= this.actions.length) {
            // If we've reached the end of actions, move to the next message
            this.resetActionIndex();
            vm.handleNextMessage();
          }
        }
      }

      handleArrowUp() {
        // Move the focus up between messages or actions
        if (this.actionFocusIndex > 0) {
          this.actionFocusIndex--;
        } else {
          this.resetActionIndex();
          vm.handlePreviousMessage();
        }
      }
 
      handleEnter(){
        // handle enter here
        if(this.actionFocusIndex >= 0){
          console.log(this.actions[this.actionFocusIndex])
        }
      }

      isActionFocused(actionIndex){
          return actionIndex == this.actionFocusIndex;
         
        // return false; //when the message is not focused, even when the index is 0, the message is not focused
      }
      resetActionIndex(){
        this.actionFocusIndex = -1;
      }
    }

  

    $http.get('chatData.json')
    .then(function(response) {
      vm.items = response.data;
      vm.itemObjects = vm.items.map((msg, index) => new Item(msg, index));
    })
    .catch(function(error) {
      console.error('Error loading chat data:', error);
    });

  //  vm.itemObjects = vm.items.map((msg, index) => new Item(msg, index));
   console.log(vm.itemObjects)
    // Handle moving to the next message
    vm.handleNextMessage = () => {
      vm.focusIndex++;
      if (vm.focusIndex >= vm.itemObjects.length) {
        vm.focusIndex = 0; // Loop back to the first message
      }
    };

    // Handle moving to the previous message
    vm.handlePreviousMessage = () => {
      vm.focusIndex--;
      if (vm.focusIndex < 0) {
        vm.focusIndex = vm.itemObjects.length - 1; // Loop back to the last message
      }
    };

    vm.handleClick = function (index) {
         vm.focusIndex = index;
    }
    // Keydown handler for navigating between messages and actions
    vm.handleKeyDown = function (event) {
   
      const currentMessageObj = vm.itemObjects[vm.focusIndex];

      if (event.key === "ArrowDown") {
        currentMessageObj.handleArrowDown();
      } else if (event.key === "ArrowUp") {
        currentMessageObj.handleArrowUp();
      }else if (event.key === "ArrowLeft") {
        currentMessageObj.handleArrowLeft();
      }else if (event.key === "ArrowRight") {
        currentMessageObj.handleArrowRight();
      } 
      else if (event.key === "Enter") {
        currentMessageObj.handleEnter(event);
      }

      // Focus the corresponding message and action button
      focusMessage(vm.focusIndex);
      focusActionButton(vm.focusIndex, currentMessageObj.actionFocusIndex);

    };

    function focusMessage(index) {
      $timeout(() => {
        const messages = document.querySelectorAll('.message');
        if (messages[index]) {
          messages[index].focus();
        }
      });
    }

    // Function to focus on an action button
    function focusActionButton(messageIndex, actionIndex) {
      $timeout(() => {
        const buttons = document.querySelectorAll(`.message:nth-child(${messageIndex + 1}) .action-button`);
        if (buttons[actionIndex]) {
          buttons[actionIndex].focus();
        }
      });
    }

    // Open the link in a new tab
    vm.openLink = function (link) {
      $window.open(link, "_blank");
    };

    // Initialize focus
    vm.focusIndex = 0;
  });
