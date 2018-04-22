
function Chat () {}

Chat.prototype = {

    messagesList: [],
    chatsList: [],
    activeChats: [],

    initialize: function () {
        $(".toggle-chat.user").on("click", _.bind(this.toggleUserChat, this));
        $(document).on("keydown", ".message-input", _.bind(this.sendMessage, this));

        $(".all-chats").on("click", _.bind(this.toggleAllChats, this));
        // $(".all-chats").on("click", ".single-chat", _.bind(this.openAdminChat, this));
        // $(".all-chats").on("click", ".single-chat", function(e) {
        //     console.log("potato")
        // });

        $(document).on("click", ".single-chat", _.bind(this.openAdminChat, this));
        $(document).on("click", ".close-chat", _.bind(this.closeChat, this));

        /* TODO: uncomment this for polling on user's side */
        // setInterval(_.bind(function refreshChat() {
        //     this.getMessages();
        // }, this), 2000);
    },

    openAdminChat: function(e) {
        var chatElem = $(e.target).closest(".single-chat");
        var chatID = chatElem.data("chatid");
        var chatName = chatElem.data("name");

        var activeChatsIDs = _.pluck(this.activeChats, 'chatID');

        /* Add the chat to the active chats list */
        this.getMessagesForChat(chatID).then(_.bind(function(data) {
            var messages = data.chat.reverse();

            var chatIndex = activeChatsIDs.indexOf(chatID);
            if (chatIndex === -1) {
                this.activeChats.push({
                    chatID: chatID,
                    chatName: chatName,
                    messages: messages
                });

                var template = $("#full_conversation_template").html();
                $(".all-chats-container").prepend(_.template(template)({
                    chatID: chatID,
                    chatName: chatName,
                    messages: messages
                }));
            } else {
                this.activeChats[chatIndex].messages = messages;
            }



            var messagesTemplate = $("#conversation_template").html();
            $("#conversation_content_" + chatID).html(_.template(messagesTemplate)({
                messages: messages
            }));

            /* Register toggle event for header click */
            $("#chat_box_" + chatID + " .toggle-chat").off("click").on("click", function () {
                $("#chat_box_" + chatID).toggleClass("hidden");
            })

        }, this));
    },

    closeChat: function (e) {
        /* TODO: remove the chat from the active ones, and also the template. */

        $()
    },

    toggleUserChat: function(e) {
        var $chatWidget = $(e.target).parent().find('.chat-widget');

        if ($chatWidget.hasClass("hidden")) {
            this.getMessages().then(function() {
                $chatWidget.removeClass("hidden");
            });
        } else {
            $chatWidget.addClass("hidden");
        }
    },

    toggleAllChats: function(e) {
        var $chatWidget = $(e.target).siblings('.chat-widget');

        if ($chatWidget.hasClass("hidden")) {
            this.getAllChats().then(function() {
                $chatWidget.removeClass("hidden");
                $(".all-chats-container .chat-box").removeClass("hidden");
            });
        } else {
            $chatWidget.addClass("hidden");
            $(".all-chats-container .chat-box").addClass("hidden");
        }
    },

    getAllChats: function() {
        return $.ajax({
            method: "GET",
            url: "/chat",
            dataType: "json",
            success: _.bind(function(data) {

                this.chatsList = _.map(data.chats, function(x) {
                    return {
                        "id": x.id,
                        "name": x.name,
                        "unread": x.unread,
                        "time": x.timestamp
                    }
                });
                this.renderChatsTemplate();

                $(".toggle-chat.all-chats").addClass("active");

            }, this),
            error: function(err) {
                console.log(err);
            }
        });
    },

    getMessages: function() {
        return $.ajax({
            method: "GET",
            url: "/chat",
            dataType: "json",
            success: _.bind(function(data) {
                data.chats = data.chats.reverse();

                if (this.messagesList.length) {
                    var lastRecvMessage = data.chats[data.chats.length - 1];
                    var lastCrtMessage = this.messagesList[this.messagesList.length - 1];
                }

                if (!this.messagesList.length || (lastRecvMessage.message !== lastCrtMessage.message && lastRecvMessage.side !== lastCrtMessage.side)) {
                    this.messagesList = _.map(data.chats, function(x) { return {"message": x.message, "side": x.side}; });
                    this.renderMessagesTemplate();

                    $(".toggle-chat").addClass("active");
                }
            }, this),
            error: function(err) {
                console.log(err);
            }
        });
    },

    getMessagesForChat: function(chatID) {
        return $.ajax({
            method: "GET",
            url: "/chat/" + chatID,
            dataType: "json",
            success: _.bind(function(data) {
            }, this),
            error: function(err) {
                console.log(err);
            }
        });
    },

    renderMessagesTemplate: function() {
        var template = $("#conversation_template").html();
        $("#conversation_content").html(_.template(template)({messages: this.messagesList}));
    },

    renderChatsTemplate: function() {
        var template = $("#chats_template").html();
        $("#all_chats_content").html(_.template(template)({chats: this.chatsList}));
    },

    sendMessage: function(e) {
        /* On enter, submit. */
        if (e.which === 13) {
            e.preventDefault();
            var message = e.target.value;

            if (window.user.is_admin) {
                var chatID = $(e.target).closest(".chat-box").data("chatid");
                this.sendAdminMessage(chatID, message);
            } else {
                this.sendUserMessage(message);
            }

            $(e.target).val("");
        }
    },

    sendUserMessage: function(message) {
        this.messagesList.push({
            "message": message,
            "side": "right"
        });

        this.renderMessagesTemplate();

        $.ajax({
            method: "POST",
            url: "/chat",
            dataType: "json",
            data: {
                "chat_data": JSON.stringify({"message": message})
            },
            success: _.bind(function(data) {

            }, this),
            error: function(xhr) {
                // TODO: render a "message not sent" next or smth
                console.log(xhr);
            }
        });
    },

    sendAdminMessage: function(chatID, message) {

        var activeChatsIDs = _.pluck(this.activeChats, 'chatID');
        var chatIndex = activeChatsIDs.indexOf(chatID);

        this.activeChats[chatIndex].messages.push({
            "message": message,
            "side": "right"
        });

        var template = $("#conversation_template").html();
        $("#conversation_content_" + chatID).html(_.template(template)({messages: this.activeChats[chatIndex].messages}));

        $.ajax({
            method: "POST",
            url: "/chat/" + chatID,
            dataType: "json",
            data: {
                "message": JSON.stringify({"text": message})
            },
            success: _.bind(function(data) {
                console.log(data);
            }, this),
            error: function(xhr) {
                // TODO: render a "message not sent" next or smth
                console.log(xhr);
            }
        });
    }
};
