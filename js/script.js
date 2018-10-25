/* start the external action and say hello */
console.log("App is alive");

/* #10 create global array for channels array  */
var channels = [yummy, sevencontinents, killerapp, firstpersononmars, octoberfest];

/** #7 Create global variable */
var currentChannel;
/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // #7  Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7  change the channel location using object property
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* #7 remove either class */
    $('#chat h1 i').removeClass('far fas');

    /* #7 set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
    
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    $('#chat h1 i').toggleClass('fas');
    $('#chat h1 i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
    /* #10 - list channels according to selected tab button  */
    listChannels(tabId);
  
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {
    var emojis = require('emojis-list'); // #10 load emoji list
    $('#emojis').toggle(); // #toggle
    /* list out emojis */
    for (var i=0; i < emojis.length; i++){
        $('#emojis').append(emojis[i]);
    }
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var message = new Message($('#message').val());
    //console.log("New message:", message.text.length);

    /* #10 check input messsage is empty or not   */
    if (message.text.length==0) {
        alert('Please key in msg before press send button');
    }
    else {
       
    // #8 convenient message append with jQuery:
    $('#messages').append(createMessageElement(message));

    // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 clear the message input
    $('#message').val('');

    /* #10 - push message to currentChannel in channel.js   */
    currentChannel.messages.push(message);
    currentChannel.messageCount++;
    }
}

/**
 * #10 This #constructor function creates a new channel #message.
 * @param text `String` a channel name text
 * @constructor
 */
function Channel (text) {
    this.name = '#'+text;
    this.createdOn = new Date();
    this.createdBy = currentLocation.what3words;
    this.starred = false;
    this.expiresIn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    this.messageCount = 0;
    this.messages = [];
}


/* #10 function to create new Channel  */
function createChannel() {
    // #10 Create a new channel and send it to channel.js and message to#messages  */
    
    // #10 let's now use the real message #input
    var newChannel = new Channel($('#newChannelName').val());
    console.log("New message:", newChannel.name.length);

    /* #10 check input messsage is empty or not   */
    if (newChannel.name.length==1) {
        alert('Please key in channel name before press Create button');
    }
    else {
       
    // #10 clear the new channel  input
    $('#newChannelName').val('');

    // #10 update current channel name  
    currentChannel = newChannel;
    }
}

/* #10 function to combine 3 functions when pressing CREATE button "*/
function create() {
    createChannel();
    sendMessage();
    restoreMessageBox()
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent">+5 min.</button>' +
        '</div>';
}


function listChannels(tabId) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")

    // #8 five new channels
    /*$('#channels ul').append(createChannelElement(yummy));
    $('#channels ul').append(createChannelElement(sevencontinents));
    $('#channels ul').append(createChannelElement(killerapp));
    $('#channels ul').append(createChannelElement(firstpersononmars));
    $('#channels ul').append(createChannelElement(octoberfest));*/

    $('#channels ul').empty();  // #10 delete channels contents initially to prevent duplicate */
    /* #10 add condition to determine which criterion for channel sorting to use  */
    if (tabId == '#tab-new') {
        channels.sort(compareDate);
        //console.log('channels-new :', channels);
        }
    else if (tabId == '#tab-trending') {
        channels.sort(compareMessage);
        //console.log('channels-trending :', channels);
        }
    else {
        channels.sort(compareStarred);
        //console.log('channels-starred :', channels);
    }
    
    
    //  #9 for loop to list channels   
    for (var i=0; i < channels.length; i++) {
        //console.log ('list channel', channels[i]);
        $('#channels ul').append(createChannelElement(channels[i]));
    }




}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel

    //#10 add switch channel to channel list  */
        var channel = $('<li>').text(channelObject.name).attr('onClick','restoreMessageBox()');
    
    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}

/* #10 function to compare date  */
 function compareDate (a, b)  {
    if (a.createdOn < b.createdOn) {
      return 1;  //newest on top
    }
    else {
      return -1;
    }
  }

 /* #10 function to compare numnber of Messages  */
 function compareMessage (a, b) {
    if (a.messageCount < b.messageCount) {
        return 1;  //most messages on top
      }
    else {
        return -1;
      }
 }

/* #10 function to compare starred or unstarred channels   */
function compareStarred (a, b) {
    if (a.starred < b.starred) {
        return 1;
      }
    else {
        return -1;
      }
}

/* #10 function to create new channel when FAB is pressed  */ 
function createNewChannel() {
    $("#messages").empty();
    $("#chat h1").empty();
    $("#arrow-button").html('CREATE');
    input = jQuery('<input type="text" placeholder="Enter a ChannelName..." maxlength="140" id="newChannelName">'); 
    $("#chat h1").append(input);
    $("<button>").text('X ABORT').addClass('primary2').appendTo("#chat h1").attr('onClick','restoreMessageBox()');
    $("#arrow-button").attr("onclick","create()");
} 

/* #10 restore channel to chat box  */
function restoreMessageBox()  {
    $("#chat h1").empty();
    $("#arrow-button").html('<i class="fas fa-arrow-right"></i>');
    $('<span>').attr('id', 'channel-name').text(currentChannel.name).appendTo("#chat h1");
    $('<small>').attr('id', 'channel-location').text(' by ').appendTo("#chat h1");
    $('<strong>').text(currentChannel.createdBy).appendTo('#channel-location');
    $('<i>').addClass(currentChannel.starred ? 'fas' : 'far').addClass("fa-star").attr('onClick','star()').appendTo("#chat h1");
}

