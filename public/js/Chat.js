
function Chat () {}

Chat.prototype = {

    messagesList: [],
    chatsList: [],
    allChatsOld: [],
    activeChat: null,

    initialize: function () {
        $(".toggle-chat.user").on("click", _.bind(this.toggleUserChat, this));
        $(document).on("keydown", ".message-input", _.bind(this.sendMessage, this));

        $(".all-chats").on("click", _.bind(this.toggleAllChats, this));

        $(document).on("click", ".single-chat", _.bind(this.openAdminChat, this));
        $(document).on("click", ".close-chat", _.bind(this.closeChat, this));

        if (window.user.is_admin) {
            $(document).on("click", ".chat-widget", _.bind(function() {
                $(".toggle-chat.all-chats").removeClass("active");
            }, this));
        }

        setInterval(_.bind(function refreshChat() {
            if (window.user.is_admin) {
                this.getAllChats();
                if (this.activeChat) {
                    this.getMessagesForChat(this.activeChat.chatID).done(_.bind(function (data) {
                        this.renderChatMessagesTemplate();
                    }, this));
                }
            } else {
                this.getUserMessages();
            }
        }, this), 1500);
    },

    openAdminChat: function(e) {
        var chatElem = $(e.target).closest(".single-chat");
        var chatID = chatElem.data("chatid");
        var chatName = chatElem.data("name");

        if (this.activeChat && (chatID !== this.activeChat.chatID)) {
            $("#chat_box_" + this.activeChat.chatID).remove();
            this.activeChat = null;
        }

        /* Add the chat to the active chats list */
        this.getMessagesForChat(chatID).then(_.bind(function(data) {
            var messages = data.chat.reverse();

            if (!this.activeChat) {
                this.activeChat = {
                    chatID: chatID,
                    chatName: chatName,
                    messages: messages
                };

                var template = $("#full_conversation_template").html();
                $(".all-chats-container").prepend(_.template(template)(this.activeChat));
            } else {
                this.activeChat.messages = messages;
            }

            this.renderChatMessagesTemplate();

            /* Register toggle event for header click */
            $("#chat_box_" + chatID + " .toggle-chat").off("click").on("click", function () {
                $("#chat_box_" + chatID).toggleClass("hidden");
            })

        }, this));
    },

    closeChat: function (e) {
        $(e.target).closest(".chat-box").remove();
        this.activeChat = null;
    },

    toggleUserChat: function(e) {
        var $chatBox = $(e.target).closest(".chat-box");

        $(".toggle-chat").removeClass("active");

        if ($chatBox.hasClass("hidden")) {
            this.getUserMessages().then(function() {
                $chatBox.removeClass("hidden");
            });
        } else {
            $chatBox.addClass("hidden");
        }
    },

    toggleAllChats: function(e) {
        var $chatBox = $(e.target).closest(".chat-box");

        if ($chatBox.hasClass("hidden")) {
            this.getAllChats().then(function() {
                $chatBox.removeClass("hidden");
            });
        } else {
            $chatBox.addClass("hidden");
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

                var diffs = data.chats.filter(_.bind(function(v) {
                    return this.allChatsOld.filter(function(v2) {return v2.id === v.id && v.unread > v2.unread}).length;
                }, this));


                if (diffs.length) {
                    this.renderChatsTemplate();
                    $(".toggle-chat.all-chats").addClass("active");
                }

                this.allChatsOld = data.chats;
            }, this),
            error: function(err) {
                console.log(err);
            }
        });
    },

    getUserMessages: function() {
        return $.ajax({
            method: "GET",
            url: "/chat",
            dataType: "json",
            success: _.bind(function(data) {
                data.chats = data.chats.reverse();

                if (!data.chats.length) {
                    return;
                }

                if (this.messagesList.length) {
                    var lastRecvMessage = data.chats[data.chats.length - 1];
                    var lastCrtMessage = this.messagesList[this.messagesList.length - 1];
                }

                if (!this.messagesList.length || (lastRecvMessage.id !== lastCrtMessage.id)) {
                    this.messagesList = _.map(data.chats, function(x) { return {"id": x.id, "message": x.message, "side": x.side}; });
                    this.renderMessagesTemplate();

                    if ($(".chat-box").hasClass("hidden")) {
                        $(".toggle-chat").addClass("active");
                    }
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
                if (this.activeChat) {

                    // if (this.activeChat.unread)

                    this.activeChat.messages = data.chat.reverse();
                }
            }, this),
            error: function(err) {
                console.log(err);
            }
        });
    },

    renderChatMessagesTemplate: function() {
        var messagesTemplate = $("#conversation_template").html();
        $("#conversation_content_" + this.activeChat.chatID).html(_.template(messagesTemplate)({
            messages: this.activeChat.messages
        }));
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
            "id": null,
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
        this.activeChat.messages.push({
            "message": message,
            "side": "right"
        });

        var template = $("#conversation_template").html();
        $("#conversation_content_" + chatID).html(_.template(template)({messages: this.activeChat.messages}));

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
