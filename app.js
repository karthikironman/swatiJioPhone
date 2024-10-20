angular
  .module("kaiosChatApp", [])
  .controller("ChatController", function ($window, $timeout) {
    var vm = this;

    // Sample JSON data
    vm.items = [
      {
        by: "bot",
        text: "Welcome to Gourmet Bites! Here's our menu.",
        image: "https://thumbs.dreamstime.com/b/restaurant-menu-design-retro-coffee-typography-sign-chalkboard-can-be-used-as-board-bars-brochure-vector-shop-cafe-164531720.jpg",
        description: "Enjoy our chef's specials and handcrafted dishes.",
        actions: [
          { text: "View Specials", link: "https://example.com/specials" },
          { text: "Order Now", link: "https://example.com/order" },
          { text: "See Full Menu", link: "https://example.com/full_menu" },
        ],
      },
      {
        by: "sender",
        text: "Looks great! What are today's specials?",
      },
      {
        by: "bot",
        text: "Today's specials are fresh and ready for you!",
        carousel: true,
        items: [
          {
            text: "Grilled Chicken with Herbs",
            image: "https://png.pngtree.com/png-vector/20240528/ourmid/pngtree-roast-a-chicken-step-by-step-png-image_12531944.png",
            description: "Tender chicken breast marinated in herbs, served with a side of roasted vegetables.",
            actions: [
              { text: "Order Grilled Chicken", link: "https://example.com/grilled_chicken" },
              { text: "More Info", link: "https://example.com/info_grilled_chicken" },
            ],
          },
          {
            text: "Vegetarian Pasta Primavera",
            image: "https://www.yummytummyaarthi.com/wp-content/uploads/2022/11/red-sauce-pasta-1.jpg",
            description: "A delightful mix of fresh vegetables and pasta in a light garlic sauce.",
            actions: [
              { text: "Order Pasta Primavera", link: "https://example.com/primavera" },
              { text: "More Info", link: "https://example.com/info_primavera" },
            ],
          },
          {
            text: "BBQ Ribs",
            image: "https://thecozycook.com/wp-content/uploads/2023/05/Creamy-Chicken-Pasta-f.jpg",
            description: "Slow-cooked ribs with our house BBQ sauce. Served with fries and coleslaw.",
            actions: [
              { text: "Order BBQ Ribs", link: "https://example.com/bbq_ribs" },
              { text: "More Info", link: "https://example.com/info_bbq_ribs" },
            ],
          },
        ],
      },
      {
        by: "sender",
        text: "I'll have the Grilled Chicken, please.",
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Would you like to add a drink or dessert?",
        actions: [
          { text: "Add a Drink", link: "https://example.com/drinks" },
          { text: "Add a Dessert", link: "https://example.com/desserts" },
        ],
      },
      {
        by: "sender",
        text: "What desserts do you have?",
      },
      {
        by: "bot",
        text: "Here's a selection of our desserts!",
        carousel: true,
        items: [
          {
            text: "Chocolate Lava Cake",
            image: "https://5.imimg.com/data5/OZ/XE/ZF/SELLER-31224178/100-gm-choco-lava-cake-500x500.jpg",
            description: "A rich, warm chocolate cake with a molten center.",
            actions: [
              { text: "Order Lava Cake", link: "https://example.com/lava_cake" },
            ],
          },
          {
            text: "Cheesecake",
            image: "https://cakesbymk.com/wp-content/uploads/2023/11/Template-Size-for-Blog-Photos-24.jpg",
            description: "Creamy New York-style cheesecake with a graham cracker crust.",
            actions: [
              { text: "Order Cheesecake", link: "https://example.com/cheesecake" },
            ],
          },
          {
            text: "Tiramisu",
            image: "https://handletheheat.com/wp-content/uploads/2015/11/oreo-cheesecake-recipe-SQUARE.jpg",
            description: "Layers of mascarpone cheese, espresso-soaked ladyfingers, and cocoa.",
            actions: [
              { text: "Order Tiramisu", link: "https://example.com/tiramisu" },
            ],
          },
        ],
      },
      {
        by: "sender",
        text: "I'll take the Tiramisu as well!",
      },
      {
        by: "bot",
        text: "Tiramisu added to your order. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
          { text: "Place Full Order", link: "https://example.com/checkout" },
        ],
      },
      {
        by: "sender",
        text: "No, that's all for now.",
      },
      {
        by: "bot",
        text: "Great! Your order will be ready in 30 minutes. Thank you for choosing Gourmet Bites!",
      },
    ];
    

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
        console.log(this.messageObj);
        console.log("-------------")
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

   vm.itemObjects = vm.items.map((msg, index) => new Item(msg, index));
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
