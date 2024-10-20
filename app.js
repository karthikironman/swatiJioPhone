angular
  .module("kaiosChatApp", [])
  .controller("ChatController", function ($window, $timeout) {
    var vm = this;

    // Sample JSON data
    vm.messages = [
      {
        by: "bot",
        text: "Welcome to our restaurant! Here's our menu.",
        image: "https://thumbs.dreamstime.com/b/restaurant-menu-design-retro-coffee-typography-sign-chalkboard-can-be-used-as-board-bars-brochure-vector-shop-cafe-164531720.jpg",
        description: "Enjoy our best dishes.",
        actions: [
          { text: "View Specials", link: "https://example.com/specials" },
          { text: "Order Now", link: "https://example.com/order" },
          { text: "3", link: "https://example.com/order" },
        ],
      },
      {
        by: "sender",
        text: "Looks delicious! What are today's specials?",
      },
      {
        by: "bot",
        text: "Welcome to our restaurant! Here's our menu.",
        image: "https://thumbs.dreamstime.com/b/restaurant-menu-design-retro-coffee-typography-sign-chalkboard-can-be-used-as-board-bars-brochure-vector-shop-cafe-164531720.jpg",
        description: "Enjoy our best dishes.",
        actions: [
          { text: "View Specials", link: "https://example.com/specials" },
          { text: "Order Now", link: "https://example.com/order" },
          { text: "3", link: "https://example.com/order" },
        ],
      },
      // {
      //   by: "bot",
      //   text: "Today's specials are ready for you!",
      //   carousel: true,
      //   items: [
      //     {
      //       text: "Grilled Chicken",
      //       image: "https://example.com/grilled_chicken.jpg",
      //       description: "Perfectly grilled chicken with spices.",
      //       actions: [
      //         { text: "Order Grilled Chicken", link: "https://example.com/grilled_chicken" },
      //         { text: "More Info", link: "https://example.com/info_grilled_chicken" },
      //       ],
      //     },
      //   ],
      // },
      {
        by: "sender",
        text: "I'll have the grilled chicken, please.",
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
        ],
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
        ],
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
        ],
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
        ],
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
        ],
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
        ],
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
        ],
      },
      {
        by: "bot",
        text: "Your order for Grilled Chicken has been placed. Anything else?",
        actions: [
          { text: "Check Order Status", link: "https://example.com/order_status" },
        ],
      },
    ];

    vm.focusIndex = 0; // The message to focus when the chat is loaded

     // Message class for handling individual message interactions
     class Message {
      constructor(data, index) {
        this.text = data.text;
        this.description = data.description;
        this.actions = data.actions || [];
        this.actionFocusIndex = 0;
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
        console.log('ENTER',this.text, this.description, this.actions)
      }

      isActionFocused(actionIndex){
         if(vm.focusIndex == this.index){
          return actionIndex == this.actionFocusIndex;
         }
         return false; //when the message is not focused, even when the index is 0, the message is not focused
      }
      resetActionIndex(){
        this.actionFocusIndex = 0;
      }
    }

    vm.messageObjects = vm.messages.map((msg, index) => new Message(msg, index));

    // Handle moving to the next message
    vm.handleNextMessage = () => {
      vm.focusIndex++;
      if (vm.focusIndex >= vm.messages.length) {
        vm.focusIndex = 0; // Loop back to the first message
      }
    };

    // Handle moving to the previous message
    vm.handlePreviousMessage = () => {
      vm.focusIndex--;
      if (vm.focusIndex < 0) {
        vm.focusIndex = vm.messages.length - 1; // Loop back to the last message
      }
    };

   

    // Keydown handler for navigating between messages and actions
    vm.handleKeyDown = function (event) {
      event.preventDefault();
      const currentMessageObj = vm.messageObjects[vm.focusIndex];

      if (event.key === "ArrowDown") {
        currentMessageObj.handleArrowDown();
      } else if (event.key === "ArrowUp") {
        currentMessageObj.handleArrowUp();
      } else if (event.key === "Enter") {
        currentMessageObj.handleEnter();
      }

      // Focus the corresponding message and action button
      focusMessage(vm.focusIndex);
      focusActionButton(vm.focusIndex, currentMessageObj.actionFocusIndex);

    };

    function focusMessage(index) {
      $timeout(() => {
        const messages = document.querySelectorAll('.message');
        console.log('FOCUS MESSAGE ',messages)
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
